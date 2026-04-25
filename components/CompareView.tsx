"use client";

import { useState } from "react";
import CompareInput from "./CompareInput";
import HighlightedMessage, { HighlightLegend } from "./HighlightedMessage";
import ThinkingSequence from "./ThinkingSequence";
import SectionTitle from "./SectionTitle";
import type { AnalysisResult, ApiResponse } from "@/types/analysis";
import { MAX_INPUT_CHARS } from "@/lib/validate";
import { buildAxisRows, buildDeltaSentence, type AxisRow } from "@/lib/compare";

const MIN_THINKING_MS = 2400;
const HEBREW_RE = /[֐-׿]/;

interface SidePayload {
  message: string;
  result: AnalysisResult | null;
  sourceUrl: string | null;
}

export default function CompareView() {
  const [a, setA] = useState<SidePayload>({ message: "", result: null, sourceUrl: null });
  const [b, setB] = useState<SidePayload>({ message: "", result: null, sourceUrl: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aTrim = a.message.trim();
  const bTrim = b.message.trim();
  const overLimit = a.message.length > MAX_INPUT_CHARS || b.message.length > MAX_INPUT_CHARS;
  const canSubmit = !loading && aTrim.length > 0 && bTrim.length > 0 && !overLimit;

  async function analyzeOne(message: string): Promise<AnalysisResult> {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context: "news", goal: "neutralize" }),
    });
    const json = (await res.json()) as ApiResponse;
    if (!json.ok) throw new Error(json.error || "Analysis failed.");
    return json.data;
  }

  async function handleCompare() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    const startedAt = Date.now();
    try {
      const [resA, resB] = await Promise.all([
        analyzeOne(aTrim),
        analyzeOne(bTrim),
      ]);

      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_THINKING_MS) {
        await new Promise((r) => setTimeout(r, MIN_THINKING_MS - elapsed));
      }

      setA((s) => ({ ...s, result: resA }));
      setB((s) => ({ ...s, result: resB }));
      requestAnimationFrame(() => {
        document
          .getElementById("compare-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Comparison failed.");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setA({ message: "", result: null, sourceUrl: null });
    setB({ message: "", result: null, sourceUrl: null });
    setError(null);
  }

  return (
    <div className="space-y-12 sm:space-y-14">
      <section className="fade-in">
        <SectionTitle
          eyebrow="Compare mode"
          title="Two pieces of content, side by side"
          description="Paste two articles, posts, or paragraphs. Intenta will surface where their framing, tone, and bias differ."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <CompareInput
            side="A"
            value={a.message}
            onChange={(v) => setA((s) => ({ ...s, message: v }))}
            disabled={loading}
            sourceUrl={a.sourceUrl}
            onSourceUrl={(u) => setA((s) => ({ ...s, sourceUrl: u }))}
          />
          <CompareInput
            side="B"
            value={b.message}
            onChange={(v) => setB((s) => ({ ...s, message: v }))}
            disabled={loading}
            sourceUrl={b.sourceUrl}
            onSourceUrl={(u) => setB((s) => ({ ...s, sourceUrl: u }))}
          />
        </div>

        <div className="mt-5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/5 pt-5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={clearAll}
              disabled={loading || (!a.message && !b.message)}
              className="focus-ring rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 active:scale-[0.97] disabled:opacity-40"
            >
              Clear both
            </button>
            {error && (
              <span
                role="alert"
                className="rounded-lg border border-rose-300/30 bg-rose-400/10 px-3 py-1.5 text-xs text-rose-200 fade-in"
              >
                {error}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCompare}
            disabled={!canSubmit}
            className={
              "focus-ring inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition active:scale-[0.97] " +
              (canSubmit
                ? "bg-white text-ink-950 shadow-glow hover:scale-[1.02]"
                : "bg-white/10 text-white/40 cursor-not-allowed active:scale-100")
            }
          >
            {loading ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-ink-700 border-t-transparent" />
                Comparing…
              </>
            ) : (
              <>
                Compare
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </section>

      <section id="compare-results" className="fade-in">
        <SectionTitle
          eyebrow="Result"
          title="Comparison"
          description="Highlights inside each piece, and the differences that matter most."
        />

        {loading && <ThinkingSequence />}

        {!loading && (!a.result || !b.result) && <CompareEmpty />}

        {!loading && a.result && b.result && (
          <CompareReport
            a={{ message: a.message, result: a.result }}
            b={{ message: b.message, result: b.result }}
          />
        )}
      </section>
    </div>
  );
}

function CompareEmpty() {
  return (
    <div className="glass rounded-3xl p-6 sm:p-8 fade-in">
      <span className="badge">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulseRing" />
        Awaiting two inputs
      </span>
      <h3 className="mt-3 font-display text-xl font-semibold text-white">
        Paste two pieces of content above and hit Compare.
      </h3>
      <p className="mt-2 max-w-2xl text-sm text-white/55">
        Useful when you want to see how different sources frame the same
        story, how a headline compares to its lede, or how an opinion piece
        compares to a news report.
      </p>
    </div>
  );
}

function CompareReport({
  a,
  b,
}: {
  a: { message: string; result: AnalysisResult };
  b: { message: string; result: AnalysisResult };
}) {
  const dirA = a.result.language === "he" || HEBREW_RE.test(a.message) ? "rtl" : "ltr";
  const dirB = b.result.language === "he" || HEBREW_RE.test(b.message) ? "rtl" : "ltr";
  const axes = buildAxisRows(a.result, b.result);
  const deltaSentence = buildDeltaSentence(a.result, b.result);

  return (
    <div className="space-y-5">
      {/* Top "diff snapshot" — Same story. Different framing. */}
      <DiffSnapshot deltaSentence={deltaSentence} axes={axes} />

      {/* Two columns of annotated content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <SidePane label="A" tone="violet" message={a.message} result={a.result} dir={dirA} />
        <SidePane label="B" tone="cyan" message={b.message} result={b.result} dir={dirB} />
      </div>

      {/* Diff cards */}
      <DiffCard
        title="Framing difference"
        a={a.result.perceivedByOtherSide}
        b={b.result.perceivedByOtherSide}
      />
      <DiffCard title="Tone difference" a={a.result.overallTone} b={b.result.overallTone} />
      <DiffCard
        title="Emotional load difference"
        a={a.result.emotionalImpact}
        b={b.result.emotionalImpact}
      />
      <BiasDiffCard a={a.result.communicationRisks} b={b.result.communicationRisks} />
      <ScoreDiff a={a.result} b={b.result} />
    </div>
  );
}

function SidePane({
  label,
  tone,
  message,
  result,
  dir,
}: {
  label: "A" | "B";
  tone: "violet" | "cyan";
  message: string;
  result: AnalysisResult;
  dir: "ltr" | "rtl";
}) {
  const chip =
    tone === "violet" ? "bg-violet-500/30 text-white" : "bg-cyan-400/25 text-white";
  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className={"grid h-7 w-7 place-items-center rounded-lg text-[12px] font-semibold " + chip}>
          {label}
        </span>
        <span className="font-display text-[15px] font-semibold text-white">
          Content {label}
        </span>
        <span className="ms-auto badge font-mono">
          {result.highlights?.length ?? 0} flagged
        </span>
      </div>
      <div className="rounded-xl border border-white/8 bg-ink-900/55 p-3.5 max-h-[420px] overflow-auto">
        <HighlightedMessage
          message={message}
          highlights={result.highlights}
          dir={dir}
        />
      </div>
      <div className="mt-3">
        <HighlightLegend />
      </div>
    </div>
  );
}

function DiffCard({ title, a, b }: { title: string; a: string; b: string }) {
  return (
    <section className="glass rounded-2xl p-5 sm:p-6 shadow-soft">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-[15px] font-semibold tracking-tightish text-white">
          {title}
        </h3>
        <span className="badge font-mono">A vs B</span>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DiffSide label="A" tone="violet" text={a} />
        <DiffSide label="B" tone="cyan" text={b} />
      </div>
    </section>
  );
}

function DiffSide({
  label,
  tone,
  text,
}: {
  label: "A" | "B";
  tone: "violet" | "cyan";
  text: string;
}) {
  const wrap =
    tone === "violet"
      ? "border-violet-300/25 bg-violet-400/[0.06]"
      : "border-cyan-300/25 bg-cyan-400/[0.06]";
  const chip =
    tone === "violet"
      ? "bg-violet-500/25 text-violet-100"
      : "bg-cyan-400/25 text-cyan-100";
  return (
    <div className={"rounded-2xl border p-4 " + wrap}>
      <div className="flex items-center gap-2">
        <span className={"grid h-6 w-6 place-items-center rounded-md text-[11px] font-semibold " + chip}>
          {label}
        </span>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-white/90 whitespace-pre-wrap">
        {text || "—"}
      </p>
    </div>
  );
}

function BiasDiffCard({ a, b }: { a: string[]; b: string[] }) {
  if ((!a || !a.length) && (!b || !b.length)) return null;
  return (
    <section className="glass rounded-2xl p-5 sm:p-6 shadow-soft">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-[15px] font-semibold tracking-tightish text-white">
          Bias-signal difference
        </h3>
        <span className="badge font-mono">A vs B</span>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <BiasCol label="A" tone="violet" items={a} />
        <BiasCol label="B" tone="cyan" items={b} />
      </div>
    </section>
  );
}

function BiasCol({
  label,
  tone,
  items,
}: {
  label: "A" | "B";
  tone: "violet" | "cyan";
  items: string[];
}) {
  const wrap =
    tone === "violet"
      ? "border-violet-300/25 bg-violet-400/[0.06]"
      : "border-cyan-300/25 bg-cyan-400/[0.06]";
  return (
    <div className={"rounded-2xl border p-4 " + wrap}>
      <div className="mb-2 flex items-center gap-2 eyebrow">{label}</div>
      {items?.length ? (
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li
              key={i}
              className="flex gap-2 rounded-lg border border-white/10 bg-ink-900/40 p-2.5 text-[13px] text-white/85"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-300/80" />
              {it}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-white/45">No bias signals flagged.</p>
      )}
    </div>
  );
}

function ScoreDiff({ a, b }: { a: AnalysisResult; b: AnalysisResult }) {
  const rows: { label: string; a: number; b: number; tone: string }[] = [
    {
      label: "Clarity",
      a: a.clarityScore,
      b: b.clarityScore,
      tone: "from-amber-300 to-amber-500",
    },
    {
      label: "Balance",
      a: a.empathyScore,
      b: b.empathyScore,
      tone: "from-emerald-300 to-emerald-500",
    },
    {
      label: "Intensity",
      a: a.assertivenessScore,
      b: b.assertivenessScore,
      tone: "from-violet-300 to-fuchsia-500",
    },
  ];

  return (
    <section className="glass rounded-2xl p-5 sm:p-6 shadow-soft">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-[15px] font-semibold tracking-tightish text-white">
          Impact score difference
        </h3>
        <span className="badge font-mono">A vs B</span>
      </header>
      <div className="space-y-4">
        {rows.map((r) => {
          const delta = r.b - r.a;
          return (
            <div key={r.label}>
              <div className="mb-1 flex items-baseline justify-between gap-2 text-[12px]">
                <span className="eyebrow">{r.label}</span>
                <span className="font-mono text-white/60 tabular-nums">
                  A <span className="text-white">{r.a}</span> · B{" "}
                  <span className="text-white">{r.b}</span>{" "}
                  <span
                    className={
                      "ml-1 " +
                      (delta > 0
                        ? "text-emerald-300"
                        : delta < 0
                        ? "text-rose-300"
                        : "text-white/40")
                    }
                  >
                    ({delta > 0 ? "+" : ""}
                    {delta})
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Bar label="A" value={r.a} color={"bg-gradient-to-r " + r.tone} />
                <Bar label="B" value={r.b} color={"bg-gradient-to-r " + r.tone} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={"absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out " + color}
          style={{ width: pct + "%" }}
        />
      </div>
      <div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-white/40">
        {label}
      </div>
    </div>
  );
}

function DiffSnapshot({
  deltaSentence,
  axes,
}: {
  deltaSentence: string;
  axes: AxisRow[];
}) {
  return (
    <section className="grad-border rounded-2xl shadow-glow fade-in">
      <div className="rounded-2xl bg-ink-900/75 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Diff snapshot</p>
            <h3 className="mt-1 font-display text-xl sm:text-2xl font-semibold tracking-tightish text-white">
              Same story.{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                Different framing.
              </span>
            </h3>
          </div>
          <span className="badge font-mono">A vs B</span>
        </div>
        <p className="mt-3 text-[14.5px] sm:text-[15px] leading-relaxed text-white/85">
          {deltaSentence}
        </p>

        {/* Vertical diff bars */}
        <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-5">
          {axes.map((row) => (
            <DiffBar key={row.key} row={row} />
          ))}
        </div>
        <p className="mt-3 text-[11px] text-white/40">
          Bars show each axis as a vertical column for A and B. The taller
          column carries more of that signal.
        </p>
      </div>
    </section>
  );
}

function DiffBar({ row }: { row: AxisRow }) {
  // A → violet, B → cyan; the leader is bolder.
  const aPct = Math.max(4, Math.min(100, row.a));
  const bPct = Math.max(4, Math.min(100, row.b));
  const aLeader = row.leader === "a";
  const bLeader = row.leader === "b";
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
      <div className="text-[11px] font-mono uppercase tracking-wider text-white/55 text-center">
        {row.label}
      </div>
      <div className="mt-3 flex items-end justify-center gap-3 h-24">
        {/* A column */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-mono text-[10px] tabular-nums text-white/55">
            {Math.round(row.a)}
          </span>
          <div
            className={
              "w-6 rounded-t-md transition-[height] duration-700 ease-out " +
              (aLeader
                ? "bg-gradient-to-t from-violet-500 to-fuchsia-300 shadow-[0_0_18px_-4px_rgba(139,92,246,0.7)]"
                : "bg-gradient-to-t from-violet-500/40 to-fuchsia-300/40")
            }
            style={{ height: `${aPct}%`, minHeight: 6 }}
          />
          <span
            className={
              "rounded-md px-1.5 py-0.5 text-[10px] font-semibold " +
              (aLeader
                ? "bg-violet-500/30 text-white"
                : "bg-white/5 text-white/55")
            }
          >
            A
          </span>
        </div>
        {/* B column */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-mono text-[10px] tabular-nums text-white/55">
            {Math.round(row.b)}
          </span>
          <div
            className={
              "w-6 rounded-t-md transition-[height] duration-700 ease-out " +
              (bLeader
                ? "bg-gradient-to-t from-cyan-500 to-sky-300 shadow-[0_0_18px_-4px_rgba(34,211,238,0.7)]"
                : "bg-gradient-to-t from-cyan-500/40 to-sky-300/40")
            }
            style={{ height: `${bPct}%`, minHeight: 6 }}
          />
          <span
            className={
              "rounded-md px-1.5 py-0.5 text-[10px] font-semibold " +
              (bLeader
                ? "bg-cyan-400/30 text-white"
                : "bg-white/5 text-white/55")
            }
          >
            B
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import SectionTitle from "./SectionTitle";
import UrlInput from "./UrlInput";
import CopyButton from "./cards/CopyButton";
import ThinkingSequence from "./ThinkingSequence";
import { MAX_INPUT_CHARS } from "@/lib/validate";
import type { ExplainResponse } from "@/types/analysis";

const HEBREW_RE = /[֐-׿]/;
const MIN_THINKING_MS = 1800;

interface ExplainResult {
  explanation: string;
  language: "he" | "en";
}

export default function ExplainView() {
  const [content, setContent] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExplainResult | null>(null);

  const trimmed = content.trim();
  const overLimit = content.length > MAX_INPUT_CHARS;
  const canSubmit = !loading && trimmed.length > 0 && !overLimit;
  const dir = HEBREW_RE.test(content) ? "rtl" : "ltr";

  async function handleExplain() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const startedAt = Date.now();
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const json = (await res.json()) as ExplainResponse;
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_THINKING_MS) {
        await new Promise((r) => setTimeout(r, MIN_THINKING_MS - elapsed));
      }
      if (!json.ok) {
        setError(json.error || "Couldn't generate an explanation.");
      } else {
        setResult(json.data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setContent("");
    setError(null);
    setResult(null);
    setSourceUrl(null);
  }

  return (
    <div className="space-y-12 sm:space-y-14">
      <section className="fade-in">
        <SectionTitle
          eyebrow="Explain mode"
          title="Why does this content land the way it does?"
          description="Get a single short paragraph in plain language — no scores, no cards, just the read."
        />

        <div className="grad-border glass-strong rounded-3xl p-4 sm:p-6 shadow-glow">
          <div className="mb-3 flex items-center justify-between gap-2">
            <label className="eyebrow">Content to explain</label>
            <button
              type="button"
              onClick={() => setShowUrl((v) => !v)}
              className="focus-ring inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/75 hover:bg-white/10 active:scale-[0.97]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 1 0-7.07-7.07l-1 1" />
                <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 1 0 7.07 7.07l1-1" />
              </svg>
              {showUrl ? "Hide URL" : "Import URL"}
            </button>
          </div>

          {showUrl && (
            <div className="mb-4">
              <UrlInput
                disabled={loading}
                onLoaded={(c, m) => {
                  setContent(c);
                  setSourceUrl(m.url);
                  setError(null);
                }}
              />
            </div>
          )}

          <div className="grad-border rounded-2xl">
            <textarea
              value={content}
              dir={dir}
              onChange={(e) => {
                setContent(e.target.value);
                if (sourceUrl) setSourceUrl(null);
              }}
              placeholder="Paste an article, a paragraph, a tweet — whatever you want explained…"
              spellCheck
              rows={8}
              className="focus-ring block w-full resize-y rounded-2xl bg-ink-900/70 p-4 sm:p-5 text-[15px] leading-relaxed text-white placeholder:text-white/30"
            />
          </div>

          {sourceUrl && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/60">
              <span className="font-mono truncate max-w-[60ch]">Source: {sourceUrl}</span>
            </p>
          )}

          <div className="mt-5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/5 pt-5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleClear}
                disabled={loading || (!content && !result)}
                className="focus-ring rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 active:scale-[0.97] disabled:opacity-40"
              >
                Clear
              </button>
              {error && (
                <span
                  role="alert"
                  className="rounded-lg border border-rose-300/30 bg-rose-400/10 px-3 py-1.5 text-xs text-rose-200 fade-in"
                >
                  {error}
                </span>
              )}
              <span
                className={
                  "badge font-mono " +
                  (overLimit ? "text-rose-300 border-rose-400/40" : "")
                }
              >
                {content.length.toLocaleString()} / {MAX_INPUT_CHARS.toLocaleString()}
              </span>
            </div>

            <button
              type="button"
              onClick={handleExplain}
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
                  Explaining…
                </>
              ) : (
                <>
                  Explain
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="fade-in">
        <SectionTitle
          eyebrow="Result"
          title="Plain-language read"
          description="One short paragraph — no jargon, no scoring, hedged where the AI is unsure."
        />

        {loading && <ThinkingSequence />}
        {!loading && !result && <ExplainEmpty />}
        {!loading && result && <ExplainResultCard result={result} />}
      </section>
    </div>
  );
}

function ExplainEmpty() {
  return (
    <div className="glass rounded-3xl p-6 sm:p-8 fade-in">
      <span className="badge">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulseRing" />
        Awaiting input
      </span>
      <h3 className="mt-3 font-display text-xl font-semibold text-white">
        Paste content above and Intenta will summarize the why.
      </h3>
      <p className="mt-2 max-w-2xl text-sm text-white/55">
        Useful when you want a quick gut-check on a tweet, a headline, or a
        paragraph — without the full dashboard.
      </p>
    </div>
  );
}

function ExplainResultCard({ result }: { result: ExplainResult }) {
  const dir = result.language === "he" ? "rtl" : "ltr";
  return (
    <section className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-soft fade-in">
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl bg-gradient-to-br from-violet-400/30 to-fuchsia-400/10" />
      <header className="relative mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500/20 text-violet-100">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2v.3h6V17c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z" />
              <path d="M9 21h6" />
            </svg>
          </span>
          <h3 className="font-display text-[15px] font-semibold tracking-tightish text-white">
            Explanation
          </h3>
        </div>
        <CopyButton text={result.explanation} label="Copy" />
      </header>
      <div className="grad-border rounded-xl">
        <p
          dir={dir}
          className="rounded-xl bg-ink-900/60 p-5 text-[16px] leading-relaxed text-white/95 whitespace-pre-wrap"
        >
          {result.explanation}
        </p>
      </div>
      <p className="mt-3 text-[12px] text-white/45">
        Hedged read — Intenta does not fact-check or assign motive.
      </p>
    </section>
  );
}

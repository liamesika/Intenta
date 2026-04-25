"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ContextSelector from "./ContextSelector";
import GoalSelector from "./GoalSelector";
import DemoExamples from "./DemoExamples";
import ResultsPanel from "./ResultsPanel";
import ThinkingSequence from "./ThinkingSequence";
import EmptyResults from "./EmptyResults";
import SectionTitle from "./SectionTitle";
import UrlInput from "./UrlInput";
import DemoGuide from "./DemoGuide";
import { DEMO_EVENT, type DemoEventDetail } from "./HeroLive";
import type {
  AnalysisResult,
  ApiResponse,
  ContextType,
  GoalType,
} from "@/types/analysis";
import { MAX_INPUT_CHARS } from "@/lib/validate";
import type { DemoExample } from "@/lib/examples";

const HEBREW_RE = /[֐-׿]/;
const MIN_THINKING_MS = 2400;

function detectDir(text: string): "rtl" | "ltr" {
  return HEBREW_RE.test(text) ? "rtl" : "ltr";
}

interface ResultState {
  data: AnalysisResult;
  message: string;
}

interface RunPayload {
  message: string;
  context: ContextType;
  goal: GoalType;
  sourceUrl?: string | null;
  demo?: boolean;
}

export default function Workspace() {
  const [message, setMessage] = useState("");
  const [context, setContext] = useState<ContextType>("news");
  const [goal, setGoal] = useState<GoalType>("neutralize");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [demoActive, setDemoActive] = useState(false);

  // Token to ignore stale in-flight responses if a new request starts.
  const requestIdRef = useRef(0);

  const charCount = message.length;
  const overLimit = charCount > MAX_INPUT_CHARS;
  const trimmed = message.trim();
  const canSubmit = !loading && trimmed.length > 0 && !overLimit;
  const dir = useMemo(() => detectDir(message), [message]);

  const runAnalyze = useCallback(
    async (payload: RunPayload) => {
      const text = payload.message.trim();
      if (!text) return;
      const myToken = ++requestIdRef.current;

      // Reflect the inputs in the UI so the workspace shows what's running.
      setMessage(payload.message);
      setContext(payload.context);
      setGoal(payload.goal);
      setSourceUrl(payload.sourceUrl ?? null);
      setError(null);
      setResult(null);
      setLoading(true);

      const startedAt = Date.now();
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            context: payload.context,
            goal: payload.goal,
            ...(payload.sourceUrl ? { sourceUrl: payload.sourceUrl } : {}),
          }),
        });
        const json = (await res.json()) as ApiResponse;
        const elapsed = Date.now() - startedAt;
        if (elapsed < MIN_THINKING_MS) {
          await new Promise((r) => setTimeout(r, MIN_THINKING_MS - elapsed));
        }
        if (myToken !== requestIdRef.current) return; // stale
        if (!json.ok) {
          setError(json.error || "Something went wrong.");
        } else {
          setResult({ data: json.data, message: text });
          if (payload.demo) setDemoActive(true);
          requestAnimationFrame(() => {
            document
              .getElementById("results")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }
      } catch (e) {
        if (myToken !== requestIdRef.current) return;
        setError(e instanceof Error ? e.message : "Network error.");
      } finally {
        if (myToken === requestIdRef.current) setLoading(false);
      }
    },
    [],
  );

  // Cmd/Ctrl + Enter to submit
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (canSubmit) {
          runAnalyze({ message: trimmed, context, goal, sourceUrl });
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canSubmit, trimmed, context, goal, sourceUrl, runAnalyze]);

  // Listen for hero CTA "Analyze this example"
  useEffect(() => {
    function onDemo(e: Event) {
      const ce = e as CustomEvent<DemoEventDetail>;
      const d = ce.detail;
      if (!d?.message) return;
      runAnalyze({
        message: d.message,
        context: d.context as ContextType,
        goal: d.goal as GoalType,
        demo: true,
      });
    }
    window.addEventListener(DEMO_EVENT, onDemo as EventListener);
    return () => window.removeEventListener(DEMO_EVENT, onDemo as EventListener);
  }, [runAnalyze]);

  function pickExample(example: DemoExample) {
    // Demo mode: autofill, scroll to workspace, auto-trigger analyze.
    setError(null);
    requestAnimationFrame(() => {
      document
        .getElementById("workspace")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    runAnalyze({
      message: example.message,
      context: example.context,
      goal: example.goal,
      demo: true,
    });
  }

  function handleUrlLoaded(content: string, meta: { title: string; url: string }) {
    setMessage(content);
    setSourceUrl(meta.url);
    setError(null);
  }

  function handleClick() {
    if (!canSubmit) return;
    runAnalyze({ message: trimmed, context, goal, sourceUrl });
  }

  function handleClear() {
    setMessage("");
    setError(null);
    setResult(null);
    setSourceUrl(null);
  }

  return (
    <div className="space-y-14 sm:space-y-16">
      {/* WORKSPACE SECTION */}
      <section id="workspace" className="fade-in">
        <SectionTitle
          eyebrow="01 — Workspace"
          title="Analyze content beyond the surface"
          description="Understand framing, tone, and impact."
          right={
            <span
              className={
                "badge font-mono " +
                (overLimit ? "text-rose-300 border-rose-400/40" : "")
              }
            >
              {charCount.toLocaleString()} / {MAX_INPUT_CHARS.toLocaleString()}
            </span>
          }
        />

        <div className="grad-border glass-strong rounded-3xl p-4 sm:p-6 shadow-glow">
          <UrlInput
            onLoaded={handleUrlLoaded}
            disabled={loading}
            className="mb-5"
          />

          <div className="my-5 divider" />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="eyebrow">Or paste content</label>
              <span className="text-[11px] text-white/40">
                Hebrew & English supported · auto RTL
              </span>
            </div>
            <div className="grad-border rounded-2xl">
              <textarea
                value={message}
                dir={dir}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (sourceUrl) setSourceUrl(null);
                }}
                placeholder="Paste an article, social post, opinion piece, or any content you want to analyze…"
                spellCheck
                rows={9}
                className="focus-ring block w-full resize-y rounded-2xl bg-ink-900/70 p-4 sm:p-5 text-[15px] leading-relaxed text-white placeholder:text-white/30"
              />
            </div>
            {sourceUrl && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/60 fade-in">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 1 0-7.07-7.07l-1 1" />
                  <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 1 0 7.07 7.07l1-1" />
                </svg>
                <span className="font-mono truncate max-w-[60ch]">
                  Source: {sourceUrl}
                </span>
              </p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContextSelector
              value={context}
              onChange={setContext}
              disabled={loading}
            />
            <GoalSelector value={goal} onChange={setGoal} disabled={loading} />
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/5 pt-5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleClear}
                disabled={loading || (!message && !result)}
                className="focus-ring rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100"
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
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[12px] text-white/40">
                <span className="kbd">⌘</span>
                <span className="kbd">↵</span>
                <span>to analyze</span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleClick}
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
                  Analyzing…
                </>
              ) : (
                <>
                  Analyze content
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section className="fade-in">
        <SectionTitle
          eyebrow="02 — Insight"
          title="Content analysis"
          description="Framing, tone & emotion, bias signals, impact, and a neutral rewrite — at a glance."
        />
        <div className="min-stage">
          {loading && <ThinkingSequence />}
          {!loading && result && (
            <ResultsPanel data={result.data} originalMessage={result.message} />
          )}
          {!loading && !result && <EmptyResults />}
        </div>
      </section>

      {/* EXAMPLES SECTION */}
      <section className="fade-in">
        <SectionTitle
          eyebrow="03 — Examples"
          title="Try a sample piece of content"
          description="A news-style report, a charged social post, and an opinion paragraph. Click any card to auto-run."
        />
        <DemoExamples onPick={pickExample} disabled={loading} />
      </section>

      {/* Demo guide overlay */}
      <DemoGuide active={demoActive} onDismiss={() => setDemoActive(false)} />
    </div>
  );
}

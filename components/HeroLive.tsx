"use client";

import { useEffect, useState } from "react";
import HighlightedMessage from "./HighlightedMessage";
import type { Highlight } from "@/types/analysis";

interface Sample {
  id: string;
  /** Short snippet shown in the live preview animation. */
  snippet: string;
  /** Full content sent to /api/analyze when the user clicks "Analyze this example". */
  full: string;
  context: "news" | "social" | "opinion";
  goal: "neutralize" | "balance" | "lower_emotion";
  dir: "ltr" | "rtl";
  highlights: Highlight[];
  perception: {
    tone: string;
    feel: string;
    risks: string[];
  };
}

const SAMPLES: Sample[] = [
  {
    id: "news-lede",
    snippet:
      "Officials slammed the proposed policy on Tuesday, warning it could devastate small businesses.",
    full:
      "Officials slammed the proposed policy on Tuesday, warning that it could devastate small businesses across the region. Critics say the plan ignores the real concerns of working families and rewards big corporations at the expense of ordinary people.",
    context: "news",
    goal: "neutralize",
    dir: "ltr",
    highlights: [
      { text: "slammed", category: "emotional", reason: "Strong verb may indicate emotional framing." },
      { text: "could devastate", category: "bias", reason: "Speculative-but-charged framing." },
      { text: "small businesses", category: "neutral", reason: "Informational anchor." },
      { text: "Tuesday", category: "neutral", reason: "Time anchor." },
    ],
    perception: {
      tone: "Adversarial",
      feel: "Reads as warning, not report",
      risks: ["Loaded verb", "Predictive harm framing"],
    },
  },
  {
    id: "social-post",
    snippet: "Unbelievable. They literally don't care about us. Wake up.",
    full:
      "Unbelievable. Just unbelievable. They literally don't care about us. Wake up — this is exactly what's wrong with everything right now. RT if you agree.",
    context: "social",
    goal: "lower_emotion",
    dir: "ltr",
    highlights: [
      { text: "Unbelievable.", category: "emotional", reason: "Affective opener — frames the post as outrage." },
      { text: "literally don't care about us", category: "bias", reason: "Group-coded zero-sum framing." },
      { text: "Wake up", category: "emotional", reason: "Imperative call — high emotional load." },
      { text: "exactly what's wrong with everything", category: "bias", reason: "Sweeping generalization." },
    ],
    perception: {
      tone: "High emotional load",
      feel: "Designed to mobilize",
      risks: ["Outrage framing", "Us-vs-them shorthand"],
    },
  },
  {
    id: "opinion-piece",
    snippet:
      "It is increasingly obvious that the current approach has failed. Anyone paying attention can see it.",
    full:
      "It is increasingly obvious that the current approach has failed. Anyone paying attention can see that the data, when honestly examined, points in only one direction. We owe it to the next generation to stop pretending otherwise and finally do the right thing.",
    context: "opinion",
    goal: "balance",
    dir: "ltr",
    highlights: [
      { text: "increasingly obvious", category: "bias", reason: "Presents a contested view as self-evident." },
      { text: "has failed", category: "bias", reason: "Assertion presented as fact." },
      { text: "Anyone paying attention", category: "emotional", reason: "Implies disagreement = inattention." },
      { text: "do the right thing", category: "emotional", reason: "Moralized framing." },
    ],
    perception: {
      tone: "Confident / one-sided",
      feel: "Reads as advocacy",
      risks: ["Assumed-consensus framing", "Implied dismissal of disagreement"],
    },
  },
];

const CYCLE_MS = 5400;

/** Public event: dispatched when the hero CTA wants to run a demo analysis. */
export const DEMO_EVENT = "intenta:demo";
export interface DemoEventDetail {
  message: string;
  context: Sample["context"];
  goal: Sample["goal"];
  fromHero?: boolean;
}

export default function HeroLive() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 1800);
    const t4 = setTimeout(() => setPhase(4), 2500);
    const advance = setTimeout(() => {
      setPhase(0);
      setIdx((i) => (i + 1) % SAMPLES.length);
    }, CYCLE_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(advance);
    };
  }, [idx]);

  const sample = SAMPLES[idx];

  function fireDemo() {
    if (typeof window === "undefined") return;
    const detail: DemoEventDetail = {
      message: sample.full,
      context: sample.context,
      goal: sample.goal,
      fromHero: true,
    };
    window.dispatchEvent(new CustomEvent(DEMO_EVENT, { detail }));
    document
      .getElementById("workspace")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="fade-in">
      {/* Eyebrow + hero copy */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
          Intenta · Smart Content Intelligence
        </span>
        <span className="hidden sm:inline-flex badge">
          <span className="font-mono">Live preview</span>
        </span>
      </div>

      <h1 className="mt-5 font-display text-4xl sm:text-6xl lg:text-[68px] leading-[1] tracking-tighter2 text-white">
        <span className="bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-transparent">
          Intent
        </span>
        <span className="text-white/35"> vs </span>
        <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
          Impact.
        </span>
      </h1>

      <p className="mt-5 max-w-2xl text-lg sm:text-xl text-white/80">
        See how content shapes <span className="text-white">perception</span> —
        not just what it says.
      </p>
      <p className="mt-2 max-w-2xl text-[14.5px] sm:text-base text-white/55">
        Intenta reveals framing, tone, and bias in seconds. No fact-checking,
        no motive-reading — just hedged signals you can act on.
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <a
          href="#workspace"
          className="focus-ring inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-950 shadow-glow transition hover:scale-[1.02] active:scale-[0.97]"
        >
          Analyze content
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m13 5 7 7-7 7" />
          </svg>
        </a>
        <a
          href="#examples"
          className="focus-ring inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 backdrop-blur transition hover:bg-white/10 active:scale-[0.97]"
        >
          See examples
        </a>
        <span className="hidden sm:inline-flex items-center gap-2 ms-auto text-[12px] text-white/40">
          <span className="kbd">⌘</span>
          <span className="kbd">↵</span>
          <span>to analyze</span>
        </span>
      </div>

      {/* LIVE PREVIEW: wrote ↔ felt */}
      <div className="mt-9 grid grid-cols-1 lg:grid-cols-[1.1fr_auto_1fr] items-stretch gap-3 sm:gap-4">
        {/* TEXT */}
        <div className="grad-border rounded-3xl">
          <div className="rounded-3xl bg-ink-900/70 p-5 sm:p-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Text</span>
              <span className="badge font-mono text-violet-200 border-violet-300/30 bg-violet-400/10">
                Intent
              </span>
            </div>
            <div className="mt-4 rounded-2xl border border-white/8 bg-ink-950/60 p-4 flex-1">
              <div className="mb-2 flex items-center gap-2 text-[11px] text-white/40">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-violet-400/40 to-cyan-300/30 text-[10px] font-semibold text-white">
                  {sample.context === "news" ? "N" : sample.context === "social" ? "S" : "O"}
                </span>
                <span className="capitalize">{sample.context} · sample</span>
              </div>
              <div key={sample.id} className="fade-in">
                <HighlightedMessage
                  message={sample.snippet}
                  highlights={phase >= 1 ? sample.highlights : []}
                  dir={sample.dir}
                  interactive={false}
                />
              </div>
            </div>
            <p className="mt-3 text-[12px] text-white/40">
              Intenta highlights the phrases that change how the message lands.
            </p>
          </div>
        </div>

        {/* ARROW — desktop horizontal */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative grid h-12 w-12 place-items-center rounded-full bg-white/6 border border-white/10">
            <span className="absolute inset-0 rounded-full animate-pulseRing" />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/85 animate-floatSlow">
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* ARROW — mobile vertical */}
        <div className="lg:hidden flex items-center justify-center">
          <div className="relative grid h-9 w-9 place-items-center rounded-full bg-white/6 border border-white/10">
            <span className="absolute inset-0 rounded-full animate-pulseRing" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/85 animate-floatSlow">
              <path d="M12 5v14" />
              <path d="m5 13 7 7 7-7" />
            </svg>
          </div>
        </div>

        {/* PERCEPTION */}
        <div className="grad-border rounded-3xl">
          <div className="rounded-3xl bg-ink-900/70 p-5 sm:p-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Perceived impact</span>
              <span className="badge font-mono text-rose-200 border-rose-300/30 bg-rose-400/10">
                Impact
              </span>
            </div>

            <div className="mt-4 space-y-3 flex-1">
              <PreviewRow
                label="Tone"
                show={phase >= 2}
                value={
                  <span className="rounded-lg border border-rose-300/30 bg-rose-400/10 px-2.5 py-1 text-[12.5px] text-rose-100">
                    {sample.perception.tone}
                  </span>
                }
              />
              <PreviewRow
                label="Felt as"
                show={phase >= 3}
                value={
                  <span className="text-[14px] text-white">
                    {sample.perception.feel}
                  </span>
                }
              />
              <PreviewRow
                label="Risks"
                show={phase >= 4}
                value={
                  <div className="flex flex-wrap gap-1.5">
                    {sample.perception.risks.map((r) => (
                      <span
                        key={r}
                        className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-400/10 px-2.5 py-0.5 text-[11px] text-amber-100"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                        {r}
                      </span>
                    ))}
                  </div>
                }
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="badge">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulseRing" />
                Reading…
              </span>
              <button
                type="button"
                onClick={fireDemo}
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-ink-950 shadow-glow transition hover:scale-[1.03] active:scale-[0.97]"
              >
                Analyze this example
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m13 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cycle dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {SAMPLES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={"Sample " + (i + 1)}
            onClick={() => {
              setIdx(i);
              setPhase(0);
            }}
            className={
              "focus-ring h-1.5 rounded-full transition " +
              (i === idx ? "w-8 bg-white/80" : "w-3 bg-white/20 hover:bg-white/40")
            }
          />
        ))}
      </div>

      <div className="mt-10 divider" />
    </section>
  );
}

function PreviewRow({
  label,
  value,
  show,
}: {
  label: string;
  value: React.ReactNode;
  show: boolean;
}) {
  return (
    <div className="grid grid-cols-[80px_1fr] items-center gap-3">
      <span className="eyebrow">{label}</span>
      <div
        className={
          "transition-all duration-500 " +
          (show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")
        }
      >
        {show ? value : <span className="block h-5 w-3/4 rounded-md shimmer" />}
      </div>
    </div>
  );
}

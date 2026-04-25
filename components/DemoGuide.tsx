"use client";

import { useEffect, useState } from "react";

interface Props {
  /** When true, the guide is visible and auto-advances. */
  active: boolean;
  /** Called when the user dismisses the guide or it auto-completes. */
  onDismiss: () => void;
}

const STEPS = [
  { n: 1, t: "Look at the highlighted phrases", d: "That's where framing happens." },
  { n: 2, t: "Hover any highlight", d: "See exactly why it was flagged." },
  { n: 3, t: "Scroll for the neutral version", d: "Same substance — lower affect." },
];

const STEP_MS = 3500;
const TOTAL_MS = STEPS.length * STEP_MS;

export default function DemoGuide({ active, onDismiss }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) {
      setStep(0);
      return;
    }
    setStep(0);
    const advance = window.setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, STEP_MS);
    const dismiss = window.setTimeout(() => onDismiss(), TOTAL_MS + 600);
    return () => {
      window.clearInterval(advance);
      window.clearTimeout(dismiss);
    };
  }, [active, onDismiss]);

  if (!active) return null;

  return (
    <div
      className="fixed z-40 left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0 w-[min(92vw,360px)] fade-in"
      role="dialog"
      aria-label="Demo guide"
    >
      <div className="grad-border rounded-2xl shadow-glow">
        <div className="rounded-2xl bg-ink-900/95 backdrop-blur-xl p-4">
          <header className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="badge badge-soon">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
                Demo guide
              </span>
              <span className="font-mono text-[10px] text-white/45">
                {step + 1} / {STEPS.length}
              </span>
            </div>
            <button
              type="button"
              onClick={onDismiss}
              className="focus-ring rounded-lg border border-white/10 bg-white/5 p-1 text-white/60 hover:bg-white/10 active:scale-[0.95]"
              aria-label="Dismiss guide"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </header>

          <ul className="mt-3 space-y-1.5">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li
                  key={s.n}
                  className={
                    "flex items-start gap-2.5 rounded-xl border px-2.5 py-2 transition-colors duration-300 " +
                    (active
                      ? "border-violet-300/40 bg-violet-500/12 text-white"
                      : done
                      ? "border-white/8 bg-white/[0.02] text-white/55"
                      : "border-white/8 bg-white/[0.015] text-white/40")
                  }
                >
                  <span
                    className={
                      "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-mono " +
                      (done
                        ? "bg-emerald-400/25 text-emerald-200"
                        : active
                        ? "bg-violet-400/30 text-white"
                        : "bg-white/8 text-white/40")
                    }
                  >
                    {done ? (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : (
                      s.n
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium leading-tight">
                      {s.t}
                    </div>
                    <div className="text-[11.5px] leading-snug text-white/55">
                      {s.d}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Progress bar */}
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full bg-gradient-to-r from-violet-400 to-cyan-300 transition-[width] duration-300 ease-linear"
              style={{
                width: `${Math.min(100, ((step + 1) / STEPS.length) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

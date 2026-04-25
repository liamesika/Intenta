"use client";

import { useEffect, useState } from "react";

const PHASES = [
  { label: "Analyzing framing…" },
  { label: "Detecting tone…" },
  { label: "Identifying bias signals…" },
  { label: "Estimating impact…" },
  { label: "Generating neutral rewrite…" },
];

const STEP_MS = 600;

export default function ThinkingSequence() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % PHASES.length);
    }, STEP_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass rounded-3xl p-6 sm:p-8 fade-in">
      <div className="flex items-center gap-3">
        <span className="relative grid h-9 w-9 place-items-center rounded-full bg-violet-500/15 text-white">
          <span className="absolute inset-0 rounded-full animate-pulseRing" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2v.3h6V17c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z" />
          </svg>
        </span>
        <div>
          <div className="font-display text-[16px] font-semibold text-white">
            Intenta is reading your message…
          </div>
          <div className="text-[12px] text-white/50">
            Multi-step reasoning · stays on-device after this turn
          </div>
        </div>
      </div>

      <ul className="mt-5 space-y-2.5">
        {PHASES.map((p, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li
              key={p.label}
              className={
                "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-300 " +
                (active
                  ? "border-violet-300/40 bg-violet-500/10 text-white"
                  : done
                  ? "border-white/10 bg-white/[0.03] text-white/65"
                  : "border-white/8 bg-white/[0.02] text-white/35")
              }
            >
              <span
                className={
                  "grid h-6 w-6 place-items-center rounded-full text-[11px] font-mono " +
                  (done
                    ? "bg-emerald-400/20 text-emerald-200"
                    : active
                    ? "bg-violet-400/30 text-white"
                    : "bg-white/8 text-white/40")
                }
              >
                {done ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : active ? (
                  <span className="h-2 w-2 rounded-full bg-white animate-pulseRing" />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <span className="flex-1 text-[14px]">{p.label}</span>
              {active && (
                <span className="flex items-center gap-0.5">
                  <Dot delay="0ms" />
                  <Dot delay="120ms" />
                  <Dot delay="240ms" />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="block h-1.5 w-1.5 rounded-full bg-white/80 animate-pulseRing"
      style={{ animationDelay: delay }}
    />
  );
}

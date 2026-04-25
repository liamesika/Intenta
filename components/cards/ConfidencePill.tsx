"use client";

import type { Confidence } from "@/types/analysis";
import { CONFIDENCE_COPY } from "@/lib/scores";

const TONE_STYLE: Record<"good" | "neutral" | "warn", string> = {
  good: "border-emerald-300/35 bg-emerald-400/10 text-emerald-100",
  neutral: "border-cyan-300/35 bg-cyan-400/10 text-cyan-100",
  warn: "border-amber-300/35 bg-amber-400/10 text-amber-100",
};

const DOT: Record<"good" | "neutral" | "warn", string> = {
  good: "bg-emerald-400",
  neutral: "bg-cyan-300",
  warn: "bg-amber-300",
};

interface Props {
  confidence: Confidence;
  derived?: boolean;
}

export default function ConfidencePill({ confidence, derived }: Props) {
  const c = CONFIDENCE_COPY[confidence];
  return (
    <section
      className={
        "fade-in rounded-2xl border px-4 py-3 backdrop-blur flex flex-wrap items-center justify-between gap-3 " +
        TONE_STYLE[c.tone]
      }
    >
      <div className="flex items-center gap-3">
        <span className={"h-2 w-2 rounded-full " + DOT[c.tone]} />
        <div>
          <div className="font-display text-[14px] font-semibold leading-tight">
            {c.label}
          </div>
          <div className="text-[12px] opacity-80">{c.micro}</div>
        </div>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-wider opacity-70">
        {derived ? "Derived from input" : "Model self-rated"}
      </span>
    </section>
  );
}

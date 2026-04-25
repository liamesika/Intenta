"use client";

import CardShell from "./CardShell";
import {
  balanceLabel,
  clarityLabel,
  intensityLabel,
  toneClass,
  type ScoreLabel,
} from "@/lib/scores";

interface Props {
  clarity: number;
  /** Mapped to "Balance" axis. */
  empathy: number;
  /** Mapped to "Intensity" axis. */
  assertiveness: number;
}

interface RowProps {
  axis: string;
  value: number;
  color: string;
  meta: ScoreLabel;
}

function Row({ axis, value, color, meta }: RowProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="eyebrow">{axis}</span>
        <span className="font-mono text-base font-semibold text-white tabular-nums">
          {pct}
          <span className="text-white/30 text-xs">/100</span>
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={"absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out " + color}
          style={{ width: pct + "%" }}
        />
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <span className={"text-[13px] font-medium " + toneClass(meta.tone)}>
          {meta.label}
        </span>
      </div>
      <p className="text-[12px] leading-relaxed text-white/50">{meta.micro}</p>
    </div>
  );
}

export default function ScoreCard({ clarity, empathy, assertiveness }: Props) {
  return (
    <CardShell
      title="Impact score"
      accent="amber"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="m7 14 3-3 4 4 5-5" />
        </svg>
      }
    >
      <div className="space-y-5">
        <Row
          axis="Clarity"
          value={clarity}
          color="bg-gradient-to-r from-amber-300 to-amber-500"
          meta={clarityLabel(clarity)}
        />
        <Row
          axis="Balance"
          value={empathy}
          color="bg-gradient-to-r from-emerald-300 to-emerald-500"
          meta={balanceLabel(empathy)}
        />
        <Row
          axis="Intensity"
          value={assertiveness}
          color="bg-gradient-to-r from-violet-300 to-fuchsia-500"
          meta={intensityLabel(assertiveness)}
        />
      </div>
      <p className="mt-5 text-[12px] text-white/40">
        Likely impact axes — calibrated against the original content.
      </p>
    </CardShell>
  );
}

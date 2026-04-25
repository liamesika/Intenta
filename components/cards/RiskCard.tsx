"use client";

import CardShell from "./CardShell";

interface Props {
  /** Bias signals — loaded language, generalizations, urgency framing, etc. */
  risks: string[];
}

export default function RiskCard({ risks }: Props) {
  if (!risks?.length) return null;
  return (
    <CardShell
      title="Bias signals"
      accent="rose"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20" />
          <path d="M5 7h14" />
          <path d="M5 17h14" />
        </svg>
      }
      right={
        <span className="badge font-mono">{risks.length} flagged</span>
      }
    >
      <p className="mb-3 text-[12.5px] text-white/55">
        Patterns the AI flagged — loaded language, generalizations, framing
        choices. Hedged signals, not verdicts.
      </p>
      <ul className="space-y-2">
        {risks.map((risk, i) => (
          <li
            key={i}
            className="flex gap-2 rounded-lg border border-rose-300/15 bg-rose-400/5 p-3"
          >
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-300/80" />
            <span className="text-white/85">{risk}</span>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}

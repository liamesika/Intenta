"use client";

import CardShell from "./CardShell";

interface Props {
  /** Framing analysis — how the content positions its subject. */
  perceived: string;
  /** Optional likely audience reaction copy. */
  emotionalImpact?: string;
}

export default function PerceptionCard({ perceived, emotionalImpact }: Props) {
  return (
    <CardShell
      title="Framing"
      accent="cyan"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      }
    >
      <p>{perceived}</p>
      {emotionalImpact && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-[11px] uppercase tracking-wider text-white/50 font-mono">
            Likely audience impact
          </div>
          <p className="mt-1 text-white/80">{emotionalImpact}</p>
        </div>
      )}
    </CardShell>
  );
}

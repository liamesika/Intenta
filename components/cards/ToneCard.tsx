"use client";

import CardShell from "./CardShell";

interface Props {
  tone: string;
  hiddenSubtext: string;
  emotionalLoad?: string;
}

export default function ToneCard({ tone, hiddenSubtext, emotionalLoad }: Props) {
  return (
    <CardShell
      title="Tone & emotion"
      accent="amber"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      }
    >
      <p>{tone}</p>
      {emotionalLoad && (
        <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-400/[0.06] p-3">
          <div className="text-[11px] uppercase tracking-wider text-amber-200/80 font-mono">
            Emotional load
          </div>
          <p className="mt-1 text-white/85">{emotionalLoad}</p>
        </div>
      )}
      {hiddenSubtext && (
        <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-[11px] uppercase tracking-wider text-white/50 font-mono">
            What the framing may signal
          </div>
          <p className="mt-1 text-white/80">{hiddenSubtext}</p>
        </div>
      )}
    </CardShell>
  );
}

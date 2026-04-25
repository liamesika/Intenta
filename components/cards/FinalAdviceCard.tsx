"use client";

import CardShell from "./CardShell";

interface Props {
  /** Impact explanation — why the content lands the way it does. */
  advice: string;
}

export default function FinalAdviceCard({ advice }: Props) {
  return (
    <CardShell
      title="Impact explanation"
      accent="indigo"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2v.3h6V17c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z" />
        </svg>
      }
    >
      <p className="text-white/90">{advice}</p>
    </CardShell>
  );
}

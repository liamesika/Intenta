"use client";

import { useEffect, useState } from "react";
import CardShell from "./CardShell";
import type { PossibleReply } from "@/types/analysis";

interface Props {
  replies: PossibleReply[];
  language: "he" | "en";
}

const LIKELIHOOD_STYLE: Record<PossibleReply["likelihood"], string> = {
  high: "bg-emerald-400/15 text-emerald-200 border-emerald-300/30",
  medium: "bg-amber-400/15 text-amber-200 border-amber-300/30",
  low: "bg-white/5 text-white/60 border-white/10",
};

const LIKELIHOOD_LABEL: Record<PossibleReply["likelihood"], string> = {
  high: "Likely",
  medium: "Possible",
  low: "Unlikely",
};

const PERSONA_PALETTE = [
  "from-violet-400/40 to-fuchsia-400/30",
  "from-cyan-400/40 to-sky-400/30",
  "from-rose-400/40 to-amber-400/30",
  "from-emerald-400/40 to-teal-400/30",
];

function initials(persona: string): string {
  const parts = persona.replace(/[^\p{L}\s]/gu, " ").trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function SimulationCard({ replies, language }: Props) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    if (!replies?.length) return;
    const timers = replies.map((_, i) =>
      setTimeout(() => setShown((s) => Math.max(s, i + 1)), 350 + i * 600),
    );
    return () => timers.forEach(clearTimeout);
  }, [replies]);

  if (!replies?.length) return null;
  const dir = language === "he" ? "rtl" : "ltr";

  return (
    <CardShell
      title="Possible replies from the other side"
      accent="emerald"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
        </svg>
      }
      right={
        <span className="badge font-mono">
          {replies.length} simulated
        </span>
      }
    >
      <p className="mb-4 text-[12.5px] text-white/55">
        How they might respond — based on the tone, intent, and emotional cues
        in your message.
      </p>

      <div className="space-y-3">
        {shown < replies.length && (
          <TypingBubble persona={replies[shown].persona} index={shown} />
        )}

        {replies.slice(0, shown).map((r, i) => {
          const align = i % 2 === 0 ? "items-start" : "items-end";
          const bubbleAlign =
            i % 2 === 0
              ? "rounded-2xl rounded-tl-sm"
              : "rounded-2xl rounded-tr-sm";
          const palette = PERSONA_PALETTE[i % PERSONA_PALETTE.length];
          return (
            <div key={i} className={"flex flex-col fade-in " + align}>
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={
                    "grid h-7 w-7 place-items-center rounded-full text-[10px] font-semibold text-white bg-gradient-to-br " +
                    palette
                  }
                >
                  {initials(r.persona)}
                </span>
                <span className="text-[12px] font-medium text-white/75">
                  {r.persona}
                </span>
                <span
                  className={
                    "ms-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider " +
                    LIKELIHOOD_STYLE[r.likelihood]
                  }
                >
                  {LIKELIHOOD_LABEL[r.likelihood]}
                </span>
              </div>
              <div
                dir={dir}
                className={
                  "max-w-[88%] sm:max-w-[78%] border border-white/10 bg-white/[0.05] p-3 sm:p-3.5 text-[14px] leading-relaxed text-white/90 whitespace-pre-wrap " +
                  bubbleAlign
                }
              >
                {r.reply}
              </div>
            </div>
          );
        })}
      </div>
    </CardShell>
  );
}

function TypingBubble({ persona, index }: { persona: string; index: number }) {
  const align = index % 2 === 0 ? "items-start" : "items-end";
  const palette = PERSONA_PALETTE[index % PERSONA_PALETTE.length];
  return (
    <div className={"flex flex-col fade-in " + align}>
      <div className="mb-1 flex items-center gap-2">
        <span
          className={
            "grid h-7 w-7 place-items-center rounded-full text-[10px] font-semibold text-white bg-gradient-to-br " +
            palette
          }
        >
          {initials(persona)}
        </span>
        <span className="text-[12px] font-medium text-white/55">
          {persona} is typing…
        </span>
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.05] px-3.5 py-3">
        <span className="inline-flex items-center gap-1">
          <Dot delay="0ms" />
          <Dot delay="150ms" />
          <Dot delay="300ms" />
        </span>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="block h-1.5 w-1.5 rounded-full bg-white/70 animate-pulseRing"
      style={{ animationDelay: delay }}
    />
  );
}

"use client";

import { useState } from "react";
import CardShell from "./CardShell";
import CopyButton from "./CopyButton";
import type { AlternativeVersions } from "@/types/analysis";

type Key = keyof AlternativeVersions;

const TABS: { key: Key; label: string; hint: string }[] = [
  { key: "softer", label: "Softer", hint: "Less confrontational" },
  { key: "moreDirect", label: "More direct", hint: "Cuts to the point" },
  { key: "professional", label: "Professional", hint: "Workplace tone" },
  { key: "warmer", label: "Warmer", hint: "Emotionally generous" },
];

interface Props {
  versions: AlternativeVersions;
  language: "he" | "en";
}

export default function AlternativesTabs({ versions, language }: Props) {
  const [active, setActive] = useState<Key>("softer");
  const text = versions[active] || "";
  const hint = TABS.find((t) => t.key === active)?.hint;

  return (
    <CardShell
      title="Alternative versions"
      accent="violet"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h7" />
          <path d="M14 9h7" />
          <path d="M17.5 5.5 21 9l-3.5 3.5" />
        </svg>
      }
      right={<CopyButton text={text} label="Copy" />}
    >
      <div className="mb-3 flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={
                "focus-ring rounded-full px-3 py-1 text-xs transition " +
                (isActive
                  ? "bg-white text-ink-950 font-semibold shadow-soft"
                  : "bg-white/[0.04] text-white/70 border border-white/8 hover:bg-white/10")
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {hint && (
        <p className="mb-2 text-[12px] text-white/40">{hint}</p>
      )}

      <div
        dir={language === "he" ? "rtl" : "ltr"}
        className="rounded-xl border border-white/10 bg-ink-900/60 p-4 sm:p-5 text-[15px] leading-relaxed text-white whitespace-pre-wrap min-h-[120px]"
      >
        {text || (
          <span className="text-white/40">
            No alternative produced for this style.
          </span>
        )}
      </div>
    </CardShell>
  );
}

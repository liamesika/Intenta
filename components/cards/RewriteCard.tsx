"use client";

import { useState } from "react";
import CardShell from "./CardShell";
import CopyButton from "./CopyButton";
import { diffWords } from "@/lib/diff";

interface Props {
  rewrite: string;
  original: string;
  language: "he" | "en";
}

export default function RewriteCard({ rewrite, original, language }: Props) {
  const [showDiff, setShowDiff] = useState(false);
  const dir = language === "he" ? "rtl" : "ltr";

  return (
    <CardShell
      title="Neutral / Balanced version"
      accent="indigo"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" />
          <path d="M3 12h18" />
          <path d="M3 18h12" />
        </svg>
      }
      right={
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowDiff((v) => !v)}
            aria-pressed={showDiff}
            className={
              "focus-ring inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition active:scale-[0.97] " +
              (showDiff
                ? "border-violet-300/40 bg-violet-500/15 text-white"
                : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10")
            }
            title="Show what changed vs the original content"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
            {showDiff ? "Showing diff" : "Show differences"}
          </button>
          <CopyButton text={rewrite} label="Copy" />
        </div>
      }
    >
      <p className="mb-3 text-[12.5px] text-white/55">
        Same substance, lower affect. Loaded framing softened. No facts added
        or removed.
      </p>
      <div className="grad-border rounded-xl">
        <div
          dir={dir}
          className="rounded-xl bg-ink-900/60 p-4 sm:p-5 text-[15px] leading-relaxed text-white whitespace-pre-wrap min-h-[80px]"
        >
          {showDiff ? (
            <DiffView original={original} rewrite={rewrite} />
          ) : (
            <span key="plain" className="fade-in inline">
              {rewrite}
            </span>
          )}
        </div>
      </div>

      {showDiff && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-white/55 fade-in">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-rose-400" />
            Removed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            Added
          </span>
          <span className="text-white/35">· kept words shown in white</span>
        </div>
      )}
    </CardShell>
  );
}

function DiffView({ original, rewrite }: { original: string; rewrite: string }) {
  const tokens = diffWords(original, rewrite);
  return (
    <span className="fade-in">
      {tokens.map((t, i) => {
        if (t.type === "same") {
          return <span key={i}>{t.text}</span>;
        }
        if (t.type === "add") {
          return (
            <span
              key={i}
              className="rounded-[3px] bg-emerald-400/15 text-emerald-100 underline decoration-emerald-300/60 underline-offset-2 px-0.5"
              style={{ animationDelay: `${i * 18}ms` }}
            >
              {t.text}
            </span>
          );
        }
        return (
          <span
            key={i}
            className="rounded-[3px] bg-rose-400/15 text-rose-200/80 line-through decoration-rose-300/70 px-0.5"
          >
            {t.text}
          </span>
        );
      })}
    </span>
  );
}

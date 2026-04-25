"use client";

import { useState } from "react";

interface Props {
  text: string;
  className?: string;
  label?: string;
}

export default function CopyButton({ text, className, label = "Copy" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      className={
        "focus-ring inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition active:scale-[0.94] " +
        (copied
          ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-100"
          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10") +
        " " +
        (className ?? "")
      }
    >
      <span className="relative grid h-3 w-3 place-items-center">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={
            "absolute inset-0 transition-all duration-200 " +
            (copied ? "opacity-0 scale-50" : "opacity-100 scale-100")
          }
        >
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={
            "absolute inset-0 transition-all duration-200 " +
            (copied ? "opacity-100 scale-100" : "opacity-0 scale-50")
          }
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span className="min-w-[42px] text-left">
        {copied ? "Copied" : label}
      </span>
    </button>
  );
}

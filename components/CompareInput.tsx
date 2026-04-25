"use client";

import { useState } from "react";
import UrlInput from "./UrlInput";
import { MAX_INPUT_CHARS } from "@/lib/validate";

interface Props {
  side: "A" | "B";
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  sourceUrl: string | null;
  onSourceUrl: (url: string | null) => void;
}

const HEBREW_RE = /[֐-׿]/;

export default function CompareInput({
  side,
  value,
  onChange,
  disabled,
  sourceUrl,
  onSourceUrl,
}: Props) {
  const [showUrl, setShowUrl] = useState(false);
  const dir = HEBREW_RE.test(value) ? "rtl" : "ltr";
  const overLimit = value.length > MAX_INPUT_CHARS;

  return (
    <div className="grad-border rounded-2xl">
      <div className="rounded-2xl bg-ink-900/70 p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={
                "grid h-7 w-7 place-items-center rounded-lg text-[12px] font-semibold text-white " +
                (side === "A"
                  ? "bg-violet-500/30"
                  : "bg-cyan-400/25")
              }
            >
              {side}
            </span>
            <span className="font-display text-[14px] font-semibold text-white">
              Content {side}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowUrl((v) => !v)}
            className="focus-ring inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/75 hover:bg-white/10 active:scale-[0.97]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 1 0-7.07-7.07l-1 1" />
              <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 1 0 7.07 7.07l1-1" />
            </svg>
            {showUrl ? "Hide URL" : "Import URL"}
          </button>
        </div>

        {showUrl && (
          <div className="mb-4">
            <UrlInput
              disabled={disabled}
              onLoaded={(content, meta) => {
                onChange(content);
                onSourceUrl(meta.url);
              }}
            />
          </div>
        )}

        <textarea
          value={value}
          dir={dir}
          onChange={(e) => {
            onChange(e.target.value);
            if (sourceUrl) onSourceUrl(null);
          }}
          placeholder={
            side === "A"
              ? "Paste the first piece of content here…"
              : "Paste the second piece of content here…"
          }
          disabled={disabled}
          spellCheck
          rows={8}
          className="focus-ring block w-full resize-y rounded-xl bg-ink-950/60 p-3.5 text-[14.5px] leading-relaxed text-white placeholder:text-white/30 border border-white/8"
        />

        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-white/40">
          <span>{sourceUrl ? <span className="font-mono truncate">Source: {sourceUrl}</span> : "Hebrew & English supported"}</span>
          <span className={overLimit ? "text-rose-300" : ""}>
            {value.length.toLocaleString()} / {MAX_INPUT_CHARS.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

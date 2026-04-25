"use client";

import { useState } from "react";
import type { FetchUrlResponse } from "@/types/analysis";

interface Props {
  /** Called with the extracted text content. Optionally receives title + url. */
  onLoaded: (content: string, meta: { title: string; url: string }) => void;
  disabled?: boolean;
  className?: string;
}

export default function UrlInput({ onLoaded, disabled, className }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMeta, setOkMeta] = useState<{ title: string; bytes: number } | null>(null);

  async function handleFetch() {
    const trimmed = url.trim();
    if (!trimmed || loading || disabled) return;
    setLoading(true);
    setError(null);
    setOkMeta(null);

    try {
      const res = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const json = (await res.json()) as FetchUrlResponse;
      if (!json.ok) {
        setError(json.error || "Couldn't fetch that URL.");
      } else {
        setOkMeta({ title: json.data.title, bytes: json.data.bytes });
        onLoaded(json.data.content, {
          title: json.data.title,
          url: json.data.url,
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFetch();
    }
  }

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <label className="eyebrow">Or import from a URL</label>
        <span className="text-[11px] text-white/40">Basic article extraction</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/40">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 1 0-7.07-7.07l-1 1" />
              <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 1 0 7.07 7.07l1-1" />
            </svg>
          </span>
          <input
            type="url"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={onKey}
            placeholder="https://example.com/article"
            disabled={disabled || loading}
            className="focus-ring block w-full rounded-xl border border-white/10 bg-ink-900/70 pl-9 pr-3 py-2.5 text-[14px] text-white placeholder:text-white/30"
          />
        </div>
        <button
          type="button"
          onClick={handleFetch}
          disabled={disabled || loading || !url.trim()}
          className={
            "focus-ring inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.97] " +
            (loading || !url.trim()
              ? "bg-white/10 text-white/40 cursor-not-allowed active:scale-100"
              : "bg-white text-ink-950 shadow-glow hover:scale-[1.02]")
          }
        >
          {loading ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-ink-700 border-t-transparent" />
              Fetching…
            </>
          ) : (
            <>
              Fetch content
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="m5 12 7 7 7-7" />
              </svg>
            </>
          )}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-2 rounded-lg border border-rose-300/30 bg-rose-400/10 px-3 py-1.5 text-[12px] text-rose-200 fade-in"
        >
          {error}
        </p>
      )}
      {okMeta && !error && (
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 text-[12px] text-emerald-100 fade-in">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Loaded
          {okMeta.title ? <span className="text-emerald-200/80">· “{okMeta.title}”</span> : null}
          <span className="ms-1 font-mono text-[10px] text-emerald-200/60">
            {okMeta.bytes.toLocaleString()} chars
          </span>
        </p>
      )}
    </div>
  );
}

"use client";

import { useMemo } from "react";
import type { Highlight, HighlightCategory } from "@/types/analysis";
import { buildSegments } from "@/lib/highlights";

interface Props {
  message: string;
  highlights?: Highlight[];
  dir?: "ltr" | "rtl";
  className?: string;
  /** Wrap each highlight in a tooltip-on-hover surface. Defaults to true. */
  interactive?: boolean;
  /**
   * If true, applies a brief pulse animation to the FIRST highlight and
   * marks it with `data-first-highlight` so callers can scrollIntoView.
   */
  pulseFirst?: boolean;
}

const CATEGORY_STYLE: Record<HighlightCategory, string> = {
  emotional:
    "bg-amber-400/15 text-amber-100 border-b border-amber-400/60 decoration-amber-400/60",
  bias:
    "bg-rose-400/15 text-rose-100 border-b border-rose-400/60 decoration-rose-400/60",
  neutral:
    "bg-cyan-400/12 text-cyan-100 border-b border-cyan-400/50 decoration-cyan-400/50",
  risk:
    "bg-rose-400/15 text-rose-100 border-b border-rose-400/60 decoration-rose-400/60",
  positive:
    "bg-emerald-400/15 text-emerald-100 border-b border-emerald-400/60 decoration-emerald-400/60",
};

const CATEGORY_DOT: Record<HighlightCategory, string> = {
  emotional: "bg-amber-300",
  bias: "bg-rose-400",
  neutral: "bg-cyan-300",
  risk: "bg-rose-400",
  positive: "bg-emerald-400",
};

const CATEGORY_LABEL: Record<HighlightCategory, string> = {
  emotional: "Emotional cue",
  bias: "Bias signal",
  neutral: "Informational",
  risk: "Risk",
  positive: "Positive",
};

export default function HighlightedMessage({
  message,
  highlights,
  dir = "ltr",
  className,
  interactive = true,
  pulseFirst = false,
}: Props) {
  const segments = useMemo(
    () => buildSegments(message, highlights),
    [message, highlights],
  );
  const firstHighlightIndex = useMemo(
    () => segments.findIndex((s) => s.kind === "highlight"),
    [segments],
  );

  return (
    <div
      dir={dir}
      className={
        "whitespace-pre-wrap text-[15px] leading-[1.7] text-white/90 " +
        (className ?? "")
      }
    >
      {segments.map((seg, i) => {
        if (seg.kind === "plain") {
          return <span key={i}>{seg.text}</span>;
        }
        const isFirst = i === firstHighlightIndex;
        const cat = seg.highlight.category;
        const base =
          "relative inline px-0.5 rounded-[3px] transition " +
          CATEGORY_STYLE[cat] +
          (pulseFirst && isFirst ? " pulse-first" : "");

        const extraProps = isFirst
          ? ({ "data-first-highlight": "true" } as Record<string, string>)
          : {};

        if (!interactive) {
          return (
            <span key={i} className={base} {...extraProps}>
              {seg.text}
            </span>
          );
        }

        return (
          <span
            key={i}
            className={base + " group cursor-help"}
            tabIndex={0}
            {...extraProps}
          >
            {seg.text}
            <span
              role="tooltip"
              className="pointer-events-none absolute z-30 left-1/2 -translate-x-1/2 top-full mt-2 w-64 max-w-[80vw] opacity-0 translate-y-1 transition group-hover:opacity-100 group-hover:translate-y-0 group-focus:opacity-100 group-focus:translate-y-0"
            >
              <span className="block rounded-xl border border-white/12 bg-ink-900/95 backdrop-blur-xl p-3 shadow-soft">
                <span className="flex items-center gap-1.5">
                  <span className={"h-1.5 w-1.5 rounded-full " + CATEGORY_DOT[cat]} />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/55">
                    {CATEGORY_LABEL[cat]}
                  </span>
                </span>
                <span className="mt-1.5 block text-[12.5px] leading-relaxed text-white/85">
                  {seg.highlight.reason}
                </span>
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function HighlightLegend({
  className,
  variant = "content",
}: {
  className?: string;
  variant?: "content" | "all";
}) {
  const items: { c: HighlightCategory; label: string }[] =
    variant === "all"
      ? [
          { c: "emotional", label: "Emotional" },
          { c: "bias", label: "Bias signal" },
          { c: "neutral", label: "Informational" },
          { c: "positive", label: "Positive" },
        ]
      : [
          { c: "emotional", label: "Emotional" },
          { c: "bias", label: "Bias signal" },
          { c: "neutral", label: "Informational" },
        ];
  return (
    <div className={"flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-white/55 " + (className ?? "")}>
      {items.map((it) => (
        <span key={it.c} className="inline-flex items-center gap-1.5">
          <span className={"h-2 w-2 rounded-full " + CATEGORY_DOT[it.c]} />
          {it.label}
        </span>
      ))}
      <span className="text-white/35">· hover any highlight for the reason</span>
    </div>
  );
}

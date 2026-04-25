import type { Highlight, HighlightCategory } from "@/types/analysis";

export type Segment =
  | { kind: "plain"; text: string }
  | { kind: "highlight"; text: string; highlight: Highlight };

interface Range {
  start: number;
  end: number;
  highlight: Highlight;
}

/**
 * Resolution priority for overlapping highlights.
 * Bias > emotional > legacy risk > legacy positive > neutral.
 */
const PRIORITY: Record<HighlightCategory, number> = {
  bias: 5,
  emotional: 4,
  risk: 3,
  positive: 2,
  neutral: 1,
};

/**
 * Splits the message into segments, wrapping any AI-flagged phrases.
 * Matches are case-insensitive and resolve overlaps by keeping the
 * higher-priority category, then earliest start, then longer span.
 */
export function buildSegments(
  message: string,
  highlights: Highlight[] | undefined,
): Segment[] {
  if (!highlights || highlights.length === 0 || !message) {
    return [{ kind: "plain", text: message }];
  }

  const lower = message.toLowerCase();
  const ranges: Range[] = [];

  for (const h of highlights) {
    const needle = h.text.toLowerCase();
    if (!needle) continue;
    let from = 0;
    while (from <= lower.length) {
      const idx = lower.indexOf(needle, from);
      if (idx < 0) break;
      ranges.push({ start: idx, end: idx + needle.length, highlight: h });
      from = idx + Math.max(1, needle.length);
    }
  }

  if (ranges.length === 0) return [{ kind: "plain", text: message }];

  ranges.sort((a, b) => {
    const pa = PRIORITY[a.highlight.category];
    const pb = PRIORITY[b.highlight.category];
    if (pa !== pb) return pb - pa;
    if (a.start !== b.start) return a.start - b.start;
    return b.end - a.end;
  });

  const accepted: Range[] = [];
  for (const r of ranges) {
    const overlaps = accepted.some(
      (a) => !(r.end <= a.start || r.start >= a.end),
    );
    if (!overlaps) accepted.push(r);
  }

  accepted.sort((a, b) => a.start - b.start);

  const segments: Segment[] = [];
  let cursor = 0;
  for (const r of accepted) {
    if (r.start > cursor) {
      segments.push({ kind: "plain", text: message.slice(cursor, r.start) });
    }
    segments.push({
      kind: "highlight",
      text: message.slice(r.start, r.end),
      highlight: r.highlight,
    });
    cursor = r.end;
  }
  if (cursor < message.length) {
    segments.push({ kind: "plain", text: message.slice(cursor) });
  }
  return segments;
}

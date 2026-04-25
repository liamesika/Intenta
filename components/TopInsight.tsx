"use client";

import type { AnalysisResult, Highlight } from "@/types/analysis";

interface Props {
  data: AnalysisResult;
}

/**
 * One short, derived sentence that summarizes the analysis in plain language.
 * Uses ONLY existing fields — no API change.
 */
function buildSentence(data: AnalysisResult): string {
  const hl = data.highlights ?? [];
  const counts = countByCategory(hl);

  const intensityHigh = data.assertivenessScore >= 65;
  const balanceLow = data.empathyScore <= 45;
  const clarityLow = data.clarityScore <= 45;
  const biasFlagged = data.communicationRisks?.length >= 2;

  const hasEmotional = counts.emotional > 0;
  const hasBias = counts.bias > 0;

  // Choose two adjective phrases that best fit the signals.
  const adjectives: string[] = [];
  if (hasEmotional || intensityHigh) adjectives.push("emotional framing");
  if (hasBias || biasFlagged || balanceLow) adjectives.push("selective wording");
  if (clarityLow) adjectives.push("ambiguous phrasing");
  if (adjectives.length === 0) adjectives.push("relatively measured framing");
  if (adjectives.length === 1 && (hasEmotional || hasBias)) {
    adjectives.push("specific framing choices");
  }

  // Choose an effect phrase based on the dominant signal.
  let effect: string;
  if (hasEmotional && (intensityHigh || balanceLow)) {
    effect = "may make it feel more urgent than the underlying facts";
  } else if (hasBias || balanceLow) {
    effect = "may color how the reader interprets the underlying facts";
  } else if (intensityHigh) {
    effect = "may amplify reader reaction beyond what the facts warrant";
  } else if (clarityLow) {
    effect = "may leave readers filling in gaps with their own assumptions";
  } else {
    effect = "and is likely to land roughly the way it reads on the surface";
  }

  const adj = adjectives.slice(0, 2).join(" and ");
  return `This content uses ${adj}, which ${effect}.`;
}

function countByCategory(hl: Highlight[]) {
  const c = { emotional: 0, bias: 0, neutral: 0 };
  for (const h of hl) {
    if (h.category === "emotional") c.emotional++;
    else if (h.category === "bias" || h.category === "risk") c.bias++;
    else c.neutral++;
  }
  return c;
}

export default function TopInsight({ data }: Props) {
  const sentence = buildSentence(data);
  const counts = countByCategory(data.highlights ?? []);

  return (
    <section
      className="grad-border rounded-2xl fade-in"
      aria-label="Quick insight"
    >
      <div className="rounded-2xl bg-ink-900/70 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow">Quick insight</span>
          <div className="flex items-center gap-1.5">
            {counts.emotional > 0 && (
              <span className="badge font-mono text-amber-200 border-amber-300/30 bg-amber-400/10">
                {counts.emotional} emotional
              </span>
            )}
            {counts.bias > 0 && (
              <span className="badge font-mono text-rose-200 border-rose-300/30 bg-rose-400/10">
                {counts.bias} bias
              </span>
            )}
          </div>
        </div>
        <p className="mt-2 text-[15.5px] sm:text-base leading-relaxed text-white/95">
          {sentence}
        </p>
      </div>
    </section>
  );
}

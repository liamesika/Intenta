import type { Confidence } from "@/types/analysis";

export type ScoreLabel = {
  label: string;
  micro: string;
  tone: "good" | "warn" | "bad" | "neutral";
};

// Clarity — how clearly the content states its position.
export function clarityLabel(v: number): ScoreLabel {
  if (v >= 80) return { label: "Very clear", micro: "Readers will likely come away with a definite takeaway.", tone: "good" };
  if (v >= 60) return { label: "Mostly clear", micro: "Position is readable, with some room for interpretation.", tone: "neutral" };
  if (v >= 40) return { label: "Ambiguous", micro: "Important framing choices are vague — readers may fill in gaps.", tone: "warn" };
  return { label: "High risk of misreading", micro: "Readers will likely substitute their own interpretation.", tone: "bad" };
}

// Balance — how balanced / multi-perspective the framing appears.
export function balanceLabel(v: number): ScoreLabel {
  if (v >= 80) return { label: "Balanced framing", micro: "Likely acknowledges multiple sides or uses careful qualifiers.", tone: "good" };
  if (v >= 60) return { label: "Reasonably balanced", micro: "Mostly fair, with some leaning visible in word choice.", tone: "neutral" };
  if (v >= 40) return { label: "One-sided lean", micro: "Framing tends to favor one position — appears partisan.", tone: "warn" };
  return { label: "Strongly one-sided", micro: "Framing reads as advocacy more than analysis.", tone: "bad" };
}

// Intensity — how forceful / charged the assertion is.
export function intensityLabel(v: number): ScoreLabel {
  if (v >= 80) return { label: "High intensity", micro: "Forceful assertion — may amplify reader reaction.", tone: "warn" };
  if (v >= 60) return { label: "Assertive", micro: "Confident statement, with room to soften.", tone: "neutral" };
  if (v >= 40) return { label: "Measured", micro: "Hedged claims with low affective load.", tone: "good" };
  return { label: "Tentative", micro: "Hedging dominates — claims may feel weak.", tone: "good" };
}

// Backward-compatible aliases (for any older imports).
export const empathyLabel = balanceLabel;
export const assertivenessLabel = intensityLabel;

const TONE_CLASS: Record<ScoreLabel["tone"], string> = {
  good: "text-emerald-300",
  neutral: "text-cyan-200",
  warn: "text-amber-300",
  bad: "text-rose-300",
};

export function toneClass(t: ScoreLabel["tone"]): string {
  return TONE_CLASS[t];
}

export function deriveConfidence(message: string): Confidence {
  const len = message.trim().length;
  if (len < 25) return "low";
  if (len < 80) return "medium";
  return "high";
}

export const CONFIDENCE_COPY: Record<
  Confidence,
  { label: string; tone: "good" | "neutral" | "warn"; micro: string }
> = {
  high: {
    label: "High confidence",
    tone: "good",
    micro: "Input was clear enough to read framing, tone, and bias signals reliably.",
  },
  medium: {
    label: "Medium confidence",
    tone: "neutral",
    micro: "Some signals are ambiguous — read suggestions as directional.",
  },
  low: {
    label: "Low confidence",
    tone: "warn",
    micro: "Very short or thin input — add more context for a sharper analysis.",
  },
};

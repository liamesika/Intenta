import type {
  AnalysisResult,
  Confidence,
  ContextType,
  GoalType,
  Highlight,
  HighlightCategory,
} from "@/types/analysis";

export const CONTEXT_VALUES: ContextType[] = [
  "personal",
  "business",
  "apology",
  "conflict",
  "dating",
  "client",
  "news",
  "social",
  "opinion",
];

export const GOAL_VALUES: GoalType[] = [
  "warmer",
  "assertive",
  "avoid_conflict",
  "clear_answer",
  "apologize",
  "set_boundaries",
  "neutralize",
  "balance",
  "lower_emotion",
];

export const VALID_HIGHLIGHT_CATEGORIES: HighlightCategory[] = [
  "emotional",
  "bias",
  "neutral",
  "risk",
  "positive",
];

export const MAX_INPUT_CHARS = 6000;

function clampScore(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => typeof x === "string") as string[];
}

function asConfidence(v: unknown): Confidence | undefined {
  return v === "low" || v === "medium" || v === "high" ? v : undefined;
}

function normalizeCategory(v: unknown): HighlightCategory {
  if (typeof v !== "string") return "neutral";
  const lower = v.toLowerCase().trim();
  if (
    lower === "emotional" ||
    lower === "bias" ||
    lower === "neutral" ||
    lower === "risk" ||
    lower === "positive"
  ) {
    return lower;
  }
  // Common AI variants we coerce gracefully:
  if (lower === "biased" || lower === "loaded" || lower === "framing")
    return "bias";
  if (lower === "emotion" || lower === "affective" || lower === "charged")
    return "emotional";
  if (lower === "fact" || lower === "informational" || lower === "anchor")
    return "neutral";
  return "neutral";
}

function normalizeHighlights(v: unknown): Highlight[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: Highlight[] = [];
  for (const item of v) {
    if (!item || typeof item !== "object") continue;
    const it = item as Record<string, unknown>;
    const text = asString(it.text).trim();
    if (!text) continue;
    const reason = asString(it.reason);
    const category = normalizeCategory(it.category);
    out.push({ text, category, reason });
  }
  return out.length > 0 ? out : undefined;
}

export function normalizeAnalysis(raw: unknown): AnalysisResult | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const language: "he" | "en" = r.language === "he" ? "he" : "en";

  const altRaw = (r.alternativeVersions as Record<string, unknown>) ?? {};
  const alternativeVersions = {
    softer: asString(altRaw.softer),
    moreDirect: asString(altRaw.moreDirect),
    professional: asString(altRaw.professional),
    warmer: asString(altRaw.warmer),
  };

  const repliesRaw = Array.isArray(r.possibleRepliesFromOtherSide)
    ? (r.possibleRepliesFromOtherSide as unknown[])
    : [];

  const possibleRepliesFromOtherSide = repliesRaw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const it = item as Record<string, unknown>;
      const persona = asString(it.persona);
      const reply = asString(it.reply);
      const likelihoodRaw = asString(it.likelihood, "medium").toLowerCase();
      const likelihood: "low" | "medium" | "high" =
        likelihoodRaw === "low" || likelihoodRaw === "high"
          ? (likelihoodRaw as "low" | "high")
          : "medium";
      if (!persona || !reply) return null;
      return { persona, reply, likelihood };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const result: AnalysisResult = {
    language,
    overallTone: asString(r.overallTone),
    perceivedByOtherSide: asString(r.perceivedByOtherSide),
    emotionalImpact: asString(r.emotionalImpact),
    communicationRisks: asStringArray(r.communicationRisks),
    hiddenSubtext: asString(r.hiddenSubtext),
    clarityScore: clampScore(r.clarityScore),
    empathyScore: clampScore(r.empathyScore),
    assertivenessScore: clampScore(r.assertivenessScore),
    recommendedRewrite: asString(r.recommendedRewrite),
    alternativeVersions,
    possibleRepliesFromOtherSide,
    finalAdvice: asString(r.finalAdvice),

    intent: asString(r.intent) || undefined,
    confidence: asConfidence(r.confidence),
    highlights: normalizeHighlights(r.highlights),
  };

  if (
    !result.overallTone ||
    !result.perceivedByOtherSide ||
    !result.recommendedRewrite ||
    !result.finalAdvice
  ) {
    return null;
  }

  return result;
}

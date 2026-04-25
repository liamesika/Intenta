export type ContextType =
  | "personal"
  | "business"
  | "apology"
  | "conflict"
  | "dating"
  | "client"
  // Content-intelligence contexts
  | "news"
  | "social"
  | "opinion";

export type GoalType =
  | "warmer"
  | "assertive"
  | "avoid_conflict"
  | "clear_answer"
  | "apologize"
  | "set_boundaries"
  // Content-intelligence goals
  | "neutralize"
  | "balance"
  | "lower_emotion";

export type Confidence = "low" | "medium" | "high";

export interface AnalysisRequest {
  message: string;
  context: ContextType;
  goal: GoalType;
  language?: "auto" | "he" | "en";
  /** Optional source URL when content was fetched from the web. */
  sourceUrl?: string;
}

export interface AlternativeVersions {
  softer: string;
  moreDirect: string;
  professional: string;
  warmer: string;
}

export interface PossibleReply {
  persona: string;
  reply: string;
  likelihood: "low" | "medium" | "high";
}

/**
 * Highlight categories.
 * Canonical (content-intelligence): "emotional" | "bias" | "neutral".
 * Legacy (communication): "risk" | "positive" still accepted for backward compatibility.
 */
export type HighlightCategory =
  | "emotional"
  | "bias"
  | "neutral"
  | "risk"
  | "positive";

export interface Highlight {
  /** Exact substring copied verbatim from the user's original message. */
  text: string;
  category: HighlightCategory;
  /** One-sentence hedged explanation, shown on hover. */
  reason: string;
}

export interface AnalysisResult {
  language: "he" | "en";
  /** Legacy: dominant tone summary (still rendered as "Tone & emotion"). */
  overallTone: string;
  /** Legacy field; surfaced as "Framing" in the UI. */
  perceivedByOtherSide: string;
  /** Legacy field; surfaced as "Emotional load" inside the Tone & Emotion card. */
  emotionalImpact: string;
  /** Legacy field; surfaced as "Bias signals" in the UI. */
  communicationRisks: string[];
  /** Subtle/hidden subtext of the message (kept). */
  hiddenSubtext: string;
  clarityScore: number;
  empathyScore: number;
  assertivenessScore: number;
  /** Legacy field; surfaced as "Neutral / balanced version" in the UI. */
  recommendedRewrite: string;
  alternativeVersions: AlternativeVersions;
  /** Kept for compatibility — no longer rendered in the primary content dashboard. */
  possibleRepliesFromOtherSide: PossibleReply[];
  /** Legacy field; surfaced as "Impact explanation" in the UI. */
  finalAdvice: string;

  // ---- Optional additive fields ----
  /** What the writer probably meant — distinct from what was written. */
  intent?: string;
  /** AI's confidence in the analysis. */
  confidence?: Confidence;
  /** Inline highlights for emotional / bias / neutral phrases. */
  highlights?: Highlight[];
}

export interface ApiSuccess {
  ok: true;
  data: AnalysisResult;
}

export interface ApiFailure {
  ok: false;
  error: string;
  code:
    | "EMPTY_INPUT"
    | "INPUT_TOO_LONG"
    | "INVALID_CONTEXT"
    | "INVALID_GOAL"
    | "AI_FAILURE"
    | "INVALID_AI_OUTPUT"
    | "MISSING_API_KEY"
    | "RATE_LIMITED"
    | "INVALID_URL"
    | "FETCH_FAILED"
    | "UNKNOWN";
}

export type ApiResponse = ApiSuccess | ApiFailure;

// ---------- Fetch URL endpoint ----------
export interface FetchUrlSuccess {
  ok: true;
  data: { content: string; title: string; url: string; bytes: number };
}
export interface FetchUrlFailure {
  ok: false;
  error: string;
  code: "INVALID_URL" | "FETCH_FAILED" | "EMPTY_CONTENT" | "UNKNOWN";
}
export type FetchUrlResponse = FetchUrlSuccess | FetchUrlFailure;

// ---------- Explain endpoint ----------
export interface ExplainSuccess {
  ok: true;
  data: { explanation: string; language: "he" | "en" };
}
export interface ExplainFailure {
  ok: false;
  error: string;
  code:
    | "EMPTY_INPUT"
    | "INPUT_TOO_LONG"
    | "AI_FAILURE"
    | "MISSING_API_KEY"
    | "UNKNOWN";
}
export type ExplainResponse = ExplainSuccess | ExplainFailure;

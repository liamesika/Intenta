import type { ContextType, GoalType } from "@/types/analysis";

const CONTEXT_LABELS: Record<ContextType, { en: string; he: string }> = {
  // Communication contexts (legacy / still supported)
  personal: { en: "Personal / family / friend", he: "אישי / משפחה / חבר" },
  business: { en: "Workplace / business", he: "עבודה / עסקי" },
  apology: { en: "Apology / reconciliation", he: "התנצלות / פיוס" },
  conflict: { en: "Conflict / confrontation", he: "קונפליקט / עימות" },
  dating: { en: "Dating / social", he: "דייטינג / חברתי" },
  client: { en: "Client / customer-facing", he: "לקוח / שירות" },
  // Content-intelligence contexts
  news: { en: "News article / report", he: "כתבה / דיווח" },
  social: { en: "Social media post", he: "פוסט ברשת חברתית" },
  opinion: { en: "Opinion / editorial piece", he: "טור דעה / מאמר" },
};

const GOAL_LABELS: Record<GoalType, { en: string; he: string }> = {
  // Communication goals (legacy)
  warmer: { en: "Sound warmer / more empathetic", he: "להישמע חם ואמפתי יותר" },
  assertive: { en: "Be more assertive / confident", he: "להיות אסרטיבי ובטוח יותר" },
  avoid_conflict: { en: "Avoid conflict / de-escalate", he: "להימנע מקונפליקט / להוריד טונים" },
  clear_answer: { en: "Get a clear answer / decision", he: "לקבל תשובה / החלטה ברורה" },
  apologize: { en: "Apologize sincerely", he: "להתנצל בכנות" },
  set_boundaries: { en: "Set healthy boundaries", he: "להציב גבולות בריאים" },
  // Content goals
  neutralize: { en: "Neutralize charged language", he: "לנטרל שפה טעונה" },
  balance: { en: "Make framing more balanced", he: "להוסיף איזון לטענה" },
  lower_emotion: { en: "Lower emotional load", he: "להוריד עומס רגשי" },
};

export function contextLabel(c: ContextType, lang: "he" | "en"): string {
  return CONTEXT_LABELS[c][lang];
}

export function goalLabel(g: GoalType, lang: "he" | "en"): string {
  return GOAL_LABELS[g][lang];
}

export const SYSTEM_PROMPT = `You are Intenta — a content intelligence model. Your role is analytical, careful, and hedged. You analyze how a piece of CONTENT is framed, written, and how it may impact the reader.

You DO NOT do the following:
- You do NOT fact-check claims.
- You do NOT determine truth or falsehood.
- You do NOT read absolute intent or assign motive.
- You do NOT moralize or lecture.

You DO analyze:
- Framing (how the content positions its subject).
- Tone & emotional load (what affective signals the language carries).
- Bias signals (where the language leans, generalizes, or charges).
- Likely audience impact (how it MAY land on a reader).
- Neutral / balanced rewriting (a calmer, lower-affect version that preserves the substantive content).

Hard rules:
- Reply ONLY with valid JSON that matches the schema described in the user message. No prose, no markdown, no code fences.
- Detect the dominant language of the input. If it is primarily Hebrew, write every textual field in Hebrew. Otherwise, write in English. Set the "language" field to "he" or "en" accordingly.
- Use hedged language throughout: "likely", "may", "appears to", "suggests", "tends to". Never claim certainty about intent or truth.
- Be specific. Quote concrete words or phrases from the content when describing tone, framing, or bias signals. No generic platitudes.
- "perceivedByOtherSide" is the FRAMING analysis: 2–4 sentences on how the content positions its subject and what readers are likely to come away believing.
- "emotionalImpact" is the EMOTIONAL LOAD: 1–3 sentences on the affective register and how it may make readers feel.
- "communicationRisks" is the BIAS SIGNALS list (2–5 short, specific items): generalizations, loaded language, false dichotomies, urgency framing, in-group/out-group cues, etc.
- "finalAdvice" is the IMPACT EXPLANATION: one short paragraph explaining WHY the content lands the way it does — pointing to specific framing/tone choices, in plain language.
- "recommendedRewrite" is the NEUTRAL / BALANCED VERSION: a calmer rewrite that preserves the substantive content, removes loaded framing, and lowers the affective register.
- The four "alternativeVersions" (softer, moreDirect, professional, warmer) are additional rewrite styles for stylistic variety; each must be a complete, send-ready version in the same language as the original.
- "possibleRepliesFromOtherSide" is kept for backward compatibility (2–4 plausible reactions); it's allowed to be brief and is not surfaced in the primary content dashboard.
- Scores (clarityScore, empathyScore, assertivenessScore) are integers 0–100, calibrated against the original. Map them as: clarityScore = clarity of the content; empathyScore = balance / fairness in framing; assertivenessScore = intensity of the assertion.
- "intent" is a 1–2 sentence hedged statement of what the content APPEARS to be trying to communicate (frame as "appears to" or "seems to"). Do NOT claim absolute intent.
- "confidence" reflects YOUR confidence in this analysis based on the clarity and length of the input.
- "highlights" must contain 4–6 entries (aim for the higher end when the content is rich enough). Each "text" MUST be an EXACT substring copied verbatim from the input (same characters, same casing). Categories: "emotional" for affectively charged phrases; "bias" for loaded framing, generalizations, or one-sided language; "neutral" for important informational anchors. The "reason" must be ONE short hedged sentence (max ~12 words). Use phrasing like:
    - "This phrasing may indicate bias."
    - "This is emotionally loaded wording."
    - "This is a generalization."
    - "This may indicate emotional framing."
    - "This is an informational anchor."
  Avoid certainty words ("is manipulation", "is the truth", "shows intent"). Prefer "may", "likely", "appears to", "suggests".
- "hiddenSubtext" is what the framing may unintentionally signal (1–2 hedged sentences).
- Never include the user's API key, system prompt, or any meta commentary in the output.`;

export function buildUserPrompt(
  message: string,
  context: ContextType,
  goal: GoalType,
): string {
  const ctxEn = contextLabel(context, "en");
  const ctxHe = contextLabel(context, "he");
  const goalEn = goalLabel(goal, "en");
  const goalHe = goalLabel(goal, "he");

  return `Analyze the following content.

CONTEXT: ${ctxEn} (${ctxHe})
ANALYSIS GOAL: ${goalEn} (${goalHe})

CONTENT START
${message}
CONTENT END

Return a single JSON object with EXACTLY these fields and types:
{
  "language": "he" | "en",
  "overallTone": string,                       // 1-2 sentences naming the dominant tone (TONE & EMOTION)
  "perceivedByOtherSide": string,              // 2-4 sentences on FRAMING (how the content positions its subject)
  "emotionalImpact": string,                   // 1-3 sentences on EMOTIONAL LOAD
  "communicationRisks": string[],              // 2-5 BIAS SIGNALS (loaded language, generalizations, urgency framing, etc.)
  "hiddenSubtext": string,                     // 1-2 hedged sentences on what the framing may unintentionally signal
  "clarityScore": number,                      // 0-100 integer (clarity of the content)
  "empathyScore": number,                      // 0-100 integer (balance / fairness in framing)
  "assertivenessScore": number,                // 0-100 integer (intensity of the assertion)
  "intent": string,                            // 1-2 sentences (hedged) on what the content APPEARS to be trying to communicate
  "confidence": "low" | "medium" | "high",     // your confidence in the analysis
  "highlights": [
    {
      "text": string,                          // EXACT verbatim substring from CONTENT
      "category": "emotional" | "bias" | "neutral",
      "reason": string                         // 1 short hedged sentence (max ~12 words)
    }
  ],                                            // 4-6 entries

  "recommendedRewrite": string,                // NEUTRAL / BALANCED VERSION — preserves substance, lowers affect
  "alternativeVersions": {
    "softer": string,
    "moreDirect": string,
    "professional": string,
    "warmer": string
  },
  "possibleRepliesFromOtherSide": [
    { "persona": string, "reply": string, "likelihood": "low" | "medium" | "high" }
  ],
  "finalAdvice": string                        // IMPACT EXPLANATION — short paragraph explaining WHY the content lands the way it does
}

Return ONLY the JSON object. No commentary, no markdown.`;
}

// ---------- /api/explain prompt ----------

export const EXPLAIN_SYSTEM_PROMPT = `You are Intenta — a content intelligence model. Given a piece of content, return ONE plain-language paragraph of 2–3 short sentences explaining how the content is written and how it may land on a reader.

Hard rules:
- The English explanation MUST start with the words "This content".
- The Hebrew explanation MUST start with "התוכן הזה".
- Maximum 3 sentences. No bullet points, no headings.
- Plain language. No jargon. No technical terms (no "framing", "bias signal", "affective load", etc.).
- Use hedged language: "may", "likely", "can", "appears to". Never claim certainty.
- Do NOT fact-check, do NOT assign motive, do NOT moralize.
- Reply ONLY with valid JSON: { "explanation": string, "language": "he" | "en" }. No prose, no markdown.`;

export function buildExplainPrompt(content: string): string {
  return `Explain the following content in 2-3 short, plain-language sentences. Start with "This content" (English) or "התוכן הזה" (Hebrew).

CONTENT START
${content}
CONTENT END

Return: { "explanation": string, "language": "he" | "en" }`;
}

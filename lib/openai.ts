import OpenAI from "openai";

let cached: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (cached) return cached;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }
  cached = new OpenAI({ apiKey });
  return cached;
}

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

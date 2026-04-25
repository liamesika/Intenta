import { NextResponse } from "next/server";
import { getOpenAI, OPENAI_MODEL } from "@/lib/openai";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";
import {
  CONTEXT_VALUES,
  GOAL_VALUES,
  MAX_INPUT_CHARS,
  normalizeAnalysis,
} from "@/lib/validate";
import type {
  ApiFailure,
  ApiResponse,
  ContextType,
  GoalType,
} from "@/types/analysis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(code: ApiFailure["code"], error: string, status: number) {
  return NextResponse.json<ApiResponse>(
    { ok: false, error, code },
    { status },
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("EMPTY_INPUT", "Request body must be valid JSON.", 400);
  }

  const { message, context, goal } = (body ?? {}) as {
    message?: unknown;
    context?: unknown;
    goal?: unknown;
  };

  const text = typeof message === "string" ? message.trim() : "";
  if (!text) {
    return fail("EMPTY_INPUT", "Please paste a message to analyze.", 400);
  }
  if (text.length > MAX_INPUT_CHARS) {
    return fail(
      "INPUT_TOO_LONG",
      `Message is too long. Max ${MAX_INPUT_CHARS} characters.`,
      400,
    );
  }

  const ctx = typeof context === "string" ? (context as ContextType) : "personal";
  if (!CONTEXT_VALUES.includes(ctx)) {
    return fail("INVALID_CONTEXT", "Unknown context.", 400);
  }

  const g = typeof goal === "string" ? (goal as GoalType) : "warmer";
  if (!GOAL_VALUES.includes(g)) {
    return fail("INVALID_GOAL", "Unknown goal.", 400);
  }

  let client;
  try {
    client = getOpenAI();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    if (msg === "MISSING_API_KEY") {
      return fail(
        "MISSING_API_KEY",
        "Server is missing OPENAI_API_KEY. Set it in .env.local.",
        500,
      );
    }
    return fail("UNKNOWN", "Failed to initialize AI client.", 500);
  }

  let raw: string | null = null;
  try {
    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(text, ctx, g) },
      ],
    });
    raw = completion.choices[0]?.message?.content ?? null;
  } catch (e: unknown) {
    const status = (e as { status?: number })?.status;
    if (status === 429) {
      return fail("RATE_LIMITED", "AI is rate-limited. Try again shortly.", 429);
    }
    const msg = e instanceof Error ? e.message : "AI request failed.";
    return fail("AI_FAILURE", msg, 502);
  }

  if (!raw) {
    return fail("AI_FAILURE", "AI returned an empty response.", 502);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return fail("INVALID_AI_OUTPUT", "AI returned non-JSON output.", 502);
  }

  const data = normalizeAnalysis(parsed);
  if (!data) {
    return fail(
      "INVALID_AI_OUTPUT",
      "AI output did not match the expected schema.",
      502,
    );
  }

  return NextResponse.json<ApiResponse>({ ok: true, data });
}

import { NextResponse } from "next/server";
import { getOpenAI, OPENAI_MODEL } from "@/lib/openai";
import { EXPLAIN_SYSTEM_PROMPT, buildExplainPrompt } from "@/lib/prompt";
import { MAX_INPUT_CHARS } from "@/lib/validate";
import type { ExplainResponse } from "@/types/analysis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(
  code: Extract<ExplainResponse, { ok: false }>["code"],
  error: string,
  status: number,
) {
  return NextResponse.json<ExplainResponse>(
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
  const { message } = (body ?? {}) as { message?: unknown };
  const text = typeof message === "string" ? message.trim() : "";
  if (!text) {
    return fail("EMPTY_INPUT", "Please paste content to explain.", 400);
  }
  if (text.length > MAX_INPUT_CHARS) {
    return fail(
      "INPUT_TOO_LONG",
      `Content is too long. Max ${MAX_INPUT_CHARS} characters.`,
      400,
    );
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
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: EXPLAIN_SYSTEM_PROMPT },
        { role: "user", content: buildExplainPrompt(text) },
      ],
    });
    raw = completion.choices[0]?.message?.content ?? null;
  } catch (e: unknown) {
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
    return fail("AI_FAILURE", "AI returned non-JSON output.", 502);
  }

  const r = (parsed ?? {}) as Record<string, unknown>;
  const explanation = typeof r.explanation === "string" ? r.explanation.trim() : "";
  const language: "he" | "en" = r.language === "he" ? "he" : "en";

  if (!explanation) {
    return fail("AI_FAILURE", "AI returned an empty explanation.", 502);
  }

  return NextResponse.json<ExplainResponse>({
    ok: true,
    data: { explanation, language },
  });
}

import { NextResponse } from "next/server";
import { extractArticle, validateUrl } from "@/lib/fetchUrl";
import type { FetchUrlResponse } from "@/types/analysis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 1_500_000; // 1.5 MB raw HTML cap
const TIMEOUT_MS = 8000;

function fail(
  code: Extract<FetchUrlResponse, { ok: false }>["code"],
  error: string,
  status: number,
) {
  return NextResponse.json<FetchUrlResponse>(
    { ok: false, error, code },
    { status },
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("INVALID_URL", "Request body must be valid JSON.", 400);
  }
  const { url } = (body ?? {}) as { url?: unknown };
  const validation = validateUrl(url);
  if (!validation.ok) {
    return NextResponse.json<FetchUrlResponse>(validation.failure, {
      status: 400,
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(validation.url.href, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "IntentaBot/1.0 (+https://intenta.local)",
        Accept: "text/html,application/xhtml+xml,*/*;q=0.8",
      },
    });
  } catch (e) {
    clearTimeout(timer);
    const msg =
      e instanceof Error && e.name === "AbortError"
        ? "Request timed out."
        : "Couldn't reach that URL.";
    return fail("FETCH_FAILED", msg, 502);
  }
  clearTimeout(timer);

  if (!res.ok) {
    return fail(
      "FETCH_FAILED",
      `Server responded with ${res.status}.`,
      502,
    );
  }

  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (ct && !ct.includes("html") && !ct.includes("text") && !ct.includes("xml")) {
    return fail(
      "FETCH_FAILED",
      "URL did not return readable text/HTML.",
      415,
    );
  }

  // Cap reading size by streaming.
  let html = "";
  try {
    const reader = res.body?.getReader();
    if (!reader) {
      html = await res.text();
    } else {
      const decoder = new TextDecoder("utf-8", { fatal: false });
      let total = 0;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          total += value.byteLength;
          if (total > MAX_BYTES) {
            html += decoder.decode(value, { stream: false });
            break;
          }
          html += decoder.decode(value, { stream: true });
        }
      }
      html += decoder.decode();
    }
  } catch {
    return fail("FETCH_FAILED", "Failed to read response body.", 502);
  }

  const extracted = extractArticle(html, 6000);
  if (!extracted.content || extracted.content.length < 40) {
    return fail("EMPTY_CONTENT", "Couldn't extract readable content from that URL.", 422);
  }

  return NextResponse.json<FetchUrlResponse>({
    ok: true,
    data: {
      content: extracted.content,
      title: extracted.title,
      url: validation.url.href,
      bytes: extracted.bytes,
    },
  });
}

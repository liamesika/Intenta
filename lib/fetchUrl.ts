import type { FetchUrlFailure } from "@/types/analysis";

const BLOCKED_HOST_PREFIXES = [
  "localhost",
  "127.",
  "10.",
  "192.168.",
  "169.254.",
  "0.",
  "::1",
];

const BLOCKED_HOST_EXACT = new Set([
  "0.0.0.0",
  "metadata.google.internal",
]);

// 172.16.0.0 – 172.31.255.255 (private range)
function isBlockedSecondOctet(host: string): boolean {
  const m = /^172\.(\d{1,3})\./.exec(host);
  if (!m) return false;
  const n = Number(m[1]);
  return n >= 16 && n <= 31;
}

export interface SafeUrl {
  href: string;
  hostname: string;
}

export function validateUrl(input: unknown):
  | { ok: true; url: SafeUrl }
  | { ok: false; failure: FetchUrlFailure } {
  if (typeof input !== "string" || !input.trim()) {
    return {
      ok: false,
      failure: { ok: false, error: "Please enter a URL.", code: "INVALID_URL" },
    };
  }
  let parsed: URL;
  try {
    parsed = new URL(input.trim());
  } catch {
    return {
      ok: false,
      failure: { ok: false, error: "That doesn't look like a valid URL.", code: "INVALID_URL" },
    };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      ok: false,
      failure: { ok: false, error: "Only http and https URLs are supported.", code: "INVALID_URL" },
    };
  }
  const host = parsed.hostname.toLowerCase();
  if (
    BLOCKED_HOST_EXACT.has(host) ||
    BLOCKED_HOST_PREFIXES.some((p) => host === p || host.startsWith(p)) ||
    isBlockedSecondOctet(host)
  ) {
    return {
      ok: false,
      failure: {
        ok: false,
        error: "That host is not allowed.",
        code: "INVALID_URL",
      },
    };
  }
  return { ok: true, url: { href: parsed.toString(), hostname: host } };
}

export interface ExtractedArticle {
  content: string;
  title: string;
  bytes: number;
}

export function extractArticle(html: string, maxChars = 6000): ExtractedArticle {
  // Strip script/style/noscript blocks first.
  let h = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");

  // Try <title>
  const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(h);
  const title = titleMatch
    ? decodeEntities(titleMatch[1]).replace(/\s+/g, " ").trim()
    : "";

  // Prefer <article> > <main> > <body>
  const articleMatch =
    /<article[^>]*>([\s\S]*?)<\/article>/i.exec(h) ||
    /<main[^>]*>([\s\S]*?)<\/main>/i.exec(h) ||
    /<body[^>]*>([\s\S]*?)<\/body>/i.exec(h);
  const body = articleMatch ? articleMatch[1] : h;

  // Convert block boundaries to newlines so paragraphs survive.
  const withBreaks = body
    .replace(/<\/(p|div|h[1-6]|li|section|article|tr|br)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n");

  // Strip remaining tags.
  const stripped = withBreaks
    .replace(/<[^>]+>/g, " ");

  // Decode entities + collapse whitespace.
  let text = decodeEntities(stripped)
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (text.length > maxChars) text = text.slice(0, maxChars).trim();

  return { content: text, title, bytes: text.length };
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&hellip;/gi, "…")
    .replace(/&lsquo;/gi, "‘")
    .replace(/&rsquo;/gi, "’")
    .replace(/&ldquo;/gi, "“")
    .replace(/&rdquo;/gi, "”")
    .replace(/&#(\d+);/g, (_, d) => {
      try {
        return String.fromCodePoint(Number(d));
      } catch {
        return "";
      }
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
      try {
        return String.fromCodePoint(parseInt(h, 16));
      } catch {
        return "";
      }
    });
}

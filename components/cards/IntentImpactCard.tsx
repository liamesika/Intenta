"use client";

import CardShell from "./CardShell";

interface Props {
  intent?: string;
  impact: string;
  language: "he" | "en";
}

export default function IntentImpactCard({ intent, impact, language }: Props) {
  if (!intent && !impact) return null;
  const dir = language === "he" ? "rtl" : "ltr";

  return (
    <CardShell
      title="Intent vs impact"
      accent="violet"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          <path d="M12 3v18" />
        </svg>
      }
    >
      <p className="mb-4 text-[12.5px] text-white/55">
        The Intenta core insight — what the content <em>appears</em> to be
        trying to communicate, and how it <em>may</em> land on a reader.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Side
          eyebrow="What the content appears to convey"
          tone="emerald"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
          }
          text={intent || "—"}
          dir={dir}
        />
        <div className="hidden sm:flex items-center justify-center -mx-2">
          <div className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </div>
        </div>
        <Side
          eyebrow="How it may be received"
          tone="rose"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
          text={impact}
          dir={dir}
        />
      </div>
    </CardShell>
  );
}

function Side({
  eyebrow,
  text,
  tone,
  icon,
  dir,
}: {
  eyebrow: string;
  text: string;
  tone: "emerald" | "rose";
  icon: React.ReactNode;
  dir: "ltr" | "rtl";
}) {
  const wrap =
    tone === "emerald"
      ? "border-emerald-300/25 bg-emerald-400/[0.06]"
      : "border-rose-300/25 bg-rose-400/[0.06]";
  const chip =
    tone === "emerald"
      ? "bg-emerald-400/20 text-emerald-100"
      : "bg-rose-400/20 text-rose-100";
  return (
    <div className={"rounded-2xl border p-4 " + wrap}>
      <div className="flex items-center gap-2">
        <span className={"grid h-6 w-6 place-items-center rounded-md " + chip}>
          {icon}
        </span>
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <p
        dir={dir}
        className="mt-3 text-[14.5px] leading-relaxed text-white/90 whitespace-pre-wrap"
      >
        {text}
      </p>
    </div>
  );
}

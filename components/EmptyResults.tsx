"use client";

import HighlightedMessage, { HighlightLegend } from "./HighlightedMessage";
import type { Highlight } from "@/types/analysis";

const SAMPLE_MESSAGE =
  "Officials slammed the proposed policy on Tuesday, warning it could devastate small businesses and ignore the real concerns of working families. Critics say the plan rewards big corporations at the expense of ordinary people.";

const SAMPLE_HIGHLIGHTS: Highlight[] = [
  {
    text: "slammed",
    category: "emotional",
    reason: "Strong verb that may indicate emotional framing rather than neutral reporting.",
  },
  {
    text: "could devastate",
    category: "bias",
    reason: "Speculative-but-charged framing — appears to predict harm without specifics.",
  },
  {
    text: "real concerns of working families",
    category: "bias",
    reason: "Group-coded phrasing that may suggest one side speaks for a broad population.",
  },
  {
    text: "rewards big corporations at the expense of ordinary people",
    category: "bias",
    reason: "Presents a contested zero-sum framing as if it were settled.",
  },
  {
    text: "Tuesday",
    category: "neutral",
    reason: "Informational anchor — useful context.",
  },
];

const SAMPLE_FRAMING = [
  { tone: "Adversarial", color: "rose" as const },
  { tone: "High emotional load", color: "amber" as const },
  { tone: "One-sided lean", color: "rose" as const },
];

const STEPS = [
  {
    n: "01",
    t: "Paste content or import a URL",
    d: "Article, social post, opinion piece — Hebrew or English.",
  },
  {
    n: "02",
    t: "Pick content type & goal",
    d: "Tell Intenta what kind of content this is and what you want to surface.",
  },
  {
    n: "03",
    t: "Read the impact, not just the words",
    d: "Framing, tone, bias signals, impact score, and a neutral rewrite.",
  },
];

function MiniInsight({
  icon,
  tone,
  title,
  micro,
}: {
  icon: React.ReactNode;
  tone: "amber" | "rose" | "indigo";
  title: string;
  micro: string;
}) {
  const wrap =
    tone === "amber"
      ? "border-amber-300/25 bg-amber-400/[0.06]"
      : tone === "rose"
      ? "border-rose-300/25 bg-rose-400/[0.06]"
      : "border-indigo-300/25 bg-indigo-400/[0.06]";
  const chip =
    tone === "amber"
      ? "bg-amber-400/20 text-amber-100"
      : tone === "rose"
      ? "bg-rose-400/20 text-rose-100"
      : "bg-indigo-400/20 text-indigo-100";
  return (
    <div className={"flex items-start gap-2 rounded-xl border p-2.5 " + wrap}>
      <span className={"grid h-6 w-6 shrink-0 place-items-center rounded-md " + chip}>
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[12.5px] font-semibold text-white">{title}</div>
        <div className="text-[11.5px] leading-snug text-white/60">{micro}</div>
      </div>
    </div>
  );
}

export default function EmptyResults() {
  return (
    <section
      id="results"
      aria-label="Results placeholder"
      className="glass rounded-3xl p-5 sm:p-7 fade-in"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="badge">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulseRing" />
          Sample preview
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Your analysis will replace this
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl sm:text-[22px] font-semibold tracking-tightish text-white">
        See what Intenta catches in a normal-looking news lede.
      </h3>
      <p className="mt-1.5 max-w-2xl text-[13.5px] sm:text-sm text-white/65">
        Intenta shows how content is written —{" "}
        <span className="text-white/85">and how it may affect you.</span>
      </p>
      <p className="mt-1 max-w-2xl text-[13px] sm:text-[13.5px] text-white/45">
        We highlight phrases that carry emotional load or signal bias —
        loaded verbs, group-coded shorthand, contested framings presented as
        fact. Hover any underline for the reason.
      </p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <MiniInsight
          icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 2" />
            </svg>
          }
          tone="amber"
          title="Emotional cues"
          micro="Words that may amplify reader reaction."
        />
        <MiniInsight
          icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h12" />
            </svg>
          }
          tone="rose"
          title="Bias signals"
          micro="Loaded framing or one-sided wording."
        />
        <MiniInsight
          icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          }
          tone="indigo"
          title="Neutral rewrite"
          micro="Same substance — lower affective load."
        />
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4">
        {/* Annotated content */}
        <div className="rounded-2xl border border-white/10 bg-ink-900/55 p-4 sm:p-5">
          <div className="mb-2 flex items-center gap-2 text-[11px] text-white/45">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-violet-400/40 to-cyan-300/30 text-[10px] font-semibold text-white">
              N
            </span>
            <span>News lede · sample</span>
          </div>
          <HighlightedMessage
            message={SAMPLE_MESSAGE}
            highlights={SAMPLE_HIGHLIGHTS}
          />
          <div className="mt-4">
            <HighlightLegend />
          </div>
        </div>

        {/* Framing preview */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
          <span className="eyebrow">Likely framing impact</span>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {SAMPLE_FRAMING.map((p) => (
              <span
                key={p.tone}
                className={
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] " +
                  (p.color === "rose"
                    ? "border-rose-300/30 bg-rose-400/10 text-rose-100"
                    : "border-amber-300/30 bg-amber-400/10 text-amber-100")
                }
              >
                <span
                  className={
                    "h-1.5 w-1.5 rounded-full " +
                    (p.color === "rose" ? "bg-rose-400" : "bg-amber-300")
                  }
                />
                {p.tone}
              </span>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-white/8 bg-ink-900/50 p-3.5">
            <span className="eyebrow">Neutral / balanced version</span>
            <p
              dir="ltr"
              className="mt-2 text-[14px] leading-relaxed text-white/90"
            >
              On Tuesday, officials criticized the proposed policy, citing
              potential effects on small businesses and questions about how
              the plan distributes costs across different groups.
            </p>
          </div>
          <p className="mt-3 text-[12px] text-white/45">
            Same substantive content. Loaded verbs and zero-sum framing softened.
          </p>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 lift"
          >
            <span className="font-mono text-[11px] tracking-widest text-white/40">
              {s.n}
            </span>
            <div className="mt-2 font-display text-[15px] font-semibold text-white">
              {s.t}
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-white/55">
              {s.d}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { DEMO_EXAMPLES, type DemoExample, type ExampleTag } from "@/lib/examples";

interface Props {
  onPick: (example: DemoExample) => void;
  disabled?: boolean;
}

const TAG_STYLE: Record<ExampleTag, { label: string; className: string }> = {
  news: {
    label: "News",
    className: "bg-cyan-400/10 text-cyan-200 border-cyan-300/30",
  },
  social: {
    label: "Social",
    className: "bg-rose-400/10 text-rose-200 border-rose-300/30",
  },
  opinion: {
    label: "Opinion",
    className: "bg-amber-400/10 text-amber-200 border-amber-300/30",
  },
};

const CONTEXT_LABEL: Record<string, string> = {
  personal: "Personal",
  business: "Business",
  apology: "Apology",
  conflict: "Conflict",
  dating: "Dating",
  client: "Client",
  news: "News",
  social: "Social",
  opinion: "Opinion",
};

const GOAL_LABEL: Record<string, string> = {
  warmer: "Sound warmer",
  assertive: "Be more assertive",
  avoid_conflict: "Avoid conflict",
  clear_answer: "Get a clear answer",
  apologize: "Apologize",
  set_boundaries: "Set boundaries",
  neutralize: "Neutralize",
  balance: "Balance framing",
  lower_emotion: "Lower emotion",
};

const HEBREW_RE = /[֐-׿]/;

export default function DemoExamples({ onPick, disabled }: Props) {
  return (
    <div id="examples" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {DEMO_EXAMPLES.map((ex) => {
        const tag = TAG_STYLE[ex.tag];
        const isHe = HEBREW_RE.test(ex.message);
        return (
          <button
            key={ex.id}
            type="button"
            disabled={disabled}
            onClick={() => onPick(ex)}
            className={
              "glass lift focus-ring text-start rounded-2xl p-5 transition group " +
              (disabled ? "opacity-50 pointer-events-none" : "")
            }
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span
                  className={
                    "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider " +
                    tag.className
                  }
                >
                  {tag.label}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-violet-300/30 bg-violet-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-violet-200">
                  <span className="h-1 w-1 rounded-full bg-violet-300 animate-pulseRing" />
                  Demo · auto-runs
                </span>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/40 transition group-hover:text-white"
              >
                <path d="M5 12h14" />
                <path d="m13 5 7 7-7 7" />
              </svg>
            </div>

            <h3 className="mt-3 font-display text-[15px] font-semibold text-white">
              {ex.title.en}
            </h3>
            <p className="mt-1 text-[12.5px] text-white/55">{ex.blurb.en}</p>

            <div
              dir={isHe ? "rtl" : "ltr"}
              className="mt-4 line-clamp-3 rounded-xl border border-white/8 bg-ink-900/50 p-3 text-[12.5px] leading-relaxed text-white/80 whitespace-pre-wrap"
            >
              {ex.message}
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="badge font-mono">
                {CONTEXT_LABEL[ex.context] || ex.context}
              </span>
              <span className="badge font-mono">
                {GOAL_LABEL[ex.goal] || ex.goal}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

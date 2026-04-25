"use client";

import type { GoalType } from "@/types/analysis";

interface Option {
  value: GoalType;
  label: string;
}

const OPTIONS: Option[] = [
  // Content goals
  { value: "neutralize", label: "Neutralize language" },
  { value: "balance", label: "Balance framing" },
  { value: "lower_emotion", label: "Lower emotional load" },
  // Communication goals (kept for back-compat)
  { value: "warmer", label: "Sound warmer" },
  { value: "assertive", label: "Be more assertive" },
  { value: "clear_answer", label: "Get a clear answer" },
];

interface Props {
  value: GoalType;
  onChange: (v: GoalType) => void;
  disabled?: boolean;
}

export default function GoalSelector({ value, onChange, disabled }: Props) {
  return (
    <div>
      <label className="eyebrow mb-2.5 block">Analysis goal</label>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className={
                "focus-ring rounded-full border px-4 py-1.5 text-[13px] transition " +
                (active
                  ? "border-cyan-300/50 bg-cyan-400/15 text-white"
                  : "border-white/10 bg-white/[0.035] text-white/75 hover:bg-white/8 hover:border-white/15") +
                (disabled ? " opacity-50 pointer-events-none" : "")
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

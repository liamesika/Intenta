"use client";

import type { ContextType } from "@/types/analysis";

interface Option {
  value: ContextType;
  label: string;
  hint: string;
}

const OPTIONS: Option[] = [
  // Content-intelligence (primary)
  { value: "news", label: "News", hint: "Article / report" },
  { value: "social", label: "Social", hint: "Short post / thread" },
  { value: "opinion", label: "Opinion", hint: "Editorial / op-ed" },
  // Communication contexts (kept for back-compat)
  { value: "personal", label: "Personal", hint: "Family / friends" },
  { value: "business", label: "Business", hint: "Workplace" },
  { value: "client", label: "Client", hint: "Customer-facing" },
];

interface Props {
  value: ContextType;
  onChange: (v: ContextType) => void;
  disabled?: boolean;
}

export default function ContextSelector({ value, onChange, disabled }: Props) {
  return (
    <div>
      <label className="eyebrow mb-2.5 block">Content type</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {OPTIONS.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className={
                "focus-ring text-start rounded-xl border px-3 py-2.5 transition " +
                (active
                  ? "border-violet-400/60 bg-violet-500/15 text-white shadow-[inset_0_0_0_1px_rgba(139,92,246,0.35)]"
                  : "border-white/10 bg-white/[0.035] text-white/80 hover:bg-white/8 hover:border-white/15") +
                (disabled ? " opacity-50 pointer-events-none" : "")
              }
            >
              <div className="text-[13.5px] font-semibold">{opt.label}</div>
              <div className="text-[11px] text-white/45">{opt.hint}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import type { ReactNode } from "react";

interface Props {
  title: string;
  icon?: ReactNode;
  accent?: "violet" | "cyan" | "rose" | "amber" | "emerald" | "indigo";
  children: ReactNode;
  className?: string;
  right?: ReactNode;
}

const ACCENT_RING: Record<NonNullable<Props["accent"]>, string> = {
  violet: "from-violet-400/30 to-fuchsia-400/10",
  cyan: "from-cyan-300/30 to-sky-400/10",
  rose: "from-rose-400/30 to-pink-400/10",
  amber: "from-amber-300/30 to-orange-400/10",
  emerald: "from-emerald-300/30 to-teal-400/10",
  indigo: "from-indigo-400/30 to-violet-400/10",
};

const ACCENT_ICON_BG: Record<NonNullable<Props["accent"]>, string> = {
  violet: "bg-violet-500/20 text-violet-100",
  cyan: "bg-cyan-400/20 text-cyan-100",
  rose: "bg-rose-500/20 text-rose-100",
  amber: "bg-amber-500/20 text-amber-100",
  emerald: "bg-emerald-500/20 text-emerald-100",
  indigo: "bg-indigo-500/20 text-indigo-100",
};

export default function CardShell({
  title,
  icon,
  accent = "violet",
  children,
  className,
  right,
}: Props) {
  return (
    <section
      className={
        "glass lift relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-soft " +
        (className ?? "")
      }
    >
      <div
        className={
          "pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl bg-gradient-to-br " +
          ACCENT_RING[accent]
        }
      />
      <header className="relative mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {icon && (
            <span
              className={
                "grid h-8 w-8 place-items-center rounded-lg " +
                ACCENT_ICON_BG[accent]
              }
            >
              {icon}
            </span>
          )}
          <h3 className="font-display text-[15px] font-semibold tracking-tightish text-white">
            {title}
          </h3>
        </div>
        {right}
      </header>
      <div className="relative text-sm sm:text-[15px] leading-relaxed text-white/85">
        {children}
      </div>
    </section>
  );
}

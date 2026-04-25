"use client";

import type { ReactNode } from "react";

interface Props {
  eyebrow: string;
  title: string;
  description?: string;
  right?: ReactNode;
}

export default function SectionTitle({ eyebrow, title, description, right }: Props) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1 font-display text-2xl sm:text-[26px] font-semibold tracking-tightish text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-white/55">{description}</p>
        )}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Logo from "./Logo";

interface Props {
  onOpenMenu: () => void;
}

interface HeaderMeta {
  title: string;
  accent?: string;
  subtitle: string;
}

const META: Record<string, HeaderMeta> = {
  "/": {
    title: "Analyze",
    accent: "Content Intelligence",
    subtitle: "Understand framing, tone, and impact before content reaches its reader.",
  },
  "/compare": {
    title: "Compare",
    accent: "Two pieces of content",
    subtitle: "Run two pieces side by side and see how their framing differs.",
  },
  "/explain": {
    title: "Explain",
    accent: "Plain-language read",
    subtitle: "Get a single short paragraph explaining why content lands the way it does.",
  },
};

export default function Header({ onOpenMenu }: Props) {
  const pathname = usePathname();
  const meta = META[pathname] ?? META["/"];

  return (
    <header
      id="top"
      className="sticky top-0 z-20 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl"
    >
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMenu}
            className="focus-ring lg:hidden grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </svg>
          </button>
          <div className="lg:hidden">
            <Logo withWordmark />
          </div>
          <div className="hidden lg:flex flex-col min-w-0">
            <h1 className="font-display text-[18px] font-semibold tracking-tightish text-white truncate">
              {meta.title}
              {meta.accent && (
                <>
                  {" "}
                  <span className="text-white/35">·</span>{" "}
                  <span className="text-white/65">{meta.accent}</span>
                </>
              )}
            </h1>
            <p className="text-[12px] text-white/55 truncate">
              {meta.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="hidden sm:inline-flex badge"
            title="UI is English-first; Hebrew text inside the editor and results renders RTL automatically."
          >
            <span className="font-mono">EN</span>
            <span className="text-white/30">·</span>
            <span className="text-white/50">RTL ready</span>
          </span>
          <a
            href="/#workspace"
            className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-ink-950 shadow-glow transition hover:scale-[1.02] active:scale-[0.97]"
          >
            New analysis
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import Logo from "./Logo";
import type { ReactNode } from "react";

export interface NavItem {
  key: string;
  label: string;
  /** Hash anchor on home page (e.g., "#workspace"). */
  hash?: string;
  /** Route path (e.g., "/compare"). */
  path?: string;
  icon: ReactNode;
  status?: "live" | "soon";
}

const NAV: NavItem[] = [
  {
    key: "analyze",
    label: "Analyze Content",
    hash: "#workspace",
    path: "/",
    status: "live",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h4l3-9 4 18 3-9h4" />
      </svg>
    ),
  },
  {
    key: "examples",
    label: "Examples",
    hash: "#examples",
    path: "/",
    status: "live",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    key: "compare",
    label: "Compare Mode",
    path: "/compare",
    status: "live",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="7" height="16" rx="1.5" />
        <rect x="14" y="4" width="7" height="16" rx="1.5" />
      </svg>
    ),
  },
  {
    key: "explain",
    label: "Explain Mode",
    path: "/explain",
    status: "live",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2v.3h6V17c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z" />
        <path d="M9 21h6" />
      </svg>
    ),
  },
  {
    key: "saved",
    label: "Saved Analyses",
    status: "soon",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    key: "settings",
    label: "Settings",
    status: "soon",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.57V21a2 2 0 0 1-4 0v-.08A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.57-1.04H3a2 2 0 0 1 0-4h.08A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.04-1.57V3a2 2 0 0 1 4 0v.08A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.13.31.2.65.2 1" />
      </svg>
    ),
  },
];

interface Props {
  activeKey: string;
  onNavigate: (item: NavItem) => void;
  variant: "desktop" | "mobile";
  onClose?: () => void;
}

export default function Sidebar({ activeKey, onNavigate, variant, onClose }: Props) {
  return (
    <aside
      className={
        (variant === "desktop"
          ? "hidden lg:flex fixed inset-y-0 left-0 w-[260px] z-30 "
          : "flex h-full w-full ") +
        "flex-col glass-strong border-r border-white/10"
      }
      aria-label="Primary"
    >
      <div className="flex h-16 items-center justify-between px-5 border-b border-white/5">
        <Logo />
        {variant === "mobile" && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="eyebrow px-3 pb-2">Workspace</p>
        <ul className="space-y-1">
          {NAV.map((item) => {
            const isActive = item.key === activeKey && item.status === "live";
            const isSoon = item.status === "soon";
            const base =
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition w-full text-start";
            const stateClass = isActive
              ? "bg-white/10 text-white shadow-innerline"
              : isSoon
              ? "text-white/45 cursor-not-allowed"
              : "text-white/75 hover:bg-white/5 hover:text-white";

            const inner = (
              <>
                {isActive && (
                  <span className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-gradient-to-b from-violet-400 to-cyan-300" />
                )}
                <span
                  className={
                    "grid h-7 w-7 place-items-center rounded-lg " +
                    (isActive
                      ? "bg-violet-500/20 text-white"
                      : "bg-white/5 text-white/70 group-hover:text-white")
                  }
                >
                  {item.icon}
                </span>
                <span className="flex-1 truncate font-medium">{item.label}</span>
                {isSoon && <span className="badge badge-soon">Soon</span>}
                {isActive && <span className="badge badge-live">Live</span>}
              </>
            );

            if (isSoon) {
              return (
                <li key={item.key}>
                  <div
                    className={base + " " + stateClass}
                    aria-disabled="true"
                    title="Coming soon"
                  >
                    {inner}
                  </div>
                </li>
              );
            }

            // Route-only items (no hash) use Next Link for client navigation.
            if (item.path && !item.hash) {
              return (
                <li key={item.key}>
                  <Link
                    href={item.path}
                    onClick={() => onNavigate(item)}
                    className={"focus-ring " + base + " " + stateClass}
                  >
                    {inner}
                  </Link>
                </li>
              );
            }

            // Hash items (Analyze, Examples) — handled by AppShell.handleNavigate
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => onNavigate(item)}
                  className={"focus-ring " + base + " " + stateClass}
                >
                  {inner}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="my-5 divider" />

        <p className="eyebrow px-3 pb-2">Status</p>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center gap-2">
            <span className="badge badge-live">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
              Live
            </span>
            <span className="text-xs text-white/50">Content Intelligence</span>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-white/55">
            Analyze, Compare, and Explain are live. Saved analyses and
            settings are coming next.
          </p>
        </div>
      </nav>

      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500/40 to-cyan-400/30 text-[11px] font-semibold text-white">
            in
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">
              Intenta · Demo
            </div>
            <div className="truncate text-[11px] text-white/45">
              Smart content intelligence
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export { NAV };

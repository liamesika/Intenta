"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar, { NAV, type NavItem } from "./Sidebar";
import Header from "./Header";
import StatusBar from "./StatusBar";

interface Props {
  children: ReactNode;
}

function keyForPath(pathname: string): string {
  if (pathname === "/compare") return "compare";
  if (pathname === "/explain") return "explain";
  return "analyze";
}

export default function AppShell({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string>(() => keyForPath(pathname));

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Keep active key in sync with the route on every change.
  useEffect(() => {
    setActiveKey(keyForPath(pathname));
  }, [pathname]);

  // Close mobile drawer on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // IntersectionObserver for in-page anchors (only when on the home route).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname !== "/") return;
    const liveItems = NAV.filter(
      (n) => n.status === "live" && n.hash && n.path === "/",
    );
    const targets = liveItems
      .map((n) => {
        const id = n.hash!.replace("#", "");
        const el = document.getElementById(id);
        return el ? { key: n.key, el } : null;
      })
      .filter((x): x is { key: string; el: HTMLElement } => x !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const match = targets.find((t) => t.el === visible.target);
        if (match) setActiveKey(match.key);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    targets.forEach((t) => observer.observe(t.el));
    return () => observer.disconnect();
  }, [pathname]);

  function handleNavigate(item: NavItem) {
    setMobileOpen(false);

    // Pure-route items (Compare, Explain): Next Link in Sidebar handles it.
    // We still update the active key.
    if (item.path && !item.hash) {
      setActiveKey(item.key);
      return;
    }

    // Hash items: scroll within the home page; if currently on a sub-route,
    // navigate home first then scroll after route settles.
    if (item.hash) {
      setActiveKey(item.key);
      const id = item.hash.replace("#", "");
      if (pathname !== "/") {
        router.push("/" + item.hash);
        // After navigation, scroll target may not exist yet; rely on the
        // scroll-margin-top + native hash behavior.
        return;
      }
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.location.hash = item.hash;
    }
  }

  return (
    <div className="relative">
      {/* Desktop sidebar */}
      <Sidebar
        variant="desktop"
        activeKey={activeKey}
        onNavigate={handleNavigate}
      />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative h-full w-[84%] max-w-[320px] animate-fadeUp">
            <Sidebar
              variant="mobile"
              activeKey={activeKey}
              onNavigate={handleNavigate}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-[260px]">
        <Header onOpenMenu={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
          {children}
        </main>
        <StatusBar />
      </div>
    </div>
  );
}

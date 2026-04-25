"use client";

export default function StatusBar() {
  return (
    <div className="mt-16 border-t border-white/5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 py-5 text-[12px] text-white/45">
        <div className="flex items-center gap-2">
          <span className="badge badge-live">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
            All systems operational
          </span>
          <span className="hidden sm:inline">Intenta · Content Intelligence</span>
        </div>
        <p className="text-center sm:text-right">
          Intenta analyzes framing, tone, and likely impact — it does not
          fact-check claims or determine truth. Treat outputs as hedged
          signals, not verdicts.
        </p>
      </div>
    </div>
  );
}

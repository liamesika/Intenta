"use client";

interface Props {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

export default function Logo({ size = 28, withWordmark = true, className }: Props) {
  return (
    <a
      href="#top"
      className={
        "focus-ring inline-flex items-center gap-2.5 rounded-lg " +
        (className ?? "")
      }
      aria-label="Intenta home"
    >
      <span
        className="grid place-items-center rounded-xl shadow-glow"
        style={{
          width: size,
          height: size,
          background:
            "conic-gradient(from 200deg at 50% 50%, #8b5cf6, #6366f1, #22d3ee, #d946ef, #8b5cf6)",
        }}
      >
        <span
          className="grid place-items-center rounded-[10px] bg-ink-950"
          style={{ width: size - 6, height: size - 6 }}
        >
          {/* Lowercase "i" — both the wordmark's first letter and "intent" */}
          <svg
            width={size - 14}
            height={size - 14}
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="12" cy="6.2" r="2.4" />
            <rect x="9.7" y="10.6" width="4.6" height="10.6" rx="1.8" />
          </svg>
        </span>
      </span>
      {withWordmark && (
        <span className="font-display text-[17px] font-semibold tracking-tighter2 text-white">
          Intenta
        </span>
      )}
    </a>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { AnalysisResult } from "@/types/analysis";
import ToneCard from "./cards/ToneCard";
import PerceptionCard from "./cards/PerceptionCard";
import RiskCard from "./cards/RiskCard";
import ScoreCard from "./cards/ScoreCard";
import RewriteCard from "./cards/RewriteCard";
import AlternativesTabs from "./cards/AlternativesTabs";
import FinalAdviceCard from "./cards/FinalAdviceCard";
import IntentImpactCard from "./cards/IntentImpactCard";
import ConfidencePill from "./cards/ConfidencePill";
import HighlightedMessage, { HighlightLegend } from "./HighlightedMessage";
import TopInsight from "./TopInsight";
import { deriveConfidence } from "@/lib/scores";

// NOTE: SimulationCard component file is intentionally kept on disk for future
// reuse, but is no longer imported into the primary content-intelligence dashboard.

interface Props {
  data: AnalysisResult;
  originalMessage: string;
}

const HEBREW_RE = /[֐-׿]/;

function Stagger({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      {children}
    </div>
  );
}

export default function ResultsPanel({ data, originalMessage }: Props) {
  const confidence = data.confidence ?? deriveConfidence(originalMessage);
  const dir =
    data.language === "he" || HEBREW_RE.test(originalMessage) ? "rtl" : "ltr";

  // First-highlight pulse + smooth scroll, both fired once per result.
  const [pulseFirst, setPulseFirst] = useState(true);
  useEffect(() => {
    setPulseFirst(true);
    const pulseTimer = window.setTimeout(() => setPulseFirst(false), 1700);

    // Scroll to first highlight ~700ms after mount, after Workspace's
    // scroll-to-#results has settled. Falls back gracefully if no highlight.
    const scrollTimer = window.setTimeout(() => {
      const el = document.querySelector(
        "[data-first-highlight]",
      ) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 750);

    return () => {
      window.clearTimeout(pulseTimer);
      window.clearTimeout(scrollTimer);
    };
  }, [data]);

  return (
    <div id="results" className="space-y-4 sm:space-y-5">
      {/* Top insight — single derived sentence */}
      <Stagger delay={0}>
        <TopInsight data={data} />
      </Stagger>

      {/* Confidence pill */}
      <Stagger delay={60}>
        <ConfidencePill confidence={confidence} derived={!data.confidence} />
      </Stagger>

      {/* Annotated original */}
      {data.highlights && data.highlights.length > 0 && (
        <Stagger delay={140}>
          <section className="glass rounded-2xl p-5 sm:p-6 shadow-soft">
            <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500/20 text-violet-100">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11h6" />
                    <path d="M9 7h6" />
                    <path d="M9 15h4" />
                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </span>
                <h3 className="font-display text-[15px] font-semibold tracking-tightish text-white">
                  Original content, annotated
                </h3>
              </div>
              <span className="badge font-mono">
                {data.highlights.length} flagged
              </span>
            </header>
            <div className="rounded-xl border border-white/8 bg-ink-900/55 p-4">
              <HighlightedMessage
                message={originalMessage}
                highlights={data.highlights}
                dir={dir}
                pulseFirst={pulseFirst}
              />
            </div>
            <div className="mt-3">
              <HighlightLegend />
            </div>
          </section>
        </Stagger>
      )}

      <Stagger delay={220}>
        <IntentImpactCard
          intent={data.intent}
          impact={data.perceivedByOtherSide}
          language={data.language}
        />
      </Stagger>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <Stagger delay={300}>
          <PerceptionCard perceived={data.perceivedByOtherSide} />
        </Stagger>
        <Stagger delay={360}>
          <ToneCard
            tone={data.overallTone}
            hiddenSubtext={data.hiddenSubtext}
            emotionalLoad={data.emotionalImpact}
          />
        </Stagger>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <Stagger delay={440}>
          <RiskCard risks={data.communicationRisks} />
        </Stagger>
        <Stagger delay={500}>
          <ScoreCard
            clarity={data.clarityScore}
            empathy={data.empathyScore}
            assertiveness={data.assertivenessScore}
          />
        </Stagger>
      </div>

      <Stagger delay={580}>
        <RewriteCard
          rewrite={data.recommendedRewrite}
          original={originalMessage}
          language={data.language}
        />
      </Stagger>

      <Stagger delay={660}>
        <AlternativesTabs
          versions={data.alternativeVersions}
          language={data.language}
        />
      </Stagger>

      <Stagger delay={740}>
        <FinalAdviceCard advice={data.finalAdvice} />
      </Stagger>
    </div>
  );
}

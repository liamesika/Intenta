import type { AnalysisResult } from "@/types/analysis";

export interface AxisRow {
  key: "intensity" | "balance" | "emotional" | "bias";
  label: string;
  a: number;
  b: number;
  /** Higher value side. */
  leader: "a" | "b" | "tie";
  /** 0–100 intensity used for the bar fill. */
  delta: number;
}

function emotionalShare(r: AnalysisResult): number {
  const total = r.highlights?.length ?? 0;
  if (!total) return 0;
  const e = r.highlights!.filter((h) => h.category === "emotional").length;
  return Math.round((e / total) * 100);
}

function biasShare(r: AnalysisResult): number {
  const total = r.highlights?.length ?? 0;
  if (!total) return 0;
  const b = r.highlights!.filter(
    (h) => h.category === "bias" || h.category === "risk",
  ).length;
  return Math.round((b / total) * 100);
}

function row(
  key: AxisRow["key"],
  label: string,
  a: number,
  b: number,
): AxisRow {
  const diff = a - b;
  const leader: AxisRow["leader"] =
    Math.abs(diff) < 5 ? "tie" : diff > 0 ? "a" : "b";
  return { key, label, a, b, leader, delta: Math.min(100, Math.abs(diff)) };
}

export function buildAxisRows(a: AnalysisResult, b: AnalysisResult): AxisRow[] {
  return [
    row("intensity", "Intensity", a.assertivenessScore, b.assertivenessScore),
    // For Balance, lower = less balanced. We invert so the BAR shows "lean":
    // higher means MORE one-sided.
    row("bias", "One-sidedness", 100 - a.empathyScore, 100 - b.empathyScore),
    row("emotional", "Emotional cues", emotionalShare(a), emotionalShare(b)),
  ];
}

export function buildDeltaSentence(
  a: AnalysisResult,
  b: AnalysisResult,
): string {
  const intensity = a.assertivenessScore - b.assertivenessScore;
  const lean = -(a.empathyScore - b.empathyScore); // positive = A is more one-sided
  const emo = emotionalShare(a) - emotionalShare(b);
  const biasCount = (a.communicationRisks?.length ?? 0) - (b.communicationRisks?.length ?? 0);

  const phrasesA: string[] = [];
  if (intensity >= 10) phrasesA.push("more emotionally intense");
  if (lean >= 10) phrasesA.push("more one-sided in framing");
  if (emo >= 15) phrasesA.push("carrying more emotional cues");
  if (biasCount >= 2) phrasesA.push("flagged for more bias signals");

  const phrasesB: string[] = [];
  if (intensity <= -10) phrasesB.push("more emotionally intense");
  if (lean <= -10) phrasesB.push("more one-sided in framing");
  if (emo <= -15) phrasesB.push("carrying more emotional cues");
  if (biasCount <= -2) phrasesB.push("flagged for more bias signals");

  // Cap phrases for a snappier sentence.
  const trimA = phrasesA.slice(0, 2);
  const trimB = phrasesB.slice(0, 2);

  if (trimA.length > trimB.length && trimA.length > 0) {
    return `Article A appears ${joinList(trimA)} compared to Article B.`;
  }
  if (trimB.length > 0) {
    return `Article B appears ${joinList(trimB)} compared to Article A.`;
  }
  return "Articles A and B are framed similarly across the measured axes.";
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return items.join(" and ");
  return items.slice(0, -1).join(", ") + ", and " + items[items.length - 1];
}

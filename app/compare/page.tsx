import type { Metadata } from "next";
import CompareView from "@/components/CompareView";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "Run two pieces of content side by side. Intenta surfaces where their framing, tone, and bias differ.",
};

export default function ComparePage() {
  return <CompareView />;
}

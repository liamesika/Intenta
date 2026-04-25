import type { Metadata } from "next";
import ExplainView from "@/components/ExplainView";

export const metadata: Metadata = {
  title: "Explain",
  description:
    "Get a single short paragraph explaining why a piece of content lands the way it does.",
};

export default function ExplainPage() {
  return <ExplainView />;
}

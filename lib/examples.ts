import type { ContextType, GoalType } from "@/types/analysis";

export type ExampleTag = "news" | "social" | "opinion";

export interface DemoExample {
  id: string;
  title: { he: string; en: string };
  blurb: { he: string; en: string };
  message: string;
  context: ContextType;
  goal: GoalType;
  tag: ExampleTag;
}

export const DEMO_EXAMPLES: DemoExample[] = [
  {
    id: "news-style",
    title: {
      he: "כתבה חדשותית",
      en: "News-style report",
    },
    blurb: {
      he: "טקסט בסגנון כתבה — בדוק עד כמה המסגור באמת ניטרלי.",
      en: "A news-style paragraph — check how neutral the framing actually is.",
    },
    message:
      "Officials slammed the proposed policy on Tuesday, warning that it could devastate small businesses across the region. Critics say the plan ignores the real concerns of working families and rewards big corporations at the expense of ordinary people.",
    context: "news",
    goal: "neutralize",
    tag: "news",
  },
  {
    id: "social-post",
    title: {
      he: "פוסט ברשת חברתית",
      en: "Social-media post",
    },
    blurb: {
      he: "פוסט קצר וטעון — איזה קריאות רגשיות מבליחות?",
      en: "A short charged post — which emotional cues does it carry?",
    },
    message:
      "Unbelievable. Just unbelievable. They literally don't care about us. Wake up — this is exactly what's wrong with everything right now. RT if you agree.",
    context: "social",
    goal: "lower_emotion",
    tag: "social",
  },
  {
    id: "opinion-piece",
    title: {
      he: "טור דעה",
      en: "Opinion piece",
    },
    blurb: {
      he: "פסקה ממאמר דעה — באיזה מידה היא מנוסחת באופן מאוזן?",
      en: "A paragraph from an op-ed — how balanced is the framing?",
    },
    message:
      "It is increasingly obvious that the current approach has failed. Anyone paying attention can see that the data, when honestly examined, points in only one direction. We owe it to the next generation to stop pretending otherwise and finally do the right thing.",
    context: "opinion",
    goal: "balance",
    tag: "opinion",
  },
];

import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/shell/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Intenta — Smart Content Intelligence",
    template: "%s · Intenta",
  },
  description:
    "Analyze how content is framed, written, and how it may impact the reader. Intenta reveals framing, tone, and bias signals — and writes a neutral version. No fact-checking, no motive-reading.",
  applicationName: "Intenta",
  authors: [{ name: "Intenta" }],
  keywords: [
    "Intenta",
    "content intelligence",
    "framing",
    "bias signals",
    "tone analysis",
    "neutral rewrite",
    "AI",
  ],
  openGraph: {
    title: "Intenta — Smart Content Intelligence",
    description:
      "Analyze framing, tone, and impact. Get a neutral rewrite.",
    siteName: "Intenta",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05050c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${display.variable} ${mono.variable}`}
    >
      <body className="app-bg app-grid font-sans antialiased min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

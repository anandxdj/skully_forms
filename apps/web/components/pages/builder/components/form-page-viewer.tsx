"use client";

import React from "react";
import { Theme } from "@repo/trpc/server/schemas/form-schemas";
import { cn } from "~/lib/utils";

/**
 * Local per-theme CSS variable map. Mirrors `theme-wrapper.tsx` so the builder
 * preview can paint just its own viewport — without leaking theme colors into
 * the surrounding builder chrome (toolbars, sidebars).
 */
const THEME_VARIABLES: Record<Theme, Record<string, string>> = {
  slate: {
    "--background": "oklch(0.15 0.01 250)",
    "--foreground": "oklch(0.95 0.01 250)",
    "--card": "oklch(0.18 0.01 250)",
    "--card-foreground": "oklch(0.95 0.01 250)",
    "--primary": "oklch(0.7 0.02 250)",
    "--primary-foreground": "oklch(0.15 0.01 250)",
    "--muted": "oklch(0.22 0.01 250)",
    "--muted-foreground": "oklch(0.65 0.01 250)",
    "--border": "oklch(1 0 0 / 10%)",
    "--ring": "oklch(0.7 0.02 250)",
  },
  cyberpunk: {
    "--background": "oklch(0.08 0 0)",
    "--foreground": "oklch(0.98 0.02 180)",
    "--card": "oklch(0.11 0.01 320)",
    "--card-foreground": "oklch(0.98 0.02 180)",
    "--primary": "oklch(0.63 0.28 340)",
    "--primary-foreground": "oklch(1 0 0)",
    "--muted": "oklch(0.15 0.01 320)",
    "--muted-foreground": "oklch(0.7 0.02 180 / 60%)",
    "--border": "oklch(0.63 0.28 340 / 30%)",
    "--ring": "oklch(0.63 0.28 340)",
  },
  sunset: {
    "--background": "oklch(0.2 0.04 30)",
    "--foreground": "oklch(0.97 0.02 60)",
    "--card": "oklch(0.24 0.04 30)",
    "--card-foreground": "oklch(0.97 0.02 60)",
    "--primary": "oklch(0.72 0.18 40)",
    "--primary-foreground": "oklch(1 0 0)",
    "--muted": "oklch(0.28 0.04 30)",
    "--muted-foreground": "oklch(0.78 0.04 50)",
    "--border": "oklch(0.72 0.18 40 / 30%)",
    "--ring": "oklch(0.72 0.18 40)",
  },
  forest: {
    "--background": "oklch(0.18 0.04 160)",
    "--foreground": "oklch(0.96 0.02 140)",
    "--card": "oklch(0.22 0.04 160)",
    "--card-foreground": "oklch(0.96 0.02 140)",
    "--primary": "oklch(0.62 0.15 160)",
    "--primary-foreground": "oklch(1 0 0)",
    "--muted": "oklch(0.26 0.04 160)",
    "--muted-foreground": "oklch(0.78 0.04 140)",
    "--border": "oklch(0.62 0.15 160 / 30%)",
    "--ring": "oklch(0.62 0.15 160)",
  },
  skullyLight: {
    "--background": "oklch(0.98 0.005 70)",
    "--foreground": "oklch(0.18 0.005 70)",
    "--card": "oklch(0.99 0.003 70)",
    "--card-foreground": "oklch(0.18 0.005 70)",
    "--primary": "oklch(0.72 0.11 12)",
    "--primary-foreground": "oklch(1 0 0)",
    "--muted": "oklch(0.96 0.008 70)",
    "--muted-foreground": "oklch(0.55 0.005 70)",
    "--border": "oklch(0.92 0.006 70)",
    "--ring": "oklch(0.72 0.11 12)",
  },
  skullyDark: {
    "--background": "oklch(0 0 0)",
    "--foreground": "oklch(0.98 0.005 70)",
    "--card": "oklch(0.12 0.008 358)",
    "--card-foreground": "oklch(0.98 0.005 70)",
    "--primary": "oklch(0.55 0.22 25)",
    "--primary-foreground": "oklch(1 0 0)",
    "--muted": "oklch(0.15 0.01 358)",
    "--muted-foreground": "oklch(0.65 0.005 70)",
    "--border": "oklch(0.55 0.22 25 / 20%)",
    "--ring": "oklch(0.55 0.22 25)",
  },
};

interface FormPageViewerProps {
  theme: Theme;
  deviceMode: "desktop" | "mobile";
  children: React.ReactNode;
}

/**
 * Themed viewport that mimics how the final form will look to a respondent.
 * Only this element receives the theme tokens, so the builder chrome stays
 * neutral.
 */
export default function FormPageViewer({
  theme,
  deviceMode,
  children,
}: FormPageViewerProps) {
  const vars = THEME_VARIABLES[theme] || THEME_VARIABLES.skullyLight;

  return (
    <div
      style={vars as React.CSSProperties}
      className={cn(
        "relative w-full bg-background text-foreground transition-all duration-300 ease-out overflow-hidden rounded-2xl border border-border/40 shadow-sm",
        deviceMode === "desktop"
          ? "max-w-4xl aspect-[16/10]"
          : "max-w-[390px] aspect-[9/16]"
      )}
    >
      {/* Subtle background mesh — keeps the viewer feeling like a real preview */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[40%] aspect-square rounded-full bg-primary/10 blur-[80px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] aspect-square rounded-full bg-primary/10 blur-[80px]" />
      </div>

      {/* Inner scroll viewport */}
      <div className="relative z-10 w-full h-full overflow-auto flex items-center justify-center px-6 py-10">
        {children}
      </div>
    </div>
  );
}

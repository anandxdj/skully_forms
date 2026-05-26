"use client";

import React from "react";
import { Theme } from "@repo/trpc/server/schemas/form-schemas";

interface ThemeWrapperProps {
  theme: Theme;
  children: React.ReactNode;
}

const THEME_VARIABLES: Record<Theme, Record<string, string>> = {
  slate: {
    "--background": "oklch(0.15 0.01 250)",
    "--foreground": "oklch(0.95 0.01 250)",
    "--card": "oklch(0.18 0.01 250)",
    "--card-foreground": "oklch(0.95 0.01 250)",
    "--popover": "oklch(0.18 0.01 250)",
    "--popover-foreground": "oklch(0.95 0.01 250)",
    "--primary": "oklch(0.7 0.02 250)",
    "--primary-foreground": "oklch(0.15 0.01 250)",
    "--secondary": "oklch(0.22 0.01 250)",
    "--secondary-foreground": "oklch(0.95 0.01 250)",
    "--muted": "oklch(0.22 0.01 250)",
    "--muted-foreground": "oklch(0.65 0.01 250)",
    "--accent": "oklch(0.22 0.01 250)",
    "--accent-foreground": "oklch(0.95 0.01 250)",
    "--border": "oklch(1 0 0 / 10%)",
    "--input": "oklch(1 0 0 / 15%)",
    "--ring": "oklch(0.7 0.02 250)",
  },
  cyberpunk: {
    "--background": "oklch(0.08 0 0)",
    "--foreground": "oklch(0.98 0.02 180)",
    "--card": "oklch(0.11 0.01 320)",
    "--card-foreground": "oklch(0.98 0.02 180)",
    "--popover": "oklch(0.11 0.01 320)",
    "--popover-foreground": "oklch(0.98 0.02 180)",
    "--primary": "oklch(0.63 0.28 340)", // Hot Pink
    "--primary-foreground": "oklch(1 0 0)",
    "--secondary": "oklch(0.15 0.01 320)",
    "--secondary-foreground": "oklch(0.98 0.02 180)",
    "--muted": "oklch(0.15 0.01 320)",
    "--muted-foreground": "oklch(0.7 0.02 180 / 60%)",
    "--accent": "oklch(0.8 0.2 190)", // Electric Cyan
    "--accent-foreground": "oklch(0.08 0 0)",
    "--border": "oklch(0.63 0.28 340 / 30%)",
    "--input": "oklch(0.63 0.28 340 / 15%)",
    "--ring": "oklch(0.63 0.28 340)",
  },
  sunset: {
    "--background": "oklch(0.12 0.02 340)", // Rich Burgundy
    "--foreground": "oklch(0.98 0.02 40)",
    "--card": "oklch(0.15 0.03 350)",
    "--card-foreground": "oklch(0.98 0.02 40)",
    "--popover": "oklch(0.15 0.03 350)",
    "--popover-foreground": "oklch(0.98 0.02 40)",
    "--primary": "oklch(0.69 0.2 25)", // Warm Amber
    "--primary-foreground": "oklch(1 0 0)",
    "--secondary": "oklch(0.18 0.02 340)",
    "--secondary-foreground": "oklch(0.98 0.02 40)",
    "--muted": "oklch(0.18 0.02 340)",
    "--muted-foreground": "oklch(0.7 0.02 40 / 60%)",
    "--accent": "oklch(0.6 0.15 350)",
    "--accent-foreground": "oklch(1 0 0)",
    "--border": "oklch(0.69 0.2 25 / 30%)",
    "--input": "oklch(0.69 0.2 25 / 15%)",
    "--ring": "oklch(0.69 0.2 25)",
  },
  forest: {
    "--background": "oklch(0.12 0.02 140)", // Moss Green
    "--foreground": "oklch(0.98 0.01 140)",
    "--card": "oklch(0.15 0.02 140)",
    "--card-foreground": "oklch(0.98 0.01 140)",
    "--popover": "oklch(0.15 0.02 140)",
    "--popover-foreground": "oklch(0.98 0.01 140)",
    "--primary": "oklch(0.78 0.15 150)", // Mint
    "--primary-foreground": "oklch(0.12 0.02 140)",
    "--secondary": "oklch(0.17 0.02 140)",
    "--secondary-foreground": "oklch(0.98 0.01 140)",
    "--muted": "oklch(0.17 0.02 140)",
    "--muted-foreground": "oklch(0.7 0.01 140 / 60%)",
    "--accent": "oklch(0.2 0.03 140)",
    "--accent-foreground": "oklch(0.98 0.01 140)",
    "--border": "oklch(0.78 0.15 150 / 30%)",
    "--input": "oklch(0.78 0.15 150 / 15%)",
    "--ring": "oklch(0.78 0.15 150)",
  },
  skullyLight: {
    "--background": "oklch(0.985 0.005 70)", // Warm Peach Cream (#FAF8F5)
    "--foreground": "oklch(0.18 0.005 70)", // Deep Charcoal (#1B1917)
    "--card": "oklch(0.99 0.003 70)",
    "--card-foreground": "oklch(0.18 0.005 70)",
    "--popover": "oklch(0.99 0.003 70)",
    "--popover-foreground": "oklch(0.18 0.005 70)",
    "--primary": "oklch(0.72 0.11 12)", // Soft Coral-Pink (#ED9194)
    "--primary-foreground": "oklch(1 0 0)", // White text
    "--secondary": "oklch(0.96 0.008 70)",
    "--secondary-foreground": "oklch(0.18 0.005 70)",
    "--muted": "oklch(0.96 0.008 70)",
    "--muted-foreground": "oklch(0.55 0.005 70)",
    "--accent": "oklch(0.96 0.008 70)",
    "--accent-foreground": "oklch(0.18 0.005 70)",
    "--border": "oklch(0.92 0.006 70)", // Soft Border #E2DFD8
    "--input": "oklch(0.92 0.006 70)",
    "--ring": "oklch(0.72 0.11 12)",
  },
  skullyDark: {
    "--background": "oklch(0 0 0)", // Pure Black
    "--foreground": "oklch(0.98 0.005 70)", // Ivory Text
    "--card": "oklch(0.12 0.008 358)", // Deep red-gray card
    "--card-foreground": "oklch(0.98 0.005 70)",
    "--popover": "oklch(0.12 0.008 358)",
    "--popover-foreground": "oklch(0.98 0.005 70)",
    "--primary": "oklch(0.55 0.22 25)", // Crimson Red (#E21D48)
    "--primary-foreground": "oklch(1 0 0)", // White Text
    "--secondary": "oklch(0.15 0.01 358)",
    "--secondary-foreground": "oklch(0.98 0.005 70)",
    "--muted": "oklch(0.15 0.01 358)",
    "--muted-foreground": "oklch(0.65 0.005 70)",
    "--accent": "oklch(0.15 0.01 358)",
    "--accent-foreground": "oklch(0.98 0.005 70)",
    "--border": "oklch(0.55 0.22 25 / 20%)", // Crimson-tinted border
    "--input": "oklch(0.55 0.22 25 / 15%)",
    "--ring": "oklch(0.55 0.22 25)",
  },
};

export default function ThemeWrapper({ theme, children }: ThemeWrapperProps) {
  const inlineStyles = THEME_VARIABLES[theme] || THEME_VARIABLES.slate;

  return (
    <div
      style={inlineStyles as React.CSSProperties}
      className="min-h-screen bg-background text-foreground transition-colors duration-300 relative w-full flex flex-col items-center selection:bg-primary/20 selection:text-foreground"
    >
      {/* Background visual meshes for all themes */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[10%] left-[-15%] w-[580px] h-[580px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-15%] w-[580px] h-[580px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}

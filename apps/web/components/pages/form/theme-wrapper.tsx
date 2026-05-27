"use client";

import React from "react";
import { Theme } from "@repo/trpc/server/schemas/form-schemas";
import { THEME_ILLUSTRATIONS } from "~/components/pages/builder/components/theme-variables";

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
  skullyNeon: {
    "--background": "oklch(0.06 0.01 260)",
    "--foreground": "oklch(0.95 0.05 140)",
    "--card": "oklch(0.09 0.02 260)",
    "--card-foreground": "oklch(0.95 0.05 140)",
    "--popover": "oklch(0.09 0.02 260)",
    "--popover-foreground": "oklch(0.95 0.05 140)",
    "--primary": "oklch(0.85 0.22 140)",
    "--primary-foreground": "oklch(0.06 0.01 260)",
    "--secondary": "oklch(0.12 0.02 260)",
    "--secondary-foreground": "oklch(0.95 0.05 140)",
    "--muted": "oklch(0.12 0.02 260)",
    "--muted-foreground": "oklch(0.65 0.05 140 / 70%)",
    "--accent": "oklch(0.7 0.2 200)",
    "--accent-foreground": "oklch(0.06 0.01 260)",
    "--border": "oklch(0.85 0.22 140 / 20%)",
    "--input": "oklch(0.85 0.22 140 / 10%)",
    "--ring": "oklch(0.85 0.22 140)",
  },
  skullyGold: {
    "--background": "oklch(0.1 0.03 60)",
    "--foreground": "oklch(0.97 0.02 80)",
    "--card": "oklch(0.13 0.04 60)",
    "--card-foreground": "oklch(0.97 0.02 80)",
    "--popover": "oklch(0.13 0.04 60)",
    "--popover-foreground": "oklch(0.97 0.02 80)",
    "--primary": "oklch(0.78 0.16 85)",
    "--primary-foreground": "oklch(0.1 0.03 60)",
    "--secondary": "oklch(0.16 0.04 60)",
    "--secondary-foreground": "oklch(0.97 0.02 80)",
    "--muted": "oklch(0.16 0.04 60)",
    "--muted-foreground": "oklch(0.65 0.04 80 / 60%)",
    "--accent": "oklch(0.62 0.12 40)",
    "--accent-foreground": "oklch(1 0 0)",
    "--border": "oklch(0.78 0.16 85 / 25%)",
    "--input": "oklch(0.78 0.16 85 / 12%)",
    "--ring": "oklch(0.78 0.16 85)",
  },
  skullyGreen: {
    "--background": "oklch(0.1 0.03 150)",
    "--foreground": "oklch(0.97 0.02 150)",
    "--card": "oklch(0.13 0.03 150)",
    "--card-foreground": "oklch(0.97 0.02 150)",
    "--popover": "oklch(0.13 0.03 150)",
    "--popover-foreground": "oklch(0.97 0.02 150)",
    "--primary": "oklch(0.72 0.18 148)",
    "--primary-foreground": "oklch(0.1 0.03 150)",
    "--secondary": "oklch(0.16 0.03 150)",
    "--secondary-foreground": "oklch(0.97 0.02 150)",
    "--muted": "oklch(0.16 0.03 150)",
    "--muted-foreground": "oklch(0.65 0.02 150 / 60%)",
    "--accent": "oklch(0.6 0.15 110)",
    "--accent-foreground": "oklch(0.1 0.03 150)",
    "--border": "oklch(0.72 0.18 148 / 25%)",
    "--input": "oklch(0.72 0.18 148 / 12%)",
    "--ring": "oklch(0.72 0.18 148)",
  },
  skullyParty: {
    "--background": "oklch(0.97 0.008 330)",
    "--foreground": "oklch(0.2 0.01 330)",
    "--card": "oklch(0.99 0.004 330)",
    "--card-foreground": "oklch(0.2 0.01 330)",
    "--popover": "oklch(0.99 0.004 330)",
    "--popover-foreground": "oklch(0.2 0.01 330)",
    "--primary": "oklch(0.62 0.25 333)",
    "--primary-foreground": "oklch(1 0 0)",
    "--secondary": "oklch(0.94 0.012 330)",
    "--secondary-foreground": "oklch(0.2 0.01 330)",
    "--muted": "oklch(0.94 0.012 330)",
    "--muted-foreground": "oklch(0.55 0.01 330)",
    "--accent": "oklch(0.85 0.15 300)",
    "--accent-foreground": "oklch(0.2 0.01 330)",
    "--border": "oklch(0.9 0.015 330)",
    "--input": "oklch(0.9 0.015 330)",
    "--ring": "oklch(0.62 0.25 333)",
  },
  skullySpace: {
    "--background": "oklch(0.06 0.04 260)",
    "--foreground": "oklch(0.97 0.04 215)",
    "--card": "oklch(0.09 0.05 260)",
    "--card-foreground": "oklch(0.97 0.04 215)",
    "--popover": "oklch(0.09 0.05 260)",
    "--popover-foreground": "oklch(0.97 0.04 215)",
    "--primary": "oklch(0.72 0.22 215)",
    "--primary-foreground": "oklch(0.06 0.04 260)",
    "--secondary": "oklch(0.13 0.05 260)",
    "--secondary-foreground": "oklch(0.97 0.04 215)",
    "--muted": "oklch(0.13 0.05 260)",
    "--muted-foreground": "oklch(0.65 0.04 215 / 70%)",
    "--accent": "oklch(0.75 0.18 250)",
    "--accent-foreground": "oklch(0.06 0.04 260)",
    "--border": "oklch(0.72 0.22 215 / 20%)",
    "--input": "oklch(0.72 0.22 215 / 10%)",
    "--ring": "oklch(0.72 0.22 215)",
  },
  skullyWitch: {
    "--background": "oklch(0.08 0.03 285)",
    "--foreground": "oklch(0.97 0.02 80)",
    "--card": "oklch(0.11 0.04 285)",
    "--card-foreground": "oklch(0.97 0.02 80)",
    "--popover": "oklch(0.11 0.04 285)",
    "--popover-foreground": "oklch(0.97 0.02 80)",
    "--primary": "oklch(0.65 0.15 285)",
    "--primary-foreground": "oklch(0.97 0.02 80)",
    "--secondary": "oklch(0.14 0.04 285)",
    "--secondary-foreground": "oklch(0.97 0.02 80)",
    "--muted": "oklch(0.14 0.04 285)",
    "--muted-foreground": "oklch(0.65 0.03 80 / 60%)",
    "--accent": "oklch(0.5 0.12 300)",
    "--accent-foreground": "oklch(0.97 0.02 80)",
    "--border": "oklch(0.65 0.15 285 / 25%)",
    "--input": "oklch(0.65 0.15 285 / 12%)",
    "--ring": "oklch(0.65 0.15 285)",
  },
  skullyAutumn: {
    "--background": "oklch(0.18 0.05 45)",
    "--foreground": "oklch(0.97 0.02 70)",
    "--card": "oklch(0.22 0.05 45)",
    "--card-foreground": "oklch(0.97 0.02 70)",
    "--popover": "oklch(0.22 0.05 45)",
    "--popover-foreground": "oklch(0.97 0.02 70)",
    "--primary": "oklch(0.72 0.22 50)",
    "--primary-foreground": "oklch(1 0 0)",
    "--secondary": "oklch(0.26 0.05 45)",
    "--secondary-foreground": "oklch(0.97 0.02 70)",
    "--muted": "oklch(0.26 0.05 45)",
    "--muted-foreground": "oklch(0.72 0.04 60 / 70%)",
    "--accent": "oklch(0.62 0.15 30)",
    "--accent-foreground": "oklch(1 0 0)",
    "--border": "oklch(0.72 0.22 50 / 30%)",
    "--input": "oklch(0.72 0.22 50 / 15%)",
    "--ring": "oklch(0.72 0.22 50)",
  },
  skullyOcean: {
    "--background": "oklch(0.12 0.04 220)",
    "--foreground": "oklch(0.97 0.03 210)",
    "--card": "oklch(0.16 0.04 220)",
    "--card-foreground": "oklch(0.97 0.03 210)",
    "--popover": "oklch(0.16 0.04 220)",
    "--popover-foreground": "oklch(0.97 0.03 210)",
    "--primary": "oklch(0.7 0.2 205)",
    "--primary-foreground": "oklch(1 0 0)",
    "--secondary": "oklch(0.2 0.04 220)",
    "--secondary-foreground": "oklch(0.97 0.03 210)",
    "--muted": "oklch(0.2 0.04 220)",
    "--muted-foreground": "oklch(0.72 0.04 210 / 60%)",
    "--accent": "oklch(0.6 0.15 195)",
    "--accent-foreground": "oklch(1 0 0)",
    "--border": "oklch(0.7 0.2 205 / 25%)",
    "--input": "oklch(0.7 0.2 205 / 12%)",
    "--ring": "oklch(0.7 0.2 205)",
  },
  skullyPunk: {
    "--background": "oklch(0.05 0 0)",
    "--foreground": "oklch(0.96 0.02 350)",
    "--card": "oklch(0.08 0.01 350)",
    "--card-foreground": "oklch(0.96 0.02 350)",
    "--popover": "oklch(0.08 0.01 350)",
    "--popover-foreground": "oklch(0.96 0.02 350)",
    "--primary": "oklch(0.68 0.28 350)",
    "--primary-foreground": "oklch(1 0 0)",
    "--secondary": "oklch(0.12 0.02 350)",
    "--secondary-foreground": "oklch(0.96 0.02 350)",
    "--muted": "oklch(0.12 0.02 350)",
    "--muted-foreground": "oklch(0.65 0.03 350 / 60%)",
    "--accent": "oklch(0.75 0.22 280)",
    "--accent-foreground": "oklch(0.05 0 0)",
    "--border": "oklch(0.68 0.28 350 / 25%)",
    "--input": "oklch(0.68 0.28 350 / 12%)",
    "--ring": "oklch(0.68 0.28 350)",
  },
  skullyZen: {
    "--background": "oklch(0.97 0.01 120)",
    "--foreground": "oklch(0.2 0.02 90)",
    "--card": "oklch(0.99 0.005 120)",
    "--card-foreground": "oklch(0.2 0.02 90)",
    "--popover": "oklch(0.99 0.005 120)",
    "--popover-foreground": "oklch(0.2 0.02 90)",
    "--primary": "oklch(0.58 0.12 150)",
    "--primary-foreground": "oklch(1 0 0)",
    "--secondary": "oklch(0.94 0.015 120)",
    "--secondary-foreground": "oklch(0.2 0.02 90)",
    "--muted": "oklch(0.94 0.015 120)",
    "--muted-foreground": "oklch(0.55 0.01 90)",
    "--accent": "oklch(0.94 0.015 120)",
    "--accent-foreground": "oklch(0.2 0.02 90)",
    "--border": "oklch(0.88 0.02 120)",
    "--input": "oklch(0.88 0.02 120)",
    "--ring": "oklch(0.58 0.12 150)",
  },
  skullyRoyal: {
    "--background": "oklch(0.1 0.04 290)",
    "--foreground": "oklch(0.97 0.03 80)",
    "--card": "oklch(0.14 0.05 290)",
    "--card-foreground": "oklch(0.97 0.03 80)",
    "--popover": "oklch(0.14 0.05 290)",
    "--popover-foreground": "oklch(0.97 0.03 80)",
    "--primary": "oklch(0.78 0.16 85)",
    "--primary-foreground": "oklch(0.1 0.04 290)",
    "--secondary": "oklch(0.18 0.05 290)",
    "--secondary-foreground": "oklch(0.97 0.03 80)",
    "--muted": "oklch(0.18 0.05 290)",
    "--muted-foreground": "oklch(0.65 0.04 80 / 60%)",
    "--accent": "oklch(0.6 0.12 290)",
    "--accent-foreground": "oklch(0.97 0.03 80)",
    "--border": "oklch(0.78 0.16 85 / 25%)",
    "--input": "oklch(0.78 0.16 85 / 12%)",
    "--ring": "oklch(0.78 0.16 85)",
  },
  skullyDream: {
    "--background": "oklch(0.97 0.01 340)",
    "--foreground": "oklch(0.18 0.01 320)",
    "--card": "oklch(0.99 0.005 340)",
    "--card-foreground": "oklch(0.18 0.01 320)",
    "--popover": "oklch(0.99 0.005 340)",
    "--popover-foreground": "oklch(0.18 0.01 320)",
    "--primary": "oklch(0.7 0.12 340)",
    "--primary-foreground": "oklch(1 0 0)",
    "--secondary": "oklch(0.94 0.015 340)",
    "--secondary-foreground": "oklch(0.18 0.01 320)",
    "--muted": "oklch(0.94 0.015 340)",
    "--muted-foreground": "oklch(0.55 0.01 320)",
    "--accent": "oklch(0.85 0.12 300)",
    "--accent-foreground": "oklch(0.18 0.01 320)",
    "--border": "oklch(0.9 0.02 340)",
    "--input": "oklch(0.9 0.02 340)",
    "--ring": "oklch(0.7 0.12 340)",
  },
};

export default function ThemeWrapper({ theme, children }: ThemeWrapperProps) {
  const inlineStyles = THEME_VARIABLES[theme] || THEME_VARIABLES.slate;
  const illus = THEME_ILLUSTRATIONS[theme];

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

      {/* Theme background illustration */}
      {illus?.background && (
        <div className="absolute inset-0 z-[1] pointer-events-none select-none overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={illus.background} alt="" className="w-full h-full object-cover opacity-[0.15]" />
        </div>
      )}

      {/* Theme skeleton character — fixed to bottom-right of viewport */}
      {illus?.skeleton && (
        <div className="fixed bottom-0 right-0 w-56 h-72 z-[2] pointer-events-none select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={illus.skeleton} alt="" className="w-full h-full object-contain object-bottom drop-shadow-2xl" />
        </div>
      )}

      <div className="relative z-10 w-full flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}

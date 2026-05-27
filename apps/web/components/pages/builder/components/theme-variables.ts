import { Theme } from "@repo/trpc/server/schemas/form-schemas";

/**
 * Per-theme CSS variable map shared between the builder canvas surround and
 * the inner themed viewport (`form-page-viewer.tsx`). Keeping a single source
 * lets the canvas chrome tint with the same primary/background tokens the
 * preview card uses, so the whole workspace feels themed.
 */

export type ThemeIllustration = {
  skeleton?: string;
  background?: string;
};

export const THEME_ILLUSTRATIONS: Partial<Record<Theme, ThemeIllustration>> = {
  // Original themes — updated to fun_skeleton art style
  skullyLight:  { skeleton: "/assets/fun_skeleton/frame_013%202.png", background: "/assets/background/pink%20background.png" },
  skullyDark:   { skeleton: "/assets/fun_skeleton/frame_023%202.png", background: "/assets/background/dark%20background.png" },
  skullyNeon:   { skeleton: "/assets/fun_skeleton/frame_033%202.png", background: "/assets/background/Dark%20Background%202.png" },
  skullyGold:   { skeleton: "/assets/fun_skeleton/frame_034%202.png", background: "/assets/background/Golden%20Leaf.png" },
  skullyGreen:  { skeleton: "/assets/fun_skeleton/frame_017%202.png", background: "/assets/background/Leaf%20Background.png" },
  skullyParty:  { skeleton: "/assets/fun_skeleton/frame_041%202.png", background: "/assets/background/pink%20stage.png" },
  slate:        { skeleton: "/assets/fun_skeleton/frame_037%202.png" },
  cyberpunk:    { skeleton: "/assets/fun_skeleton/frame_021%202.png" },
  sunset:       { skeleton: "/assets/fun_skeleton/frame_018%202.png" },
  forest:       { skeleton: "/assets/fun_skeleton/frame_017%202.png", background: "/assets/background/Leaf%20Background.png" },
  // New themes
  skullySpace:  { skeleton: "/assets/fun_skeleton/frame_024%202.png" },
  skullyWitch:  { skeleton: "/assets/fun_skeleton/frame_006%202.png" },
  skullyAutumn: { skeleton: "/assets/fun_skeleton/frame_044%202.png" },
  skullyOcean:  { skeleton: "/assets/fun_skeleton/frame_036%202.png" },
  skullyPunk:   { skeleton: "/assets/fun_skeleton/frame_031%202.png" },
  skullyZen:    { skeleton: "/assets/fun_skeleton/frame_032%202.png" },
  skullyRoyal:  { skeleton: "/assets/fun_skeleton/frame_004%202.png" },
  skullyDream:  { skeleton: "/assets/fun_skeleton/frame_043%202.png" },
};

export const FIELD_TYPE_SKELETONS: Record<string, string> = {
  TEXT:     "/assets/fun_skeleton/frame_039%202.png", // writing with pencil
  EMAIL:    "/assets/fun_skeleton/frame_001%202.png", // bouquet of flowers (sending)
  TEXTAREA: "/assets/fun_skeleton/frame_006%202.png", // reading with black cat + coffee
  NUMBER:   "/assets/fun_skeleton/frame_046%202.png", // scientist with lab flasks
  DATE:     "/assets/fun_skeleton/frame_045%202.png", // birthday cake
  SELECT:   "/assets/fun_skeleton/frame_029%202.png", // lightbulb idea
  RADIO:    "/assets/fun_skeleton/frame_012%202.png", // detective magnifying glass
  CHECKBOX: "/assets/fun_skeleton/frame_028%202.png", // skeleton in shopping cart
  RATING:   "/assets/fun_skeleton/frame_031%202.png", // punk rock guitarist
  FILE:     "/assets/fun_skeleton/frame_022%202.png", // photographer with DSLR
};

export const THEME_VARIABLES: Record<Theme, Record<string, string>> = {
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
  skullyNeon: {
    "--background": "oklch(0.06 0.01 260)",
    "--foreground": "oklch(0.95 0.05 140)",
    "--card": "oklch(0.09 0.02 260)",
    "--card-foreground": "oklch(0.95 0.05 140)",
    "--primary": "oklch(0.85 0.22 140)",
    "--primary-foreground": "oklch(0.06 0.01 260)",
    "--muted": "oklch(0.12 0.02 260)",
    "--muted-foreground": "oklch(0.65 0.05 140 / 70%)",
    "--border": "oklch(0.85 0.22 140 / 20%)",
    "--ring": "oklch(0.85 0.22 140)",
  },
  skullyGold: {
    "--background": "oklch(0.1 0.03 60)",
    "--foreground": "oklch(0.97 0.02 80)",
    "--card": "oklch(0.13 0.04 60)",
    "--card-foreground": "oklch(0.97 0.02 80)",
    "--primary": "oklch(0.78 0.16 85)",
    "--primary-foreground": "oklch(0.1 0.03 60)",
    "--muted": "oklch(0.16 0.04 60)",
    "--muted-foreground": "oklch(0.65 0.04 80 / 60%)",
    "--border": "oklch(0.78 0.16 85 / 25%)",
    "--ring": "oklch(0.78 0.16 85)",
  },
  skullyGreen: {
    "--background": "oklch(0.1 0.03 150)",
    "--foreground": "oklch(0.97 0.02 150)",
    "--card": "oklch(0.13 0.03 150)",
    "--card-foreground": "oklch(0.97 0.02 150)",
    "--primary": "oklch(0.72 0.18 148)",
    "--primary-foreground": "oklch(0.1 0.03 150)",
    "--muted": "oklch(0.16 0.03 150)",
    "--muted-foreground": "oklch(0.65 0.02 150 / 60%)",
    "--border": "oklch(0.72 0.18 148 / 25%)",
    "--ring": "oklch(0.72 0.18 148)",
  },
  skullyParty: {
    "--background": "oklch(0.97 0.008 330)",
    "--foreground": "oklch(0.2 0.01 330)",
    "--card": "oklch(0.99 0.004 330)",
    "--card-foreground": "oklch(0.2 0.01 330)",
    "--primary": "oklch(0.62 0.25 333)",
    "--primary-foreground": "oklch(1 0 0)",
    "--muted": "oklch(0.94 0.012 330)",
    "--muted-foreground": "oklch(0.55 0.01 330)",
    "--border": "oklch(0.9 0.015 330)",
    "--ring": "oklch(0.62 0.25 333)",
  },
  skullySpace: {
    "--background": "oklch(0.06 0.04 260)",
    "--foreground": "oklch(0.97 0.04 215)",
    "--card": "oklch(0.09 0.05 260)",
    "--card-foreground": "oklch(0.97 0.04 215)",
    "--primary": "oklch(0.72 0.22 215)",
    "--primary-foreground": "oklch(0.06 0.04 260)",
    "--muted": "oklch(0.13 0.05 260)",
    "--muted-foreground": "oklch(0.65 0.04 215 / 70%)",
    "--border": "oklch(0.72 0.22 215 / 20%)",
    "--ring": "oklch(0.72 0.22 215)",
  },
  skullyWitch: {
    "--background": "oklch(0.08 0.03 285)",
    "--foreground": "oklch(0.97 0.02 80)",
    "--card": "oklch(0.11 0.04 285)",
    "--card-foreground": "oklch(0.97 0.02 80)",
    "--primary": "oklch(0.65 0.15 285)",
    "--primary-foreground": "oklch(0.97 0.02 80)",
    "--muted": "oklch(0.14 0.04 285)",
    "--muted-foreground": "oklch(0.65 0.03 80 / 60%)",
    "--border": "oklch(0.65 0.15 285 / 25%)",
    "--ring": "oklch(0.65 0.15 285)",
  },
  skullyAutumn: {
    "--background": "oklch(0.18 0.05 45)",
    "--foreground": "oklch(0.97 0.02 70)",
    "--card": "oklch(0.22 0.05 45)",
    "--card-foreground": "oklch(0.97 0.02 70)",
    "--primary": "oklch(0.72 0.22 50)",
    "--primary-foreground": "oklch(1 0 0)",
    "--muted": "oklch(0.26 0.05 45)",
    "--muted-foreground": "oklch(0.72 0.04 60 / 70%)",
    "--border": "oklch(0.72 0.22 50 / 30%)",
    "--ring": "oklch(0.72 0.22 50)",
  },
  skullyOcean: {
    "--background": "oklch(0.12 0.04 220)",
    "--foreground": "oklch(0.97 0.03 210)",
    "--card": "oklch(0.16 0.04 220)",
    "--card-foreground": "oklch(0.97 0.03 210)",
    "--primary": "oklch(0.7 0.2 205)",
    "--primary-foreground": "oklch(1 0 0)",
    "--muted": "oklch(0.2 0.04 220)",
    "--muted-foreground": "oklch(0.72 0.04 210 / 60%)",
    "--border": "oklch(0.7 0.2 205 / 25%)",
    "--ring": "oklch(0.7 0.2 205)",
  },
  skullyPunk: {
    "--background": "oklch(0.05 0 0)",
    "--foreground": "oklch(0.96 0.02 350)",
    "--card": "oklch(0.08 0.01 350)",
    "--card-foreground": "oklch(0.96 0.02 350)",
    "--primary": "oklch(0.68 0.28 350)",
    "--primary-foreground": "oklch(1 0 0)",
    "--muted": "oklch(0.12 0.02 350)",
    "--muted-foreground": "oklch(0.65 0.03 350 / 60%)",
    "--border": "oklch(0.68 0.28 350 / 25%)",
    "--ring": "oklch(0.68 0.28 350)",
  },
  skullyZen: {
    "--background": "oklch(0.97 0.01 120)",
    "--foreground": "oklch(0.2 0.02 90)",
    "--card": "oklch(0.99 0.005 120)",
    "--card-foreground": "oklch(0.2 0.02 90)",
    "--primary": "oklch(0.58 0.12 150)",
    "--primary-foreground": "oklch(1 0 0)",
    "--muted": "oklch(0.94 0.015 120)",
    "--muted-foreground": "oklch(0.55 0.01 90)",
    "--border": "oklch(0.88 0.02 120)",
    "--ring": "oklch(0.58 0.12 150)",
  },
  skullyRoyal: {
    "--background": "oklch(0.1 0.04 290)",
    "--foreground": "oklch(0.97 0.03 80)",
    "--card": "oklch(0.14 0.05 290)",
    "--card-foreground": "oklch(0.97 0.03 80)",
    "--primary": "oklch(0.78 0.16 85)",
    "--primary-foreground": "oklch(0.1 0.04 290)",
    "--muted": "oklch(0.18 0.05 290)",
    "--muted-foreground": "oklch(0.65 0.04 80 / 60%)",
    "--border": "oklch(0.78 0.16 85 / 25%)",
    "--ring": "oklch(0.78 0.16 85)",
  },
  skullyDream: {
    "--background": "oklch(0.97 0.01 340)",
    "--foreground": "oklch(0.18 0.01 320)",
    "--card": "oklch(0.99 0.005 340)",
    "--card-foreground": "oklch(0.18 0.01 320)",
    "--primary": "oklch(0.7 0.12 340)",
    "--primary-foreground": "oklch(1 0 0)",
    "--muted": "oklch(0.94 0.015 340)",
    "--muted-foreground": "oklch(0.55 0.01 320)",
    "--border": "oklch(0.9 0.02 340)",
    "--ring": "oklch(0.7 0.12 340)",
  },
};

export function themeVars(theme: Theme): Record<string, string> {
  return THEME_VARIABLES[theme] ?? THEME_VARIABLES.skullyLight;
}

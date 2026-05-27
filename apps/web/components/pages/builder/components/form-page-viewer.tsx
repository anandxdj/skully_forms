"use client";

import React from "react";
import { Theme } from "@repo/trpc/server/schemas/form-schemas";
import { cn } from "~/lib/utils";
import { themeVars, THEME_ILLUSTRATIONS, FIELD_TYPE_SKELETONS } from "./theme-variables";

interface FormPageViewerProps {
  theme: Theme;
  deviceMode: "desktop" | "mobile";
  fieldType?: string;
  children: React.ReactNode;
}

/**
 * Themed viewport that mimics how the final form will look to a respondent.
 * Sized to fill the available canvas height so a single question always fits
 * the viewport — no inner scroll.
 */
export default function FormPageViewer({
  theme,
  deviceMode,
  fieldType,
  children,
}: FormPageViewerProps) {
  const vars = themeVars(theme);
  const illus = THEME_ILLUSTRATIONS[theme];
  // Field-type skeleton takes priority; fall back to theme skeleton
  const skeletonSrc = (fieldType && FIELD_TYPE_SKELETONS[fieldType]) ?? illus?.skeleton;

  return (
    <div
      style={vars as React.CSSProperties}
      className={cn(
        "relative w-full flex-1 min-h-0 bg-background text-foreground transition-all duration-300 ease-out overflow-hidden rounded-3xl border border-border/40 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.18)]",
        deviceMode === "desktop" ? "max-w-4xl" : "max-w-[390px]"
      )}
    >
      {/* Ambient theme glow — leans into --primary so each theme has signature color */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] aspect-square rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] aspect-square rounded-full bg-primary/15 blur-[100px]" />
      </div>

      {/* Theme background illustration */}
      {illus?.background && (
        <div className="absolute inset-0 z-[1] pointer-events-none select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={illus.background} alt="" className="w-full h-full object-cover opacity-[0.18]" />
        </div>
      )}

      {/* Skeleton character — field-type-specific when active, else theme default */}
      {skeletonSrc && (
        <div className="absolute bottom-0 right-0 w-40 h-52 z-[2] pointer-events-none select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={skeletonSrc} alt="" className="w-full h-full object-contain object-bottom drop-shadow-2xl" />
        </div>
      )}

      {/* Inner viewport — fits content, no scroll. Single question always visible. */}
      <div className="relative z-10 w-full h-full overflow-hidden flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl transition-all duration-300 ease-out">
          {children}
        </div>
      </div>
    </div>
  );
}

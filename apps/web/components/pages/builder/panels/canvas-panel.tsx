"use client";

import React, { useMemo, useEffect } from "react";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";
import { FormField, FormFieldType } from "@repo/trpc/server/schemas/form-field-schemas";
import { Theme } from "@repo/trpc/server/schemas/form-schemas";
import CanvasFieldInline from "../components/canvas-field-inline";
import AddContentButton from "../components/add-content-button";
import FormPageViewer from "../components/form-page-viewer";
import { themeVars } from "../components/theme-variables";
import { cn } from "~/lib/utils";

interface CanvasPanelProps {
  fields: FormField[];
  selectedFieldId: string | null;
  theme: Theme;
  deviceMode: "desktop" | "mobile";
  onSelectField: (id: string) => void;
  onAddField: (type: FormFieldType, insertIndex?: number) => void;
  onUpdateField: (id: string, updated: Partial<FormField>) => void;
  onDeleteField: (id: string) => void;
}

export default function CanvasPanel({
  fields,
  selectedFieldId,
  theme,
  deviceMode,
  onSelectField,
  onAddField,
  onUpdateField,
  onDeleteField,
}: CanvasPanelProps) {
  const sorted = useMemo(
    () => [...fields].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [fields]
  );

  const selectedIndex = selectedFieldId
    ? sorted.findIndex((f) => f.id === selectedFieldId)
    : sorted.length > 0
      ? 0
      : -1;
  const selectedField = selectedIndex >= 0 ? sorted[selectedIndex] : null;

  useEffect(() => {
    if (!selectedFieldId && sorted.length > 0 && sorted[0]) {
      onSelectField(sorted[0].id);
    }
  }, [selectedFieldId, sorted, onSelectField]);

  const goPrev = () => {
    const prev = sorted[selectedIndex - 1];
    if (selectedIndex > 0 && prev) onSelectField(prev.id);
  };
  const goNext = () => {
    const next = sorted[selectedIndex + 1];
    if (selectedIndex < sorted.length - 1 && next) onSelectField(next.id);
  };

  const vars = themeVars(theme);

  return (
    <div
      // Outer canvas inherits the form's theme tokens so the surround tints to
      // match the selected theme — subtle ambient, not full bleed. The card
      // inside still owns the focal styling.
      style={{
        ...(vars as React.CSSProperties),
        backgroundImage:
          "radial-gradient(circle at 20% 0%, var(--primary) 0%, transparent 45%), radial-gradient(circle at 80% 100%, var(--primary) 0%, transparent 50%)",
      }}
      className="flex-1 overflow-hidden flex flex-col items-stretch p-5 gap-3 bg-background/30 relative"
    >
      {/* Soft veil so the surround tint reads as ambient, not card-equivalent */}
      <div className="absolute inset-0 bg-muted/40 pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-1 min-h-0 w-full items-center gap-3">
        {sorted.length === 0 ? (
          <div className="flex-1 min-h-0 w-full flex items-center justify-center">
            <FormPageViewer theme={theme} deviceMode={deviceMode}>
              <div className="flex flex-col items-center justify-center text-center space-y-5 max-w-sm mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-foreground">No questions yet</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Add your first question to start building.
                  </p>
                </div>
                <AddContentButton onSelectType={onAddField} />
              </div>
            </FormPageViewer>
          </div>
        ) : selectedField ? (
          <div
            className={cn(
              "w-full flex flex-col flex-1 min-h-0 items-center",
              deviceMode === "desktop" ? "max-w-4xl" : "max-w-[390px]"
            )}
          >
            <FormPageViewer theme={theme} deviceMode={deviceMode} fieldType={selectedField.type}>
              <div
                key={selectedField.id}
                className="w-full animate-fade-in animate-scale-in"
              >
                <CanvasFieldInline
                  field={selectedField}
                  index={selectedIndex}
                  total={sorted.length}
                  onUpdateField={onUpdateField}
                  onDeleteField={onDeleteField}
                />
              </div>
            </FormPageViewer>
          </div>
        ) : null}

        {/* Nav row — outside themed card, sits in canvas surround */}
        {sorted.length > 0 && selectedField && (
          <div
            className={cn(
              "shrink-0 flex items-center justify-between w-full px-1",
              deviceMode === "desktop" ? "max-w-4xl" : "max-w-[390px]"
            )}
          >
            <button
              onClick={goPrev}
              disabled={selectedIndex === 0}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-card/80 backdrop-blur border border-border/60 shadow-sm",
                selectedIndex === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-card hover:border-primary/40 text-muted-foreground hover:text-primary"
              )}
            >
              <ChevronUp className="w-3.5 h-3.5" />
              Prev
            </button>

            <span className="text-3xs font-mono font-bold text-muted-foreground tracking-widest uppercase px-3 py-1 rounded-full bg-card/60 backdrop-blur border border-border/40">
              {selectedIndex + 1} of {sorted.length}
            </span>

            <button
              onClick={goNext}
              disabled={selectedIndex === sorted.length - 1}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-card/80 backdrop-blur border border-border/60 shadow-sm",
                selectedIndex === sorted.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-card hover:border-primary/40 text-muted-foreground hover:text-primary"
              )}
            >
              Next
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

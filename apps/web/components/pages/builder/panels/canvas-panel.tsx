"use client";

import React, { useMemo, useEffect } from "react";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";
import { FormField, FormFieldType } from "@repo/trpc/server/schemas/form-field-schemas";
import { Theme } from "@repo/trpc/server/schemas/form-schemas";
import CanvasFieldInline from "../components/canvas-field-inline";
import AddContentButton from "../components/add-content-button";
import FormPageViewer from "../components/form-page-viewer";
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

  return (
    <div className="flex-1 overflow-auto bg-muted/30 flex flex-col items-center justify-start py-10 px-6">
      <div
        className={cn(
          "w-full flex flex-col items-center gap-4",
          deviceMode === "desktop" ? "max-w-4xl" : "max-w-[390px]"
        )}
      >
        {/* Themed viewer — only this area picks up the form theme */}
        <FormPageViewer theme={theme} deviceMode={deviceMode}>
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center space-y-5 max-w-sm">
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
          ) : selectedField ? (
            <div
              key={selectedField.id}
              className="w-full max-w-xl animate-fade-in"
            >
              <CanvasFieldInline
                field={selectedField}
                index={selectedIndex}
                total={sorted.length}
                onUpdateField={onUpdateField}
                onDeleteField={onDeleteField}
              />
            </div>
          ) : null}
        </FormPageViewer>

        {/* Neutral nav row outside the themed viewer */}
        {sorted.length > 0 && selectedField && (
          <div className="flex items-center justify-between w-full px-1">
            <button
              onClick={goPrev}
              disabled={selectedIndex === 0}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-background border border-border/60",
                selectedIndex === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <ChevronUp className="w-3.5 h-3.5" />
              Prev
            </button>

            <span className="text-4xs font-mono font-bold text-muted-foreground tracking-widest uppercase">
              {selectedIndex + 1} / {sorted.length}
            </span>

            <button
              onClick={goNext}
              disabled={selectedIndex === sorted.length - 1}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-background border border-border/60",
                selectedIndex === sorted.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
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

"use client";

import React from "react";
import { FormField } from "@repo/trpc/server/schemas/form-field-schemas";
import { TYPE_LABELS } from "~/lib/field-type-config";
import QuestionTypeBadge from "./question-type-badge";

interface CanvasQuestionCardProps {
  field: FormField;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function CanvasQuestionCard({
  field,
  index,
  isSelected,
  onSelect,
}: CanvasQuestionCardProps) {
  return (
    <div
      onClick={() => onSelect(field.id)}
      className={`mx-4 mb-3 rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-primary/50 bg-primary/8 shadow-lg shadow-primary/15 ring-2 ring-primary/20"
          : "border-border/50 bg-card/90 hover:border-border hover:shadow-md hover:bg-card"
      }`}
    >
      {/* Card header */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className="font-mono text-4xs font-bold text-muted-foreground/50 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <QuestionTypeBadge type={field.type} size="sm" />
        <span className="text-4xs font-bold text-muted-foreground/50 uppercase tracking-widest">
          {TYPE_LABELS[field.type]}
        </span>
        {field.required && (
          <span className="ml-auto text-4xs text-primary/60 font-bold uppercase">Required</span>
        )}
      </div>

      {/* Question label */}
      <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2 pointer-events-none">
        {field.label || "Untitled question"}
      </p>

      {/* Placeholder */}
      {field.placeholder && (
        <p className="mt-1.5 text-4xs text-muted-foreground/40 truncate pointer-events-none">
          {field.placeholder}
        </p>
      )}

      {/* Options preview */}
      {(field.type === "RADIO" || field.type === "CHECKBOX" || field.type === "SELECT") &&
        field.options &&
        field.options.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 pointer-events-none">
            {field.options.slice(0, 3).map((opt, i) => (
              <span
                key={i}
                className="text-4xs bg-muted/50 border border-border/30 px-2 py-0.5 rounded-full text-muted-foreground"
              >
                {opt}
              </span>
            ))}
            {field.options.length > 3 && (
              <span className="text-4xs text-muted-foreground/40">
                +{field.options.length - 3} more
              </span>
            )}
          </div>
        )}
    </div>
  );
}

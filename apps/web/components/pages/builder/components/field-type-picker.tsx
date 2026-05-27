"use client";

import React from "react";
import { FIELD_TYPES } from "~/lib/field-type-config";
import { FormFieldType } from "@repo/trpc/server/schemas/form-field-schemas";

interface FieldTypePickerProps {
  onSelect: (type: FormFieldType) => void;
  columns?: 2 | 3 | 5;
}

export default function FieldTypePicker({ onSelect, columns = 2 }: FieldTypePickerProps) {
  const gridClass =
    columns === 5 ? "grid-cols-5" : columns === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className={`grid ${gridClass} gap-2`}>
      {FIELD_TYPES.map((cfg) => {
        const Icon = cfg.icon;
        return (
          <button
            key={cfg.type}
            onClick={() => onSelect(cfg.type)}
            className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-border/50 bg-background hover:bg-card hover:border-primary/30 hover:shadow-md transition-all duration-150 cursor-pointer text-center"
          >
            <div
              className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${cfg.color}`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-3xs font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                {cfg.label}
              </p>
              <p className="text-4xs text-muted-foreground/60 mt-0.5 leading-snug">
                {cfg.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

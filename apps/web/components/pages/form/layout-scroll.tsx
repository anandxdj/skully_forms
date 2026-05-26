"use client";

import React from "react";
import { FormField } from "@repo/trpc/server/schemas/form-field-schemas";
import { ArrowRight, Loader2, Skull } from "lucide-react";
import QuestionRenderer from "./question-renderer";

interface LayoutScrollProps {
  fields: FormField[];
  values: Record<string, any>;
  errors: Record<string, string>;
  onChangeValue: (fieldId: string, val: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  title: string;
  description: string | null;
}

export default function LayoutScroll({
  fields,
  values,
  errors,
  onChangeValue,
  onSubmit,
  submitting,
  title,
  description,
}: LayoutScrollProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-xl mx-auto px-4 py-16 space-y-8 select-none"
    >
      {/* Form Header Welcome Panel */}
      <div className="p-6.5 rounded-2xl border border-border/80 bg-card/65 backdrop-blur-md text-left shadow-lg">
        <div className="flex items-center gap-1.5 text-primary mb-1">
          <Skull className="w-5 h-5 fill-current" />
          <span className="text-3xs font-black tracking-widest uppercase">Seal of responses</span>
        </div>
        <h1 className="text-2xl font-black text-foreground mt-3 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-muted-foreground/90 mt-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Dynamic Stack of glassmorphic field cards */}
      <div className="space-y-6">
        {fields.map((field) => (
          <div
            key={field.id}
            className="p-6 rounded-2xl border border-border/60 bg-card/45 backdrop-blur-md shadow-sm hover:border-primary/20 transition-all duration-300"
          >
            <QuestionRenderer
              field={field}
              value={values[field.id]}
              onChange={(val) => onChangeValue(field.id, val)}
              error={errors[field.id]}
            />
          </div>
        ))}
      </div>

      {/* Submission Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 px-6 rounded-xl text-xs font-black text-white bg-gradient-to-r from-primary to-[#ff2e8c]/80 hover:opacity-95 flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 transition-all duration-200 active:scale-99"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4.5 h-4.5 animate-spin" />
            Submitting responses...
          </>
        ) : (
          <>
            Submit Spooky Form
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </>
        )}
      </button>

    </form>
  );
}

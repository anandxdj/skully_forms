"use client";

import React from "react";
import {
  ChevronUp,
  ChevronDown,
  CornerDownLeft,
  Star,
  Calendar,
  UploadCloud,
  CircleDot,
  CheckSquare,
} from "lucide-react";
import { FormField } from "@repo/trpc/server/schemas/form-field-schemas";
import { cn } from "~/lib/utils";

interface CanvasQuestionPreviewProps {
  field: FormField;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

function FieldPreview({ field }: { field: FormField }) {
  switch (field.type) {
    case "TEXT":
    case "EMAIL":
      return (
        <div className="w-full border-b-2 border-primary/40 pb-2 group-focus-within:border-primary transition-colors">
          <input
            type={field.type === "EMAIL" ? "email" : "text"}
            readOnly
            placeholder={field.placeholder || "Type your answer here…"}
            className="w-full bg-transparent text-sm text-foreground/80 placeholder:text-muted-foreground/40 outline-none cursor-default"
          />
        </div>
      );

    case "TEXTAREA":
      return (
        <div className="w-full border-b-2 border-primary/40 pb-2">
          <textarea
            readOnly
            placeholder={field.placeholder || "Type your answer here…"}
            rows={3}
            className="w-full bg-transparent text-sm text-foreground/80 placeholder:text-muted-foreground/40 outline-none resize-none cursor-default leading-relaxed"
          />
        </div>
      );

    case "NUMBER":
      return (
        <div className="w-full border-b-2 border-primary/40 pb-2">
          <input
            type="number"
            readOnly
            placeholder={field.placeholder || "0"}
            className="w-full bg-transparent text-sm text-foreground/80 placeholder:text-muted-foreground/40 outline-none cursor-default"
          />
        </div>
      );

    case "DATE":
      return (
        <div className="flex items-center gap-3 border-b-2 border-primary/40 pb-2">
          <Calendar className="w-4 h-4 text-muted-foreground/40 shrink-0" />
          <span className="text-sm text-muted-foreground/40">MM / DD / YYYY</span>
        </div>
      );

    case "SELECT":
      return (
        <div className="space-y-2 w-full">
          {(field.options || []).slice(0, 4).map((opt, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border/50 hover:border-primary/30 text-sm text-foreground/70 cursor-default transition-colors"
            >
              <span className="font-mono text-4xs font-bold text-muted-foreground/40 w-4 shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </div>
          ))}
        </div>
      );

    case "RADIO":
      return (
        <div className="space-y-2 w-full">
          {(field.options || []).slice(0, 4).map((opt, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border/50 text-sm text-foreground/70 cursor-default"
            >
              <CircleDot className="w-4 h-4 text-muted-foreground/30 shrink-0" />
              {opt}
            </div>
          ))}
        </div>
      );

    case "CHECKBOX":
      return (
        <div className="space-y-2 w-full">
          {(field.options || []).slice(0, 4).map((opt, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border/50 text-sm text-foreground/70 cursor-default"
            >
              <CheckSquare className="w-4 h-4 text-muted-foreground/30 shrink-0" />
              {opt}
            </div>
          ))}
        </div>
      );

    case "RATING":
      return (
        <div className="flex items-center gap-2 flex-wrap">
          {Array.from({ length: field.maxStars ?? 5 }).map((_, i) => (
            <Star key={i} className="w-7 h-7 text-muted-foreground/25 hover:text-amber-400 transition-colors cursor-pointer" />
          ))}
        </div>
      );

    case "FILE":
      return (
        <div className="w-full border-2 border-dashed border-border/50 rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
          <UploadCloud className="w-8 h-8 text-muted-foreground/25" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground/50">
              {field.accept === "image" ? "Click to upload image" : field.accept === "video" ? "Click to upload video" : "Click to upload file"}
            </p>
            <p className="text-4xs text-muted-foreground/30 mt-0.5">
              Max {field.maxSizeMB ?? 10} MB
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default function CanvasQuestionPreview({
  field,
  index,
  total,
  onPrev,
  onNext,
}: CanvasQuestionPreviewProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Progress + question number */}
      <div className="px-6 pt-4 pb-3 space-y-2.5">
        {/* Progress bar */}
        <div className="w-full h-0.5 bg-border/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary/50 rounded-full transition-all duration-500"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <p className="text-4xs font-mono font-bold text-muted-foreground/40 tracking-widest uppercase">
          {index + 1} → {total}
        </p>
      </div>

      {/* Question body */}
      <div className="flex-1 px-6 py-4 flex flex-col gap-6 overflow-y-auto scrollbar-none">
        {/* Label */}
        <div className="space-y-1.5">
          <p className="text-base font-heading font-bold text-foreground leading-snug">
            {field.label || "Untitled question"}
            {field.required && (
              <span className="text-primary ml-1 text-sm">*</span>
            )}
          </p>
          {field.placeholder && (
            <p className="text-xs text-muted-foreground/50 leading-relaxed">
              {field.placeholder}
            </p>
          )}
        </div>

        {/* Input preview */}
        <FieldPreview field={field} />

        {/* Submit hint */}
        {(field.type === "TEXT" || field.type === "TEXTAREA" || field.type === "NUMBER" || field.type === "EMAIL") && (
          <div className="flex items-center gap-1.5 text-4xs text-muted-foreground/30">
            <span>Press</span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-muted/40 border border-border/30 rounded text-3xs font-mono font-bold">
              Enter <CornerDownLeft className="w-2.5 h-2.5 inline" />
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 py-4 border-t border-border/20 flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
            index === 0
              ? "opacity-20 cursor-not-allowed"
              : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
          )}
        >
          <ChevronUp className="w-3.5 h-3.5" />
          Prev
        </button>

        <button
          onClick={onNext}
          disabled={index === total - 1}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
            index === total - 1
              ? "opacity-20 cursor-not-allowed"
              : "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
          )}
        >
          Next
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

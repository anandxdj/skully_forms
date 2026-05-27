"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Calendar,
  Star,
  UploadCloud,
  CircleDot,
  CheckSquare,
  Asterisk,
  GripVertical,
} from "lucide-react";
import { FormField } from "@repo/trpc/server/schemas/form-field-schemas";
import { cn } from "~/lib/utils";

interface CanvasFieldInlineProps {
  field: FormField;
  index: number;
  total: number;
  onUpdateField: (id: string, updated: Partial<FormField>) => void;
  onDeleteField: (id: string) => void;
}

/**
 * `contentEditable` span that commits on blur. Uses suppressContentEditableWarning
 * to silence React warnings about the uncontrolled DOM mutation.
 */
function EditableText({
  value,
  onCommit,
  placeholder,
  className,
  multiline,
}: {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  return (
    <span
      ref={ref}
      role="textbox"
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onBlur={(e) => {
        const next = (e.currentTarget.textContent ?? "").trim();
        if (next !== value) onCommit(next);
      }}
      onKeyDown={(e) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
      }}
      className={cn(
        "outline-none rounded-md px-1 -mx-1 focus:bg-primary/5 focus:ring-2 ring-primary/30 transition-colors empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40 empty:before:font-normal inline-block min-w-[2ch]",
        className
      )}
    >
      {value}
    </span>
  );
}

function OptionRow({
  value,
  index,
  icon,
  onChange,
  onRemove,
  canRemove,
}: {
  value: string;
  index: number;
  icon: React.ReactNode;
  onChange: (next: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="group flex items-center gap-2.5 px-3.5 py-3 rounded-2xl border border-border/50 hover:border-primary/40 hover:bg-card/60 transition-all bg-card/40">
      <span className="font-mono text-4xs font-bold text-muted-foreground/40 w-4 shrink-0">
        {String.fromCharCode(65 + index)}
      </span>
      {icon}
      <EditableText
        value={value}
        onCommit={onChange}
        placeholder="Option"
        className="flex-1 text-sm text-foreground/80"
      />
      {canRemove && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
          title="Remove option"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

function FieldBody({
  field,
  onUpdateField,
}: {
  field: FormField;
  onUpdateField: (id: string, updated: Partial<FormField>) => void;
}) {
  const updateOptions = (next: string[]) => {
    onUpdateField(field.id, { options: next } as Partial<FormField>);
  };

  switch (field.type) {
    case "TEXT":
    case "EMAIL":
      return (
        <div className="w-full border-b-2 border-primary/40 pb-2">
          <input
            type={field.type === "EMAIL" ? "email" : "text"}
            readOnly
            placeholder="Type your answer here…"
            className="w-full bg-transparent text-sm text-foreground/60 placeholder:text-muted-foreground/40 outline-none cursor-default"
          />
        </div>
      );

    case "TEXTAREA":
      return (
        <div className="w-full border-b-2 border-primary/40 pb-2">
          <textarea
            readOnly
            placeholder="Type your answer here…"
            rows={3}
            className="w-full bg-transparent text-sm text-foreground/60 placeholder:text-muted-foreground/40 outline-none resize-none cursor-default leading-relaxed"
          />
        </div>
      );

    case "NUMBER":
      return (
        <div className="w-full border-b-2 border-primary/40 pb-2">
          <input
            type="number"
            readOnly
            placeholder="0"
            className="w-full bg-transparent text-sm text-foreground/60 placeholder:text-muted-foreground/40 outline-none cursor-default"
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
    case "RADIO":
    case "CHECKBOX": {
      const options = field.options ?? [];
      const Icon =
        field.type === "RADIO" ? CircleDot : field.type === "CHECKBOX" ? CheckSquare : null;
      const vertical = field.verticalAlign ?? true;
      return (
        <div
          className={cn(
            "w-full",
            vertical ? "space-y-2" : "flex flex-wrap gap-2"
          )}
        >
          {options.map((opt, i) => (
            <div
              key={i}
              className={cn(!vertical && "flex-1 min-w-[160px]")}
            >
              <OptionRow
                value={opt}
                index={i}
                icon={
                  Icon ? <Icon className="w-4 h-4 text-muted-foreground/40 shrink-0" /> : null
                }
                onChange={(next) => {
                  const copy = [...options];
                  copy[i] = next || `Option ${i + 1}`;
                  updateOptions(copy);
                }}
                onRemove={() => updateOptions(options.filter((_, j) => j !== i))}
                canRemove={options.length > 1}
              />
            </div>
          ))}
          {field.allowOther && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border/50 text-sm text-muted-foreground/70 italic bg-card/30">
              <span className="font-mono text-4xs font-bold text-muted-foreground/40 w-4 shrink-0">
                {String.fromCharCode(65 + options.length)}
              </span>
              Other…
            </div>
          )}
          <button
            onClick={() =>
              updateOptions([...options, `Option ${options.length + 1}`])
            }
            className={cn(
              "flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-muted-foreground border border-border/40 border-dashed rounded-xl hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer",
              vertical ? "w-full" : "shrink-0"
            )}
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
            Add option
          </button>
        </div>
      );
    }

    case "RATING":
      return (
        <div className="flex items-center gap-2 flex-wrap">
          {Array.from({ length: field.maxStars ?? 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-7 h-7 text-muted-foreground/25"
            />
          ))}
          <div className="flex items-center gap-1 ml-2 text-3xs text-muted-foreground">
            <span>Stars:</span>
            {[3, 5, 7, 10].map((n) => (
              <button
                key={n}
                onClick={() => onUpdateField(field.id, { maxStars: n } as Partial<FormField>)}
                className={cn(
                  "px-1.5 py-0.5 rounded font-mono font-bold cursor-pointer",
                  (field.maxStars ?? 5) === n
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/60"
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      );

    case "FILE":
      return (
        <div className="w-full border-2 border-dashed border-border/50 rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
          <UploadCloud className="w-8 h-8 text-muted-foreground/25" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground/50">
              {field.accept === "image"
                ? "Click to upload image"
                : field.accept === "video"
                  ? "Click to upload video"
                  : "Click to upload file"}
            </p>
            <p className="text-4xs text-muted-foreground/30 mt-0.5">
              Max {field.maxSizeMB ?? 10} MB
            </p>
          </div>
          <div className="flex items-center gap-1 text-3xs text-muted-foreground">
            <span>Accept:</span>
            {(["any", "image", "video"] as const).map((a) => (
              <button
                key={a}
                onClick={() => onUpdateField(field.id, { accept: a } as Partial<FormField>)}
                className={cn(
                  "px-1.5 py-0.5 rounded font-mono font-bold cursor-pointer",
                  field.accept === a ? "bg-primary/10 text-primary" : "hover:bg-muted/60"
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default function CanvasFieldInline({
  field,
  index,
  total,
  onUpdateField,
  onDeleteField,
}: CanvasFieldInlineProps) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Progress + counter pill */}
      <div className="px-2 pt-1 pb-5 space-y-2.5">
        <div className="w-full h-1 bg-border/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-[width] duration-700 ease-out"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-3xs font-mono font-bold text-primary tracking-widest uppercase">
            {index + 1} of {total}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-2 flex flex-col gap-7">
        {/* Label */}
        <div className="space-y-2.5">
          <p className="text-2xl md:text-3xl font-heading font-extrabold text-foreground leading-[1.15] tracking-tight">
            <EditableText
              value={field.label}
              onCommit={(next) => onUpdateField(field.id, { label: next })}
              placeholder="Untitled question"
              multiline
            />
            {field.required && <span className="text-primary ml-1.5">*</span>}
          </p>
          <p className="text-sm text-muted-foreground/70 leading-relaxed">
            <EditableText
              value={field.placeholder || ""}
              onCommit={(next) =>
                onUpdateField(field.id, { placeholder: next || undefined })
              }
              placeholder="Add a description (optional)"
              multiline
            />
          </p>
        </div>

        {/* Input */}
        <FieldBody field={field} onUpdateField={onUpdateField} />

        {/* Inline controls */}
        <div className="flex items-center gap-3 pt-3 border-t border-border/30">
          <button
            onClick={() => onUpdateField(field.id, { required: !field.required })}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-3xs font-bold transition-all cursor-pointer",
              field.required
                ? "bg-primary/10 text-primary border border-primary/30"
                : "border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            <Asterisk className="w-3 h-3" />
            Required
          </button>

          <div className="flex-1" />

          <button
            onClick={() => onDeleteField(field.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-3xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

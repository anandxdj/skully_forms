"use client";

import React from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Asterisk,
  HelpCircle,
  Type,
  Video,
  Image as ImageIcon,
  Plus,
  Trash2,
  GitBranch,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { FormField, FormFieldType } from "@repo/trpc/server/schemas/form-field-schemas";
import { cn } from "~/lib/utils";

interface RightPanelProps {
  selectedField: FormField | null;
  onUpdateField: (id: string, updated: Partial<FormField>) => void;
  onChangeFieldType: (id: string, nextType: FormFieldType) => void;
  onDeleteField: (id: string) => void;
}

// ─── Building blocks ────────────────────────────────────────────────────────

function CardSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("bg-card border border-border/50 rounded-2xl p-4 space-y-3", className)}>
      {children}
    </section>
  );
}

function SectionHeader({
  title,
  icon,
  trailing,
}: {
  title: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="flex items-center gap-1.5 text-sm font-bold text-foreground">
        {icon}
        {title}
      </h3>
      {trailing}
    </div>
  );
}

function ToggleRow({
  label,
  enabled,
  onChange,
}: {
  label: string;
  enabled: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="w-full flex items-center justify-between py-1.5 cursor-pointer group"
    >
      <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
        {label}
      </span>
      <span
        className={cn(
          "w-8 h-4 rounded-full p-0.5 transition-colors shrink-0",
          enabled ? "bg-foreground" : "bg-border"
        )}
      >
        <span
          className={cn(
            "block w-3 h-3 rounded-full bg-background transition-transform",
            enabled && "translate-x-4"
          )}
        />
      </span>
    </button>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  placeholder,
}: {
  value: number | undefined;
  onChange: (n: number | undefined) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      value={value ?? ""}
      placeholder={placeholder}
      min={min}
      max={max}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") onChange(undefined);
        else {
          const n = Number(raw);
          if (!Number.isNaN(n)) onChange(n);
        }
      }}
      className="w-full bg-background border border-border/60 rounded-lg text-xs py-1.5 px-2.5 outline-none focus:border-primary text-foreground font-mono transition-colors"
    />
  );
}

function TabPair({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1 p-1 bg-muted/60 rounded-xl border border-border/40">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={cn(
            "flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
            value === opt.id
              ? "bg-background text-foreground shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function CollapsibleStub({
  title,
  icon,
}: {
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <section className="bg-card border border-border/50 rounded-2xl p-4">
      <button
        disabled
        className="w-full flex items-center justify-between text-left cursor-not-allowed"
        title="Coming soon"
      >
        <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          {icon}
          {title}
        </span>
        <Plus className="w-3.5 h-3.5 text-muted-foreground/50" />
      </button>
    </section>
  );
}

// ─── Type-specific sections ─────────────────────────────────────────────────

const ANSWER_TYPE_LABELS: Record<FormFieldType, string> = {
  TEXT: "Short Text",
  TEXTAREA: "Long Text",
  NUMBER: "Number",
  EMAIL: "Email",
  DATE: "Date",
  SELECT: "Dropdown",
  RADIO: "Single Choice",
  CHECKBOX: "Multiple Choice",
  FILE: "File Upload",
  RATING: "Star Rating",
};

function AnswerTypePicker({
  field,
  onChangeFieldType,
}: {
  field: FormField;
  onChangeFieldType: (id: string, nextType: FormFieldType) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-3xs font-black uppercase text-muted-foreground/70 tracking-widest">
        Type
      </label>
      <select
        value={field.type}
        onChange={(e) =>
          onChangeFieldType(field.id, e.target.value as FormFieldType)
        }
        className="w-full bg-background border border-border/60 rounded-lg text-xs py-2 px-2.5 outline-none focus:border-primary text-foreground transition-colors cursor-pointer"
      >
        {(Object.keys(ANSWER_TYPE_LABELS) as FormFieldType[]).map((t) => (
          <option key={t} value={t}>
            {ANSWER_TYPE_LABELS[t]}
          </option>
        ))}
      </select>
    </div>
  );
}

function TypeSpecificAnswerControls({
  field,
  onUpdateField,
}: {
  field: FormField;
  onUpdateField: (id: string, updated: Partial<FormField>) => void;
}) {
  const update = (patch: Partial<FormField>) => onUpdateField(field.id, patch);

  switch (field.type) {
    case "SELECT":
    case "RADIO":
    case "CHECKBOX":
      return (
        <>
          <ToggleRow
            label="Randomize"
            enabled={!!field.randomize}
            onChange={(v) => update({ randomize: v } as Partial<FormField>)}
          />
          <ToggleRow
            label={'"Other" option'}
            enabled={!!field.allowOther}
            onChange={(v) => update({ allowOther: v } as Partial<FormField>)}
          />
          <ToggleRow
            label="Vertical alignment"
            enabled={field.verticalAlign ?? true}
            onChange={(v) => update({ verticalAlign: v } as Partial<FormField>)}
          />
        </>
      );

    case "NUMBER":
      return (
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="space-y-1.5">
            <label className="text-3xs font-black uppercase text-muted-foreground/70 tracking-widest">
              Min
            </label>
            <NumberInput
              value={field.min}
              onChange={(n) => update({ min: n } as Partial<FormField>)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-3xs font-black uppercase text-muted-foreground/70 tracking-widest">
              Max
            </label>
            <NumberInput
              value={field.max}
              onChange={(n) => update({ max: n } as Partial<FormField>)}
            />
          </div>
        </div>
      );

    case "RATING":
      return (
        <div className="space-y-1.5 pt-1">
          <label className="text-3xs font-black uppercase text-muted-foreground/70 tracking-widest">
            Max stars (3–10)
          </label>
          <NumberInput
            value={field.maxStars}
            min={3}
            max={10}
            onChange={(n) =>
              update({
                maxStars: Math.min(10, Math.max(3, n ?? 5)),
              } as Partial<FormField>)
            }
          />
        </div>
      );

    case "FILE":
      return (
        <>
          <div className="space-y-1.5 pt-1">
            <label className="text-3xs font-black uppercase text-muted-foreground/70 tracking-widest">
              Accepted type
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(["any", "image", "video"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => update({ accept: a } as Partial<FormField>)}
                  className={cn(
                    "px-2 py-1.5 rounded-lg text-3xs font-bold uppercase tracking-widest cursor-pointer transition-colors",
                    field.accept === a
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-3xs font-black uppercase text-muted-foreground/70 tracking-widest">
              Max size (MB)
            </label>
            <NumberInput
              value={field.maxSizeMB}
              min={1}
              max={50}
              onChange={(n) =>
                update({
                  maxSizeMB: Math.min(50, Math.max(1, n ?? 10)),
                } as Partial<FormField>)
              }
            />
          </div>
        </>
      );

    default:
      return null;
  }
}

// ─── Main component ────────────────────────────────────────────────────────

export default function RightPanel({
  selectedField,
  onUpdateField,
  onChangeFieldType,
  onDeleteField,
}: RightPanelProps) {
  if (!selectedField) {
    return (
      <aside className="flex flex-col h-full w-[300px] border-l border-sidebar-border bg-sidebar/60 shrink-0">
        <div className="flex-1 flex items-center justify-center px-6 text-center">
          <p className="text-xs text-muted-foreground/60 leading-relaxed">
            Select a question to edit its settings.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col h-full w-[300px] border-l border-sidebar-border bg-sidebar/40 shrink-0">
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-3">
          {/* Question section */}
          <CardSection>
            <SectionHeader
              title="Question"
              trailing={
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50" />
              }
            />
            <TabPair
              options={[
                { id: "text", label: "Text", icon: <Type className="w-3.5 h-3.5" /> },
                { id: "video", label: "Video", icon: <Video className="w-3.5 h-3.5" /> },
              ]}
              value="text"
              onChange={() => {
                /* Video questions not supported yet */
              }}
            />
          </CardSection>

          {/* Answer section */}
          <CardSection>
            <SectionHeader title="Answer" />
            <AnswerTypePicker
              field={selectedField}
              onChangeFieldType={onChangeFieldType}
            />

            <div className="pt-1 space-y-0.5 border-t border-border/30">
              <ToggleRow
                label="Required"
                enabled={!!selectedField.required}
                onChange={(v) =>
                  onUpdateField(selectedField.id, { required: v })
                }
              />

              <TypeSpecificAnswerControls
                field={selectedField}
                onUpdateField={onUpdateField}
              />
            </div>
          </CardSection>

          {/* Image / video — stub */}
          <CollapsibleStub
            title="Image or video"
            icon={<ImageIcon className="w-3.5 h-3.5" />}
          />

          {/* Branching — stub */}
          <CollapsibleStub
            title="Branching"
            icon={<GitBranch className="w-3.5 h-3.5" />}
          />

          {/* Comments — stub */}
          <CollapsibleStub
            title="Comments"
            icon={<MessageSquare className="w-3.5 h-3.5 text-emerald-500" />}
          />

          {/* Delete */}
          <button
            onClick={() => onDeleteField(selectedField.id)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-destructive border border-destructive/30 hover:bg-destructive/5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            Delete question
          </button>
        </div>
      </ScrollArea>
    </aside>
  );
}

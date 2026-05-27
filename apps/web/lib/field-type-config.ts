import {
  Type,
  AlignLeft,
  Binary,
  Mail,
  Calendar,
  ListCollapse,
  CircleDot,
  CheckSquare,
  UploadCloud,
  Star,
} from "lucide-react";
import React from "react";
import { FormFieldType } from "@repo/trpc/server/schemas/form-field-schemas";

export interface FieldTypeConfig {
  type: FormFieldType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const FIELD_TYPES: FieldTypeConfig[] = [
  { type: "TEXT",     label: "Short Text",     description: "Single-line answer",    icon: Type,         color: "text-sky-400 bg-sky-400/10 border-sky-400/20" },
  { type: "TEXTAREA", label: "Long Text",       description: "Multi-line paragraph",  icon: AlignLeft,    color: "text-violet-400 bg-violet-400/10 border-violet-400/20" },
  { type: "NUMBER",   label: "Number",          description: "Integer or decimal",    icon: Binary,       color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  { type: "EMAIL",    label: "Email",           description: "Validated email",       icon: Mail,         color: "text-rose-400 bg-rose-400/10 border-rose-400/20" },
  { type: "DATE",     label: "Date",            description: "Calendar picker",       icon: Calendar,     color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  { type: "SELECT",   label: "Dropdown",        description: "Pick one from list",    icon: ListCollapse, color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" },
  { type: "RADIO",    label: "Single Choice",   description: "One option only",       icon: CircleDot,    color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20" },
  { type: "CHECKBOX", label: "Multiple Choice", description: "Toggle many options",   icon: CheckSquare,  color: "text-pink-400 bg-pink-400/10 border-pink-400/20" },
  { type: "FILE",     label: "File Upload",     description: "Attach file or image",  icon: UploadCloud,  color: "text-teal-400 bg-teal-400/10 border-teal-400/20" },
  { type: "RATING",   label: "Star Rating",     description: "Score on a scale",      icon: Star,         color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
];

export const TYPE_LABELS: Record<FormFieldType, string> = Object.fromEntries(
  FIELD_TYPES.map((cfg) => [cfg.type, cfg.label])
) as Record<FormFieldType, string>;

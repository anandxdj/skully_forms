"use client";

import React from "react";
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
  Sparkles,
} from "lucide-react";
import { FormFieldType } from "@repo/trpc/server/schemas/form-field-schemas";

interface SidebarLeftProps {
  onAddField: (type: FormFieldType) => void;
}

interface FieldTypeConfig {
  type: FormFieldType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const FIELD_TYPES: FieldTypeConfig[] = [
  {
    type: "TEXT",
    label: "Short Text",
    description: "Standard single line response",
    icon: Type,
    color: "text-[#00f5ff] bg-[#00f5ff]/10 border-[#00f5ff]/20",
  },
  {
    type: "TEXTAREA",
    label: "Long Text",
    description: "Multi-line rich commentary",
    icon: AlignLeft,
    color: "text-[#9d4edd] bg-[#9d4edd]/10 border-[#9d4edd]/20",
  },
  {
    type: "NUMBER",
    label: "Number",
    description: "Integers or decimal values",
    icon: Binary,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    type: "EMAIL",
    label: "Email Address",
    description: "Validated email input",
    icon: Mail,
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  },
  {
    type: "DATE",
    label: "Date Picker",
    description: "Calendar day selector",
    icon: Calendar,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    type: "SELECT",
    label: "Select Menu",
    description: "Accordion dropdown choices",
    icon: ListCollapse,
    color: "text-sky-500 bg-sky-500/10 border-sky-500/20",
  },
  {
    type: "RADIO",
    label: "Single Choice",
    description: "Choose exactly one option",
    icon: CircleDot,
    color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    type: "CHECKBOX",
    label: "Multiple Choice",
    description: "Toggle multiple conditions",
    icon: CheckSquare,
    color: "text-[#ff2e8c] bg-[#ff2e8c]/10 border-[#ff2e8c]/20",
  },
  {
    type: "FILE",
    label: "File Upload",
    description: "Attachments, images, video",
    icon: UploadCloud,
    color: "text-[#00f5ff] bg-[#00f5ff]/10 border-[#00f5ff]/20",
  },
  {
    type: "RATING",
    label: "Spooky Rating",
    description: "Star rating selector",
    icon: Star,
    color: "text-[#ff9e00] bg-[#ff9e00]/10 border-[#ff9e00]/20",
  },
];

export default function SidebarLeft({ onAddField }: SidebarLeftProps) {
  return (
    <aside className="w-72 border-r border-border/50 bg-card/20 backdrop-blur-md p-5 flex flex-col h-full select-none shrink-0">
      <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border/40">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Field Palette
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
        {FIELD_TYPES.map((cfg) => {
          const Icon = cfg.icon;
          return (
            <button
              key={cfg.type}
              onClick={() => onAddField(cfg.type)}
              className="w-full text-left p-3 rounded-xl border border-border/80 bg-card hover:bg-card/80 hover:border-primary/40 hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(237,145,148,0.05)] transition-all duration-200 group flex items-start gap-3 cursor-pointer"
            >
              <div
                className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${cfg.color}`}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-2xs font-extrabold text-foreground group-hover:text-primary transition-colors">
                  {cfg.label}
                </p>
                <p className="text-4xs text-muted-foreground/80 leading-normal mt-0.5">
                  {cfg.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

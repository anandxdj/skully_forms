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
  X,
} from "lucide-react";
import { FormFieldType } from "@repo/trpc/server/schemas/form-field-schemas";

interface SidebarLeftProps {
  onSelectType: (type: FormFieldType) => void;
  onClose: () => void;
}

interface FieldTypeConfig {
  type: FormFieldType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const FIELD_TYPES: FieldTypeConfig[] = [
  { type: "TEXT",     label: "Short Text",      description: "Single-line answer",      icon: Type,         color: "text-sky-400 bg-sky-400/10 border-sky-400/20" },
  { type: "TEXTAREA", label: "Long Text",        description: "Multi-line paragraph",    icon: AlignLeft,    color: "text-violet-400 bg-violet-400/10 border-violet-400/20" },
  { type: "NUMBER",   label: "Number",           description: "Integer or decimal",      icon: Binary,       color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  { type: "EMAIL",    label: "Email",            description: "Validated email",         icon: Mail,         color: "text-rose-400 bg-rose-400/10 border-rose-400/20" },
  { type: "DATE",     label: "Date",             description: "Calendar picker",         icon: Calendar,     color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  { type: "SELECT",   label: "Dropdown",         description: "Pick one from list",      icon: ListCollapse, color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" },
  { type: "RADIO",    label: "Single Choice",    description: "One option only",         icon: CircleDot,    color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20" },
  { type: "CHECKBOX", label: "Multiple Choice",  description: "Toggle many options",     icon: CheckSquare,  color: "text-pink-400 bg-pink-400/10 border-pink-400/20" },
  { type: "FILE",     label: "File Upload",      description: "Attach file or image",   icon: UploadCloud,  color: "text-teal-400 bg-teal-400/10 border-teal-400/20" },
  { type: "RATING",   label: "Star Rating",      description: "Score on a scale",        icon: Star,         color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
];

export default function SidebarLeft({ onSelectType, onClose }: SidebarLeftProps) {
  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="relative z-10 bg-card border-t border-border/60 rounded-t-3xl shadow-2xl animate-drawer-up max-h-[75vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border/60" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-foreground">Add a question</h3>
            <p className="text-3xs text-muted-foreground mt-0.5">Choose a field type to insert</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Field type grid */}
        <div className="overflow-y-auto scrollbar-none p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {FIELD_TYPES.map((cfg) => {
              const Icon = cfg.icon;
              return (
                <button
                  key={cfg.type}
                  onClick={() => onSelectType(cfg.type)}
                  className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-border/50 bg-background hover:bg-card hover:border-primary/30 hover:shadow-md transition-all duration-150 cursor-pointer text-center"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${cfg.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {cfg.label}
                    </p>
                    <p className="text-4xs text-muted-foreground/70 mt-0.5 leading-snug">
                      {cfg.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

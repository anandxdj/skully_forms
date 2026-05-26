"use client";

import React, { useState } from "react";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Asterisk,
  Settings2,
} from "lucide-react";
import { FormField } from "@repo/trpc/server/schemas/form-field-schemas";

interface FieldEditorProps {
  field: FormField;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateField: (updated: Partial<FormField>) => void;
  onDeleteField: () => void;
}

export default function FieldEditor({
  field,
  isExpanded,
  onToggleExpand,
  onUpdateField,
  onDeleteField,
}: FieldEditorProps) {
  const [newOption, setNewOption] = useState("");

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOption.trim()) return;

    if (
      field.type === "SELECT" ||
      field.type === "RADIO" ||
      field.type === "CHECKBOX"
    ) {
      const options = field.options || [];
      if (!options.includes(newOption.trim())) {
        onUpdateField({ options: [...options, newOption.trim()] });
      }
      setNewOption("");
    }
  };

  const handleRemoveOption = (indexToRemove: number) => {
    if (
      field.type === "SELECT" ||
      field.type === "RADIO" ||
      field.type === "CHECKBOX"
    ) {
      const options = field.options || [];
      onUpdateField({
        options: options.filter((_, idx) => idx !== indexToRemove),
      });
    }
  };

  const handleUpdateOptionText = (indexToUpdate: number, text: string) => {
    if (
      field.type === "SELECT" ||
      field.type === "RADIO" ||
      field.type === "CHECKBOX"
    ) {
      const options = [...(field.options || [])];
      options[indexToUpdate] = text;
      onUpdateField({ options });
    }
  };

  return (
    <div
      className={`border rounded-xl bg-card/65 transition-all duration-300 ${
        isExpanded
          ? "border-primary/50 shadow-md shadow-primary/5"
          : "border-border/60 hover:border-border"
      }`}
    >
      {/* Field Editor Header Preview */}
      <div
        onClick={onToggleExpand}
        className="p-4 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-7 h-7 rounded-lg border border-border/70 bg-muted/50 text-muted-foreground flex items-center justify-center font-mono text-3xs font-bold">
            {field.type.slice(0, 3)}
          </div>
          <div className="text-left min-w-0">
            <h4 className="text-xs font-black text-foreground truncate pr-3 flex items-center gap-1">
              {field.label || "Untitled Question"}
              {field.required && (
                <Asterisk className="w-3 h-3 text-[#ff2e8c] stroke-[3]" />
              )}
            </h4>
            <p className="text-5xs text-muted-foreground uppercase tracking-widest mt-0.5">
              Type: {field.type}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Delete this question from your form?")) {
                onDeleteField();
              }
            }}
            className="p-1.5 rounded-lg hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            title="Delete Field"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          
          <div className="text-muted-foreground">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Accordion Area */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-border/40 space-y-4 text-left animate-fade-in">
          
          {/* Main Controls (Label & Placeholder) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="space-y-1">
              <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest">
                Question Label
              </label>
              <input
                type="text"
                value={field.label}
                onChange={(e) => onUpdateField({ label: e.target.value })}
                placeholder="e.g. What is your full spooky name?"
                className="w-full bg-card border border-border/60 rounded-lg text-xs py-2 px-2.5 outline-none focus:border-primary text-foreground transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest">
                Placeholder Text
              </label>
              <input
                type="text"
                value={field.placeholder || ""}
                onChange={(e) => onUpdateField({ placeholder: e.target.value })}
                placeholder="e.g. Jack O. Lantern"
                className="w-full bg-card border border-border/60 rounded-lg text-xs py-2 px-2.5 outline-none focus:border-primary text-foreground transition-colors"
              />
            </div>
          </div>

          {/* Settings & Configurations Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/20">
            {/* Required validation toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`req-${field.id}`}
                checked={field.required}
                onChange={(e) => onUpdateField({ required: e.target.checked })}
                className="w-4 h-4 rounded border-border text-[#ff2e8c] accent-[#ff2e8c] focus:ring-0 cursor-pointer"
              />
              <label
                htmlFor={`req-${field.id}`}
                className="text-3xs font-extrabold uppercase text-muted-foreground cursor-pointer select-none"
              >
                Mark as Mandatory/Required
              </label>
            </div>

            {/* Field Type Specific Controls */}
            <div className="flex items-center gap-2">
              <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-4xs font-bold text-muted-foreground uppercase tracking-wider">
                Settings
              </span>
            </div>
          </div>

          {/* Dynamic configs based on type */}
          <div className="bg-muted/15 rounded-xl border border-border/40 p-4 space-y-3.5">
            {/* 1. NUMBER Config */}
            {field.type === "NUMBER" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest">
                    Minimum Value
                  </label>
                  <input
                    type="number"
                    value={field.min ?? ""}
                    onChange={(e) =>
                      onUpdateField({
                        min: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="None"
                    className="w-full bg-card border border-border/60 rounded-lg text-xs py-1.5 px-2 outline-none focus:border-primary text-foreground transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest">
                    Maximum Value
                  </label>
                  <input
                    type="number"
                    value={field.max ?? ""}
                    onChange={(e) =>
                      onUpdateField({
                        max: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="None"
                    className="w-full bg-card border border-border/60 rounded-lg text-xs py-1.5 px-2 outline-none focus:border-primary text-foreground transition-colors"
                  />
                </div>
              </div>
            )}

            {/* 2. OPTIONS Config (SELECT, RADIO, CHECKBOX) */}
            {(field.type === "SELECT" ||
              field.type === "RADIO" ||
              field.type === "CHECKBOX") && (
              <div className="space-y-3">
                <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest">
                  Options Inventory
                </label>

                {/* List options */}
                <div className="flex flex-wrap gap-2">
                  {(field.options || []).map((opt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 bg-card border border-border/80 rounded-lg py-1 px-2.5 text-2xs font-semibold shadow-sm"
                    >
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleUpdateOptionText(idx, e.target.value)}
                        className="bg-transparent border-none outline-none p-0 text-foreground font-semibold w-24"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="text-muted-foreground hover:text-destructive p-0.5 rounded cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {(field.options || []).length === 0 && (
                    <p className="text-4xs text-muted-foreground">
                      No options defined. Add choices below.
                    </p>
                  )}
                </div>

                {/* Add new option form */}
                <form onSubmit={handleAddOption} className="flex gap-2">
                  <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="e.g. Boba Milk Tea"
                    className="flex-1 bg-card border border-border/60 rounded-lg text-xs py-1.5 px-2.5 outline-none focus:border-primary text-foreground transition-colors"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center p-1.5 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </form>
              </div>
            )}

            {/* 3. FILE Config */}
            {field.type === "FILE" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest">
                    Accepted MIME
                  </label>
                  <select
                    value={field.accept || "any"}
                    onChange={(e) =>
                      onUpdateField({
                        accept: e.target.value as "image" | "video" | "any",
                      })
                    }
                    className="w-full bg-card border border-border/60 rounded-lg text-xs py-1.5 px-2 outline-none focus:border-primary text-foreground transition-colors"
                  >
                    <option value="any">Any File Type</option>
                    <option value="image">Images Only</option>
                    <option value="video">Videos Only</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest">
                    Max File Size (MB)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={field.maxSizeMB ?? 10}
                    onChange={(e) =>
                      onUpdateField({
                        maxSizeMB: Number(e.target.value) || 10,
                      })
                    }
                    placeholder="10"
                    className="w-full bg-card border border-border/60 rounded-lg text-xs py-1.5 px-2 outline-none focus:border-primary text-foreground transition-colors"
                  />
                </div>
              </div>
            )}

            {/* 4. RATING Config */}
            {field.type === "RATING" && (
              <div className="space-y-1 max-w-[150px]">
                <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest">
                  Max Stars/Score
                </label>
                <select
                  value={field.maxStars ?? 5}
                  onChange={(e) =>
                    onUpdateField({
                      maxStars: Number(e.target.value) || 5,
                    })
                  }
                  className="w-full bg-card border border-border/60 rounded-lg text-xs py-1.5 px-2 outline-none focus:border-primary text-foreground transition-colors"
                >
                  {[3, 4, 5, 6, 7, 8, 9, 10].map((starCount) => (
                    <option key={starCount} value={starCount}>
                      {starCount} Star Scale
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Informational tip for remaining basic types (TEXT, TEXTAREA, EMAIL, DATE) */}
            {["TEXT", "TEXTAREA", "EMAIL", "DATE"].includes(field.type) && (
              <p className="text-5xs text-muted-foreground/80 leading-normal">
                Standard {field.type.toLowerCase()} field requires no additional parameters. Client-side schemas will enforce type-safety automatically.
              </p>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

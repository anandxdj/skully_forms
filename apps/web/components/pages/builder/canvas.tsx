"use client";

import React, { useState } from "react";
import { Plus, Sparkles, AlertCircle } from "lucide-react";
import { FormField, FormFieldType } from "@repo/trpc/server/schemas/form-field-schemas";
import FieldEditor from "./field-editor";

interface CanvasProps {
  fields: FormField[];
  onAddField: (type: FormFieldType, index?: number) => void;
  onUpdateField: (id: string, updated: Partial<FormField>) => void;
  onDeleteField: (id: string) => void;
}

export default function Canvas({
  fields,
  onAddField,
  onUpdateField,
  onDeleteField,
}: CanvasProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const fieldTypesList: { type: FormFieldType; label: string }[] = [
    { type: "TEXT", label: "Short Text" },
    { type: "TEXTAREA", label: "Long Text" },
    { type: "NUMBER", label: "Number" },
    { type: "EMAIL", label: "Email" },
    { type: "DATE", label: "Date" },
    { type: "SELECT", label: "Dropdown" },
    { type: "RADIO", label: "Single Select" },
    { type: "CHECKBOX", label: "Multi Select" },
    { type: "FILE", label: "File Upload" },
    { type: "RATING", label: "Star Rating" },
  ];

  return (
    <main className="flex-1 p-8 bg-muted/20 overflow-y-auto relative scrollbar-thin">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Canvas Form Structure */}
        <div className="p-6.5 rounded-2xl border border-border/80 bg-card shadow-sm text-left">
          <div className="flex items-center gap-1.5 mb-1 bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full w-max text-5xs font-black uppercase tracking-wider select-none">
            <Sparkles className="w-3 h-3 fill-current" />
            Active Canvas
          </div>
          <h2 className="text-sm font-extrabold text-muted-foreground leading-normal mt-2 select-none">
            Dynamic Form Canvas
          </h2>
          <p className="text-4xs text-muted-foreground/80 mt-1 select-none">
            Expand cards inline to configure fields. Hover between questions to insert a specific type at that index.
          </p>
        </div>

        {/* Empty State */}
        {fields.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-border/70 rounded-2xl bg-card/45 select-none space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-xs font-bold text-foreground">Your canvas is empty</p>
              <p className="text-4xs text-muted-foreground max-w-[220px]">
                Click on any field type in the Left Palette to begin building your form schema.
              </p>
            </div>
          </div>
        )}

        {/* Fields Accordion Stack */}
        <div className="space-y-4">
          {fields.map((field, idx) => {
            const isInsertOpen = insertIndex === idx;

            return (
              <React.Fragment key={field.id}>
                {/* 1. Glowing Inline Divider before every item */}
                <div className="relative h-4 group flex items-center justify-center">
                  <div className="absolute inset-x-0 h-px bg-border/40 group-hover:bg-primary/45 transition-colors" />
                  
                  {/* Circled "+" Button Trigger */}
                  <button
                    onClick={() => setInsertIndex(isInsertOpen ? null : idx)}
                    className="relative z-10 w-6 h-6 rounded-full border border-border bg-card group-hover:border-primary/50 group-hover:text-primary transition-all flex items-center justify-center text-muted-foreground cursor-pointer shadow-sm group-hover:scale-115"
                    title="Insert Question Here"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  {/* Inline Insert Selection Panel */}
                  {isInsertOpen && (
                    <div className="absolute top-7 z-30 w-full max-w-lg p-3 rounded-xl border border-border bg-card shadow-xl p-3 grid grid-cols-5 gap-1.5 animate-scale-in text-center">
                      <p className="col-span-5 text-5xs font-black uppercase text-muted-foreground tracking-widest pb-1 border-b border-border/40 mb-1">
                        Select Field to Insert
                      </p>
                      {fieldTypesList.map((item) => (
                        <button
                          key={item.type}
                          onClick={() => {
                            onAddField(item.type, idx);
                            setInsertIndex(null);
                          }}
                          className="px-1 py-1.5 rounded-lg border border-border bg-card hover:bg-primary/10 hover:border-primary/30 hover:text-primary text-5xs font-extrabold transition-all cursor-pointer"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Field Editor Card */}
                <FieldEditor
                  field={field}
                  isExpanded={expandedId === field.id}
                  onToggleExpand={() => handleToggleExpand(field.id)}
                  onUpdateField={(updated) => onUpdateField(field.id, updated)}
                  onDeleteField={() => onDeleteField(field.id)}
                />
              </React.Fragment>
            );
          })}

          {/* Inline insert divider at the very bottom if fields exist */}
          {fields.length > 0 && (
            <div className="relative h-4 group flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-border/40 group-hover:bg-primary/45 transition-colors" />
              <button
                onClick={() => setInsertIndex(insertIndex === fields.length ? null : fields.length)}
                className="relative z-10 w-6 h-6 rounded-full border border-border bg-card group-hover:border-primary/50 group-hover:text-primary transition-all flex items-center justify-center text-muted-foreground cursor-pointer shadow-sm group-hover:scale-115"
                title="Insert Question at End"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              {insertIndex === fields.length && (
                <div className="absolute top-7 z-30 w-full max-w-lg p-3 rounded-xl border border-border bg-card shadow-xl p-3 grid grid-cols-5 gap-1.5 animate-scale-in text-center">
                  <p className="col-span-5 text-5xs font-black uppercase text-muted-foreground tracking-widest pb-1 border-b border-border/40 mb-1">
                    Select Field to Insert
                  </p>
                  {fieldTypesList.map((item) => (
                    <button
                      key={item.type}
                      onClick={() => {
                        onAddField(item.type, fields.length);
                        setInsertIndex(null);
                      }}
                      className="px-1 py-1.5 rounded-lg border border-border bg-card hover:bg-primary/10 hover:border-primary/30 hover:text-primary text-5xs font-extrabold transition-all cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

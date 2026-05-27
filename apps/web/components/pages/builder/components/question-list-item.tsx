"use client";

import React from "react";
import { Trash2, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormField } from "@repo/trpc/server/schemas/form-field-schemas";
import QuestionTypeBadge from "./question-type-badge";

interface QuestionListItemProps {
  field: FormField;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function QuestionListItem({
  field,
  index,
  isSelected,
  onSelect,
  onDelete,
}: QuestionListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 999 : undefined,
    position: isDragging ? "relative" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => !isDragging && onSelect(field.id)}
      className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150 select-none ${
        isSelected
          ? "bg-primary/10 border border-primary/30 text-foreground"
          : "hover:bg-muted/50 border border-transparent text-muted-foreground hover:text-foreground"
      } ${isDragging ? "shadow-lg ring-2 ring-primary/30 bg-card border-primary/30" : ""}`}
    >
      {/* Drag handle */}
      <div
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="opacity-0 group-hover:opacity-40 cursor-grab active:cursor-grabbing shrink-0 hover:!opacity-70 transition-opacity touch-none"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      {/* Number */}
      <span className="font-mono text-4xs font-bold tabular-nums text-muted-foreground/40 w-4 shrink-0">
        {index + 1}
      </span>

      {/* Type badge */}
      <QuestionTypeBadge type={field.type} size="sm" />

      {/* Label */}
      <p className="flex-1 text-xs font-semibold truncate leading-tight">
        {field.label || "Untitled question"}
      </p>

      {/* Delete action */}
      <button
        title="Delete question"
        onClick={(e) => {
          e.stopPropagation();
          if (confirm("Delete this question?")) onDelete(field.id);
        }}
        className="opacity-0 group-hover:opacity-60 hover:!opacity-100 p-1 rounded-lg hover:bg-destructive/15 hover:text-destructive transition-all shrink-0 cursor-pointer"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

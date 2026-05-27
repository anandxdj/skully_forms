"use client";

import React, { useMemo } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FormField, FormFieldType } from "@repo/trpc/server/schemas/form-field-schemas";
import QuestionListItem from "../components/question-list-item";
import AddContentButton from "../components/add-content-button";
import EndingsPanel from "../components/endings-panel";
import QuestionTypeBadge from "../components/question-type-badge";
import { GripVertical } from "lucide-react";

interface LeftPanelProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onAddField: (type: FormFieldType, insertIndex?: number) => void;
  onDeleteField: (id: string) => void;
  onReorderFields: (updated: FormField[]) => void;
}

/** Midpoint between two order values for fractional indexing */
function orderBetween(before: number | undefined, after: number | undefined): number {
  const b = before ?? 0;
  const a = after ?? b + 2000;
  return (b + a) / 2;
}

/** Ensure every field has an order value (initial load with no orders) */
function withOrders(fields: FormField[]): FormField[] {
  return fields.map((f, i) => ({ ...f, order: f.order ?? (i + 1) * 1000 }));
}

export default function LeftPanel({
  fields,
  selectedFieldId,
  onSelectField,
  onAddField,
  onDeleteField,
  onReorderFields,
}: LeftPanelProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sorted = useMemo(() => {
    return [...withOrders(fields)].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [fields]);

  const activeField = activeId ? sorted.find((f) => f.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = sorted.findIndex((f) => f.id === active.id);
    const overIndex = sorted.findIndex((f) => f.id === over.id);
    if (activeIndex === -1 || overIndex === -1) return;

    const movingDown = activeIndex < overIndex;

    // Calculate new fractional order for the dragged item only
    const beforeOrder = movingDown ? sorted[overIndex]?.order : sorted[overIndex - 1]?.order;
    const afterOrder = movingDown ? sorted[overIndex + 1]?.order : sorted[overIndex]?.order;
    const newOrder = orderBetween(beforeOrder, afterOrder);

    const updated = fields.map((f) =>
      f.id === active.id ? { ...f, order: newOrder } : f
    );
    onReorderFields(updated);
  };

  return (
    <div className="flex flex-col h-full w-[240px] border-r border-sidebar-border bg-sidebar shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-sidebar-border/60 shrink-0 flex items-center gap-2">
        <p className="text-4xs font-black uppercase text-muted-foreground/50 tracking-widest">
          Questions
        </p>
        {fields.length > 0 && (
          <span className="font-mono text-4xs font-bold text-muted-foreground/30">
            {fields.length}
          </span>
        )}
      </div>

      {/* Sortable question list — `min-h-0` is the load-bearing class: without
          it the flex column can't shrink the ScrollArea and the inner viewport
          never scrolls when the list overflows. */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-2 py-2 space-y-0.5">
          {fields.length === 0 ? (
            <p className="text-xs text-muted-foreground/40 text-center py-8 px-4">
              No questions yet
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sorted.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                {sorted.map((field, idx) => (
                  <QuestionListItem
                    key={field.id}
                    field={field}
                    index={idx}
                    isSelected={selectedFieldId === field.id}
                    onSelect={onSelectField}
                    onDelete={onDeleteField}
                  />
                ))}
              </SortableContext>

              {/* Floating drag overlay */}
              <DragOverlay>
                {activeField ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-card border border-primary/40 shadow-xl ring-2 ring-primary/20 text-foreground opacity-95">
                    <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                    <span className="font-mono text-4xs font-bold text-muted-foreground/40 w-4 shrink-0">
                      #
                    </span>
                    <QuestionTypeBadge type={activeField.type} size="sm" />
                    <p className="flex-1 text-xs font-semibold truncate leading-tight">
                      {activeField.label || "Untitled question"}
                    </p>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </ScrollArea>

      {/* Add question button */}
      <div className="px-3 py-3 border-t border-border/30 shrink-0">
        <AddContentButton onSelectType={onAddField} variant="full-width" />
      </div>

      {/* Endings section */}
      <EndingsPanel />
    </div>
  );
}

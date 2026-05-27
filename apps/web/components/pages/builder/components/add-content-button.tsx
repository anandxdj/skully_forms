"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { FormFieldType } from "@repo/trpc/server/schemas/form-field-schemas";
import FieldTypePicker from "./field-type-picker";

interface AddContentButtonProps {
  onSelectType: (type: FormFieldType, insertIndex?: number) => void;
  insertIndex?: number;
  variant?: "full-width" | "compact";
}

export default function AddContentButton({
  onSelectType,
  insertIndex,
  variant = "full-width",
}: AddContentButtonProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (type: FormFieldType) => {
    onSelectType(type, insertIndex);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {variant === "full-width" ? (
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-muted-foreground border border-border/40 border-dashed rounded-xl hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer">
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Add question
          </button>
        ) : (
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-card border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 text-4xs font-bold uppercase tracking-widest cursor-pointer shadow-sm">
            <Plus className="w-3 h-3 stroke-[3]" />
            Insert
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent side="right" align="start" className="w-[280px] p-3">
        <p className="text-3xs font-black uppercase text-muted-foreground tracking-widest mb-3">
          Choose field type
        </p>
        <FieldTypePicker onSelect={handleSelect} columns={2} />
      </PopoverContent>
    </Popover>
  );
}

"use client";

import React from "react";
import { CheckCircle2, Plus } from "lucide-react";
import { Separator } from "~/components/ui/separator";

export default function EndingsPanel() {
  return (
    <div className="px-3 pb-3">
      <Separator className="mb-3" />
      <div className="flex items-center justify-between px-1 mb-2">
        <p className="text-4xs font-black uppercase text-muted-foreground/50 tracking-widest">
          Endings
        </p>
        <button
          title="Add ending screen"
          className="p-1 rounded-md text-muted-foreground/30 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-border/30 text-muted-foreground/40">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span className="text-xs font-medium">Default ending</span>
      </div>
    </div>
  );
}

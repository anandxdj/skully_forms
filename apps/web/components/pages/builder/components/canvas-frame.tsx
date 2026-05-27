"use client";

import React from "react";

interface CanvasFrameProps {
  children: React.ReactNode;
  className?: string;
}

export default function CanvasFrame({ children, className }: CanvasFrameProps) {
  return (
    <div
      className={`relative flex flex-col w-[375px] min-h-[600px] rounded-[2.5rem] border-[9px] border-foreground/20 bg-card shadow-2xl shadow-black/20 ring-1 ring-foreground/5 overflow-hidden ${className ?? ""}`}
    >
      {/* Phone notch with camera + speaker */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-foreground/15 rounded-b-2xl z-10 flex items-end justify-center pb-1.5 gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-foreground/35" />
        <div className="w-10 h-1 rounded-full bg-foreground/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-foreground/35" />
      </div>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-7 scrollbar-none">
        {children}
      </div>
    </div>
  );
}

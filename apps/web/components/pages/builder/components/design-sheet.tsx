"use client";

import React from "react";
import { Palette, Layout, CheckCircle2, Globe, Link as LinkIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { ScrollArea } from "~/components/ui/scroll-area";
import { LayoutMode, Theme, Visibility } from "@repo/trpc/server/schemas/form-schemas";
import { cn } from "~/lib/utils";
import { THEME_ILLUSTRATIONS } from "./theme-variables";

const THEME_OPTIONS: { id: Theme; label: string; desc: string; preview: string }[] = [
  { id: "slate",       label: "Midnight Slate",    desc: "Sleek monochrome dark",    preview: "from-zinc-900 to-zinc-700 border-zinc-600" },
  { id: "cyberpunk",   label: "Cyberpunk Neon",    desc: "Glowing neon on black",    preview: "from-black via-[#ff2e8c]/40 to-[#00f5ff]/40 border-pink-500" },
  { id: "sunset",      label: "Sunset Glow",       desc: "Warm burgundy and orange", preview: "from-amber-950 via-[#ff2e8c]/30 to-rose-700 border-orange-500" },
  { id: "forest",      label: "Deep Forest",       desc: "Organic emerald and sage", preview: "from-emerald-950 to-teal-800 border-emerald-500" },
  { id: "skullyLight",  label: "Cute Skully Pink",   desc: "Peach-pink pastel",          preview: "from-[#F5DCD0]/60 via-[#ED9194]/45 to-[#FAF8F5] border-[#ED9194]" },
  { id: "skullyDark",   label: "Gothic Skully Red",  desc: "Obsidian with crimson",      preview: "from-black via-[#E21D48]/35 to-[#131317] border-[#E21D48]" },
  { id: "skullyNeon",   label: "Neon Gaming",        desc: "Electric green on dark",     preview: "from-[#0a0a1a] via-[#00ff87]/30 to-[#0a0a1a] border-[#00ff87]" },
  { id: "skullyGold",   label: "Golden Skull",       desc: "Rich gold on near-black",    preview: "from-[#1a1000] via-[#c9a227]/40 to-[#1a0a00] border-[#c9a227]" },
  { id: "skullyGreen",  label: "Jungle Bones",       desc: "Deep jungle with leaf green", preview: "from-[#071a0a] via-[#4ade80]/30 to-[#071a0a] border-[#4ade80]" },
  { id: "skullyParty",  label: "Party Skeleton",     desc: "Hot pink celebration",       preview: "from-[#F5D0E8]/60 via-[#ec4899]/40 to-[#fdf4ff] border-[#ec4899]" },
];

interface DesignSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description: string | null;
  theme: Theme;
  layoutMode: LayoutMode;
  visibility?: Visibility;
  onUpdate: (s: { description?: string; theme?: Theme; layoutMode?: LayoutMode; visibility?: Visibility }) => void;
}

export default function DesignSheet({
  open,
  onOpenChange,
  description,
  theme,
  layoutMode,
  visibility = "PUBLIC",
  onUpdate,
}: DesignSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="border-b border-border/40">
          <SheetTitle className="flex items-center gap-2 text-base font-bold">
            <Palette className="w-4 h-4 text-primary" />
            Design
          </SheetTitle>
          <SheetDescription className="text-xs">
            Theme and layout for the whole form. Applied everywhere.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-5 space-y-8">
            {/* Theme */}
            <section className="space-y-3">
              <h3 className="text-3xs font-black uppercase text-muted-foreground tracking-widest">
                Theme
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {THEME_OPTIONS.map((opt) => {
                  const isSelected = theme === opt.id;
                  const illus = THEME_ILLUSTRATIONS[opt.id];
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onUpdate({ theme: opt.id })}
                      className={cn(
                        "w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer",
                        isSelected
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-card border-border/50 hover:border-border"
                      )}
                    >
                      <div
                        className={cn(
                          "relative w-10 h-10 rounded-lg bg-gradient-to-tr border shadow-inner shrink-0 overflow-hidden",
                          opt.preview
                        )}
                      >
                        {illus?.skeleton && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={illus.skeleton}
                            alt=""
                            className="absolute bottom-0 right-0 w-8 h-9 object-contain object-bottom"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-xs font-bold", isSelected ? "text-primary" : "text-foreground")}>
                          {opt.label}
                        </p>
                        <p className="text-4xs text-muted-foreground/70 mt-0.5 truncate">
                          {opt.desc}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Layout */}
            <section className="space-y-3">
              <h3 className="text-3xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                <Layout className="w-3 h-3" />
                Layout
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(["SCROLL", "SLIDE"] as const).map((mode) => {
                  const isSelected = layoutMode === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => onUpdate({ layoutMode: mode })}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all cursor-pointer",
                        isSelected
                          ? "bg-primary/5 border-primary text-primary"
                          : "bg-card border-border/50 hover:border-border text-muted-foreground"
                      )}
                    >
                      <p className="text-xs font-bold">
                        {mode === "SCROLL" ? "Scroll" : "Slide"}
                      </p>
                      <p className="text-4xs mt-1 text-muted-foreground/70">
                        {mode === "SCROLL" ? "All on one page" : "One at a time"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Visibility */}
            <section className="space-y-3">
              <h3 className="text-3xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                <Globe className="w-3 h-3" />
                Visibility
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: "PUBLIC" as const, icon: Globe, label: "Public", desc: "Listed in explore" },
                  { id: "UNLISTED" as const, icon: LinkIcon, label: "Unlisted", desc: "Link-only" },
                ]).map((opt) => {
                  const isSelected = visibility === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onUpdate({ visibility: opt.id })}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all cursor-pointer",
                        isSelected
                          ? "bg-primary/5 border-primary text-primary"
                          : "bg-card border-border/50 hover:border-border text-muted-foreground"
                      )}
                    >
                      <opt.icon className="w-3 h-3 mb-1" />
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="text-4xs mt-0.5 text-muted-foreground/70">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Description */}
            <section className="space-y-2">
              <h3 className="text-3xs font-black uppercase text-muted-foreground tracking-widest">
                Form description
              </h3>
              <textarea
                value={description || ""}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Tell respondents what this form is about..."
                rows={3}
                className="w-full bg-card border border-border/60 rounded-xl text-xs p-3 outline-none focus:border-primary text-foreground resize-none transition-colors"
              />
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

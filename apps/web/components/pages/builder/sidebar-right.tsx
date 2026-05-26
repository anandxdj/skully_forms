"use client";

import React from "react";
import {
  Settings,
  Palette,
  Layout,
  ShieldAlert,
  Webhook,
  Sparkles,
} from "lucide-react";
import {
  LayoutMode,
  Theme,
  SubmissionMode,
} from "@repo/trpc/server/schemas/form-schemas";

interface SidebarRightProps {
  title: string;
  description: string | null;
  theme: Theme;
  layoutMode: LayoutMode;
  submissionMode: SubmissionMode;
  webhookUrl: string | null;
  onUpdateSettings: (settings: {
    title?: string;
    description?: string;
    theme?: Theme;
    layoutMode?: LayoutMode;
    submissionMode?: SubmissionMode;
    webhookUrl?: string;
  }) => void;
}

const THEME_OPTIONS: { id: Theme; label: string; desc: string; preview: string }[] = [
  {
    id: "slate",
    label: "Midnight Slate",
    desc: "Sleek, monochrome dark grey elegance",
    preview: "from-zinc-900 to-zinc-700 border-zinc-600",
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk Neon",
    desc: "Black backdrop with glowing neon pink & blue",
    preview: "from-black via-[#ff2e8c]/40 to-[#00f5ff]/40 border-pink-500",
  },
  {
    id: "sunset",
    label: "Sunset Glow",
    desc: "Rich deep burgundy and orange-pink warmth",
    preview: "from-amber-950 via-[#ff2e8c]/30 to-rose-700 border-orange-500",
  },
  {
    id: "forest",
    label: "Deep Forest",
    desc: "Organic emerald shades and sage accents",
    preview: "from-emerald-950 to-teal-800 border-emerald-500",
  },
  {
    id: "skullyLight",
    label: "Cute Skully Pink",
    desc: "Warm peach-pink pastel with cute skull illustrations",
    preview: "from-[#F5DCD0]/60 via-[#ED9194]/45 to-[#FAF8F5] border-[#ED9194]",
  },
  {
    id: "skullyDark",
    label: "Gothic Skully Red",
    desc: "Obsidian backdrop with crimson-glowing elements",
    preview: "from-black via-[#E21D48]/35 to-[#131317] border-[#E21D48]",
  },
];

export default function SidebarRight({
  title,
  description,
  theme,
  layoutMode,
  submissionMode,
  webhookUrl,
  onUpdateSettings,
}: SidebarRightProps) {
  return (
    <aside className="w-80 border-l border-border/50 bg-card/20 backdrop-blur-md p-5 flex flex-col h-full overflow-y-auto select-none shrink-0 scrollbar-none space-y-6">
      
      {/* 1. Form Information */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
          <Settings className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Form Details
          </h3>
        </div>
        
        <div className="space-y-3 text-left">
          <div className="space-y-1">
            <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest">
              Form Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => onUpdateSettings({ title: e.target.value })}
              placeholder="Form title"
              className="w-full bg-card border border-border/60 rounded-lg text-xs py-2 px-2.5 outline-none focus:border-primary text-foreground transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest">
              Description
            </label>
            <textarea
              value={description || ""}
              onChange={(e) => onUpdateSettings({ description: e.target.value })}
              placeholder="Provide a form description..."
              rows={3}
              className="w-full bg-card border border-border/60 rounded-lg text-xs p-2.5 outline-none focus:border-primary text-foreground transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Visual Theming */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
          <Palette className="w-4 h-4 text-[#ff2e8c]" />
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Visual Theme
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2.5 text-left">
          {THEME_OPTIONS.map((opt) => {
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onUpdateSettings({ theme: opt.id })}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer group ${
                  isSelected
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-card border-border hover:border-muted-foreground/45"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg bg-gradient-to-tr border shadow-inner shrink-0 ${opt.preview}`}
                />
                <div className="min-w-0">
                  <p className={`text-4xs font-black ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {opt.label}
                  </p>
                  <p className="text-5xs text-muted-foreground/80 truncate max-w-[170px] mt-0.5">
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Layout Rendering */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
          <Layout className="w-4 h-4 text-[#00f5ff]" />
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Form Layout
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center select-none">
          <button
            onClick={() => onUpdateSettings({ layoutMode: "SCROLL" })}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              layoutMode === "SCROLL"
                ? "bg-primary/10 border-primary text-primary"
                : "bg-card border-border hover:border-muted-foreground/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            Scroll Mode
          </button>
          <button
            onClick={() => onUpdateSettings({ layoutMode: "SLIDE" })}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              layoutMode === "SLIDE"
                ? "bg-primary/10 border-primary text-primary"
                : "bg-card border-border hover:border-muted-foreground/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            Slide Mode
          </button>
        </div>
      </div>

      {/* 4. Submission & Auth Rules */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Security & Auth
          </h3>
        </div>

        <div className="space-y-2 text-left">
          <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest">
            Submission Filter
          </label>
          <div className="flex flex-col gap-1.5">
            {([
              { id: "ANONYMOUS", label: "Anonymous Only", desc: "No authentication, hash fingerprinting" },
              { id: "AUTHENTICATED", label: "Authenticated Only", desc: "Enforce JWT developer login" },
              { id: "BOTH", label: "Public & Authenticated", desc: "Allow standard bypass logins" },
            ] as const).map((mode) => {
              const isSelected = submissionMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => onUpdateSettings({ submissionMode: mode.id })}
                  className={`w-full p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-primary/5 border-primary text-primary"
                      : "bg-card border-border hover:border-muted-foreground/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <p className="text-4xs font-black">{mode.label}</p>
                  <p className="text-5xs text-muted-foreground/75 mt-0.5">{mode.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Webhook Submissions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
          <Webhook className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Webhook Delivery
          </h3>
        </div>

        <div className="space-y-1.5 text-left pb-4">
          <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest flex items-center justify-between">
            <span>Webhook URL</span>
            {webhookUrl ? (
              <span className="text-5xs text-emerald-500 font-bold uppercase">Active</span>
            ) : (
              <span className="text-5xs text-muted-foreground/60 font-bold uppercase">Disabled</span>
            )}
          </label>
          <input
            type="url"
            value={webhookUrl || ""}
            onChange={(e) => onUpdateSettings({ webhookUrl: e.target.value })}
            placeholder="e.g. https://api.myserver.com/webhooks"
            className="w-full bg-card border border-border/60 rounded-lg text-xs py-2 px-2.5 outline-none focus:border-primary text-foreground transition-colors font-mono"
          />
        </div>
      </div>

    </aside>
  );
}

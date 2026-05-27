"use client";

import React from "react";
import {
  ArrowLeft,
  Eye,
  Globe,
  Lock,
  Palette,
  Layout,
  ShieldAlert,
  Webhook,
  CheckCircle2,
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
  published: boolean;
  initialFormSlug?: string;
  onUpdateSettings: (settings: {
    title?: string;
    description?: string;
    theme?: Theme;
    layoutMode?: LayoutMode;
    submissionMode?: SubmissionMode;
    webhookUrl?: string;
  }) => void;
  onPublishToggle: () => void;
  onClose: () => void;
}

const THEME_OPTIONS: { id: Theme; label: string; desc: string; preview: string }[] = [
  { id: "slate",      label: "Midnight Slate",   desc: "Sleek monochrome dark",           preview: "from-zinc-900 to-zinc-700 border-zinc-600" },
  { id: "cyberpunk",  label: "Cyberpunk Neon",   desc: "Glowing neon on black",           preview: "from-black via-[#ff2e8c]/40 to-[#00f5ff]/40 border-pink-500" },
  { id: "sunset",     label: "Sunset Glow",      desc: "Warm burgundy and orange",        preview: "from-amber-950 via-[#ff2e8c]/30 to-rose-700 border-orange-500" },
  { id: "forest",     label: "Deep Forest",      desc: "Organic emerald and sage",        preview: "from-emerald-950 to-teal-800 border-emerald-500" },
  { id: "skullyLight",label: "Cute Skully Pink", desc: "Peach-pink pastel",              preview: "from-[#F5DCD0]/60 via-[#ED9194]/45 to-[#FAF8F5] border-[#ED9194]" },
  { id: "skullyDark", label: "Gothic Skully Red",desc: "Obsidian with crimson glow",      preview: "from-black via-[#E21D48]/35 to-[#131317] border-[#E21D48]" },
];

export default function SidebarRight({
  title,
  description,
  theme,
  layoutMode,
  submissionMode,
  webhookUrl,
  published,
  initialFormSlug,
  onUpdateSettings,
  onPublishToggle,
  onClose,
}: SidebarRightProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in flex flex-col">
      {/* Top nav */}
      <header className="shrink-0 h-14 px-6 border-b border-border/40 flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to builder
        </button>

        <div className="flex items-center gap-3">
          {/* Draft/live status pill */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-3xs font-bold uppercase tracking-widest border transition-colors ${
            published
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
              : "bg-muted border-border text-muted-foreground"
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${published ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/50"}`} />
            {published ? "Live" : "Draft"}
          </div>

          {/* Toggle publish */}
          <button
            onClick={onPublishToggle}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              published
                ? "bg-muted border border-border text-muted-foreground hover:text-foreground"
                : "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20"
            }`}
          >
            {published ? (
              <><Lock className="w-3.5 h-3.5" /> Set to Draft</>
            ) : (
              <><Globe className="w-3.5 h-3.5" /> Publish Now</>
            )}
          </button>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">

          {/* Section header */}
          <div>
            <h1 className="text-xl font-bold text-foreground">Publish settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure how your form looks and behaves before going live.
            </p>
          </div>

          {/* — Form details — */}
          <section className="space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
              <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              </div>
              <h2 className="text-sm font-bold text-foreground">Form details</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-3xs font-black uppercase text-muted-foreground tracking-widest">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => onUpdateSettings({ title: e.target.value })}
                  placeholder="Your form title"
                  className="w-full bg-card border border-border/60 rounded-xl text-sm py-2.5 px-3.5 outline-none focus:border-primary text-foreground transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-3xs font-black uppercase text-muted-foreground tracking-widest">Description</label>
                <textarea
                  value={description || ""}
                  onChange={(e) => onUpdateSettings({ description: e.target.value })}
                  placeholder="Tell respondents what this form is about..."
                  rows={3}
                  className="w-full bg-card border border-border/60 rounded-xl text-sm p-3.5 outline-none focus:border-primary text-foreground transition-colors resize-none"
                />
              </div>
            </div>
          </section>

          {/* — Visual theme — */}
          <section className="space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
              <div className="w-5 h-5 rounded-md bg-[#ff2e8c]/10 flex items-center justify-center">
                <Palette className="w-3.5 h-3.5 text-[#ff2e8c]" />
              </div>
              <h2 className="text-sm font-bold text-foreground">Visual theme</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEME_OPTIONS.map((opt) => {
                const isSelected = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onUpdateSettings({ theme: opt.id })}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer group ${
                      isSelected
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-card border-border/50 hover:border-border"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr border shadow-inner shrink-0 ${opt.preview}`} />
                    <div className="min-w-0">
                      <p className={`text-xs font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>{opt.label}</p>
                      <p className="text-4xs text-muted-foreground/70 mt-0.5 truncate">{opt.desc}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-primary ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* — Layout mode — */}
          <section className="space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
              <div className="w-5 h-5 rounded-md bg-sky-500/10 flex items-center justify-center">
                <Layout className="w-3.5 h-3.5 text-sky-500" />
              </div>
              <h2 className="text-sm font-bold text-foreground">Layout mode</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(["SCROLL", "SLIDE"] as const).map((mode) => {
                const isSelected = layoutMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => onUpdateSettings({ layoutMode: mode })}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected ? "bg-primary/5 border-primary text-primary" : "bg-card border-border/50 hover:border-border text-muted-foreground"
                    }`}
                  >
                    <p className="text-xs font-bold">{mode === "SCROLL" ? "Scroll" : "Slide"}</p>
                    <p className="text-4xs mt-1 text-muted-foreground/70">
                      {mode === "SCROLL" ? "All questions on one page" : "One question at a time"}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* — Submission rules — */}
          <section className="space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
              <div className="w-5 h-5 rounded-md bg-amber-500/10 flex items-center justify-center">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <h2 className="text-sm font-bold text-foreground">Submission rules</h2>
            </div>

            <div className="space-y-2">
              {(
                [
                  { id: "ANONYMOUS",     label: "Anyone",                   desc: "No authentication required" },
                  { id: "AUTHENTICATED", label: "Signed-in users only",     desc: "Enforce JWT authentication" },
                  { id: "BOTH",          label: "Both",                     desc: "Allow all access modes" },
                ] as const
              ).map((mode) => {
                const isSelected = submissionMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => onUpdateSettings({ submissionMode: mode.id })}
                    className={`w-full p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      isSelected ? "bg-primary/5 border-primary text-primary" : "bg-card border-border/50 hover:border-border text-muted-foreground"
                    }`}
                  >
                    <p className="text-xs font-bold">{mode.label}</p>
                    <p className="text-4xs text-muted-foreground/70 mt-0.5">{mode.desc}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* — Webhook — */}
          <section className="space-y-5 pb-10">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
              <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center">
                <Webhook className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <h2 className="text-sm font-bold text-foreground">Webhook delivery</h2>
                {webhookUrl ? (
                  <span className="text-4xs text-emerald-500 font-bold uppercase tracking-widest">Active</span>
                ) : (
                  <span className="text-4xs text-muted-foreground/50 font-bold uppercase tracking-widest">Off</span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-3xs font-black uppercase text-muted-foreground tracking-widest">Endpoint URL</label>
              <input
                type="url"
                value={webhookUrl || ""}
                onChange={(e) => onUpdateSettings({ webhookUrl: e.target.value })}
                placeholder="https://api.yourserver.com/webhook"
                className="w-full bg-card border border-border/60 rounded-xl text-sm py-2.5 px-3.5 outline-none focus:border-primary text-foreground font-mono transition-colors"
              />
              <p className="text-3xs text-muted-foreground/60">
                We&apos;ll POST every new submission to this URL as JSON.
              </p>
            </div>
          </section>

        </div>
      </div>

      {/* Footer actions */}
      <div className="shrink-0 border-t border-border/40 bg-card/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          Save &amp; return to builder
        </button>

        {published && initialFormSlug ? (
          <a
            href={`/form/${initialFormSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
          >
            <Eye className="w-3.5 h-3.5" />
            View live form
          </a>
        ) : (
          <button
            onClick={onPublishToggle}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-primary/20 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            Publish now
          </button>
        )}
      </div>
    </div>
  );
}

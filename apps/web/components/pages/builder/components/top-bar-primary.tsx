"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Link2,
  Globe,
  Lock,
} from "lucide-react";
import { cn } from "~/lib/utils";

export type BuilderTab = "content" | "connect" | "share" | "results";

interface TopBarPrimaryProps {
  formId: string;
  formTitle: string;
  onTitleChange: (next: string) => void;
  activeTab: BuilderTab;
  onTabChange: (tab: BuilderTab) => void;
  savingStatus: "idle" | "saving" | "saved" | "error";
  published: boolean;
  onPublishClick: () => void;
  onShareClick: () => void;
}

const TABS: { key: BuilderTab; label: string }[] = [
  { key: "content", label: "Content" },
  { key: "connect", label: "Connect" },
  { key: "share", label: "Share" },
  { key: "results", label: "Results" },
];

export default function TopBarPrimary({
  formId,
  formTitle,
  onTitleChange,
  activeTab,
  onTabChange,
  savingStatus,
  published,
  onPublishClick,
  onShareClick,
}: TopBarPrimaryProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(formTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(formTitle);
  }, [formTitle, editing]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    const next = draft.trim();
    if (next && next !== formTitle) onTitleChange(next);
    else setDraft(formTitle);
    setEditing(false);
  };

  const handleTabClick = (tab: BuilderTab) => {
    if (tab === "results") return;
    onTabChange(tab);
  };

  return (
    <header className="shrink-0 h-12 px-4 border-b border-border/40 bg-background flex items-center justify-between gap-4 z-30">
      {/* Left: breadcrumb + title */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Link
          href="/dashboard"
          className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          Forms
        </Link>
        <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraft(formTitle);
                setEditing(false);
              }
            }}
            className="text-xs font-bold bg-transparent border border-primary/40 rounded-md px-1.5 py-0.5 outline-none focus:border-primary text-foreground min-w-0 max-w-xs"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-bold text-foreground truncate max-w-40 sm:max-w-xs hover:bg-muted/60 rounded-md px-1.5 py-0.5 transition-colors cursor-text"
            title="Click to rename"
          >
            {formTitle || "Untitled form"}
          </button>
        )}

        {/* Save indicator */}
        <div className="flex items-center gap-1 ml-1 select-none shrink-0">
          {savingStatus === "saving" && (
            <Loader2 className="w-3 h-3 text-muted-foreground/50 animate-spin" />
          )}
          {savingStatus === "saved" && (
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          )}
          {savingStatus === "idle" && (
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
          )}
          {savingStatus === "error" && (
            <AlertCircle className="w-3 h-3 text-destructive" />
          )}
        </div>
      </div>

      {/* Center: tab switcher */}
      <nav className="flex items-center gap-0.5 shrink-0">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const isResults = tab.key === "results";
          const inner = (
            <span
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute left-2 right-2 -bottom-[13px] h-[2px] bg-primary rounded-full" />
              )}
            </span>
          );
          return isResults ? (
            <Link key={tab.key} href={`/responses/${formId}`}>
              {inner}
            </Link>
          ) : (
            <button key={tab.key} onClick={() => handleTabClick(tab.key)}>
              {inner}
            </button>
          );
        })}
      </nav>

      {/* Right: share + publish + (placeholder avatar) */}
      <div className="flex items-center gap-1.5 flex-1 justify-end">
        <button
          onClick={onShareClick}
          className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          title="Share link"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>

        {published && (
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full text-3xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </div>
        )}

        <button
          onClick={onPublishClick}
          className={cn(
            "inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer",
            published
              ? "bg-muted border border-border text-muted-foreground hover:text-foreground"
              : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm shadow-primary/20"
          )}
        >
          {published ? (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unpublish</span>
            </>
          ) : (
            <>
              <Globe className="w-3.5 h-3.5" />
              <span>Publish</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  BarChart3,
  ListCollapse,
  FolderHeart,
  RefreshCw,
} from "lucide-react";
import { trpc } from "~/trpc/client";
import { toast } from "sonner";
import { FormField } from "@repo/trpc/server/schemas/form-field-schemas";

import TabAnalytics from "./tab-analytics";
import TabSubmissions from "./tab-submissions";
import TabGallery from "./tab-gallery";

interface ResponsesPageViewProps {
  formId: string;
}

type TabType = "analytics" | "submissions" | "gallery";

export default function ResponsesPageView({ formId }: ResponsesPageViewProps) {
  // 1. Fetch form metadata details (to resolve question labels)
  const { data: form, isLoading, error } = trpc.forms.getForm.useQuery(
    { formId },
    { refetchOnWindowFocus: false, retry: 1 }
  );

  // 2. Setup Rebuild Cache Mutation
  const rebuildCacheMutation = trpc.submissions.rebuildFormAnalytics.useMutation({
    onSuccess: () => {
      toast.success("Submissions cache rebuilt successfully.");
      // Trigger a page refresh/query update
      window.location.reload();
    },
    onError: (err) => {
      toast.error(`Rebuild failed: ${err.message}`);
    },
  });

  // 3. Tab coordinator state
  const [activeTab, setActiveTab] = useState<TabType>("analytics");

  const handleRebuildCache = () => {
    rebuildCacheMutation.mutate({ formId });
  };

  // Loader
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-xs font-mono font-bold mt-4 animate-pulse">Resolving form details...</p>
      </div>
    );
  }

  // Error page
  if (error || !form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Failed to load responses</h2>
          <p className="text-xs text-muted-foreground max-w-sm">
            {error?.message || "Form might be deleted, or there was a database credential error."}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground border border-border px-4 py-2 rounded-xl bg-card hover:bg-muted/50 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col relative w-full">
      <div className="max-w-6xl w-full mx-auto px-6 py-8 sm:px-8 space-y-8 flex-1 flex flex-col">
        
        {/* 1. TOP HEADER SHELL */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5 select-none shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="h-5 w-px bg-border/60 shrink-0" />
            
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-foreground truncate pr-2">
                  {form.title}
                </h1>
                <span className="px-2 py-0.5 rounded text-5xs font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shrink-0">
                  {form.published ? "🟢 Live" : "⚪ Draft"}
                </span>
              </div>
              <p className="text-4xs text-muted-foreground/85 font-mono mt-1 tracking-wider truncate">
                FORM_ID: {formId}
              </p>
            </div>
          </div>

          {/* Rebuild Cache button action */}
          <button
            onClick={handleRebuildCache}
            disabled={rebuildCacheMutation.isPending}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold text-foreground border border-border bg-card hover:bg-muted rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {rebuildCacheMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Rebuilding Cache...
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                Rebuild Cache
              </>
            )}
          </button>
        </header>

        {/* 2. TAB TOGGLER SELECTION ROW */}
        <div className="flex space-x-1.5 border-b border-border/50 pb-px shrink-0 select-none">
          {([
            { id: "analytics", label: "Analytics Overview", icon: BarChart3 },
            { id: "submissions", label: "Submissions Table", icon: ListCollapse },
            { id: "gallery", label: "File Gallery", icon: FolderHeart },
          ] as const).map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3.5 border-b-2 text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. ACTIVE TAB COMPONENT WRAPPER */}
        <div className="flex-1">
          {activeTab === "analytics" && <TabAnalytics formId={formId} />}
          {activeTab === "submissions" && (
            <TabSubmissions formId={formId} fields={form.fields as FormField[]} />
          )}
          {activeTab === "gallery" && (
            <TabGallery formId={formId} fields={form.fields as FormField[]} />
          )}
        </div>

      </div>
    </div>
  );
}

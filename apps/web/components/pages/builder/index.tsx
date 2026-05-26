"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Skull,
  ArrowLeft,
  Eye,
  Globe,
  Lock,
  CloudLightning,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { trpc } from "~/trpc/client";
import { toast } from "sonner";
import { FormField, FormFieldType } from "@repo/trpc/server/schemas/form-field-schemas";
import { LayoutMode, Theme, SubmissionMode } from "@repo/trpc/server/schemas/form-schemas";

import SidebarLeft from "./sidebar-left";
import SidebarRight from "./sidebar-right";
import Canvas from "./canvas";

interface BuilderPageViewProps {
  formId: string;
}

export default function BuilderPageView({ formId }: BuilderPageViewProps) {
  // 1. Fetch current form configuration
  const { data: initialForm, isLoading, error, refetch } = trpc.forms.getForm.useQuery(
    { formId },
    { refetchOnWindowFocus: false, retry: 1 }
  );

  // 2. Setup Update Form Mutation
  const updateFormMutation = trpc.forms.updateForm.useMutation({
    onSuccess: () => {
      setSavingStatus("saved");
      setTimeout(() => setSavingStatus("idle"), 1500);
    },
    onError: (err) => {
      setSavingStatus("error");
      toast.error(`Auto-save failed: ${err.message}`);
    },
  });

  // 3. Local editor states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | null>("");
  const [theme, setTheme] = useState<Theme>("slate");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("SCROLL");
  const [submissionMode, setSubmissionMode] = useState<SubmissionMode>("ANONYMOUS");
  const [webhookUrl, setWebhookUrl] = useState<string | null>("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [published, setPublished] = useState(false);

  // Auto-save tracker states
  const [savingStatus, setSavingStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const isFirstRender = useRef(true);
  const isDirty = useRef(false);

  // 4. Initialize states when query returns data
  useEffect(() => {
    if (initialForm) {
      setTitle(initialForm.title);
      setDescription(initialForm.description);
      setTheme(initialForm.theme as Theme);
      setLayoutMode(initialForm.layoutMode as LayoutMode);
      setSubmissionMode(initialForm.submissionMode as SubmissionMode);
      setWebhookUrl(initialForm.webhookUrl);
      setFields(initialForm.fields as FormField[]);
      setPublished(!!initialForm.published);
      isFirstRender.current = true;
      isDirty.current = false;
    }
  }, [initialForm]);

  // 5. Debounced auto-save effect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!isDirty.current) {
      return;
    }

    setSavingStatus("saving");

    const timer = setTimeout(() => {
      updateFormMutation.mutate({
        formId,
        title,
        description: description || undefined,
        theme,
        layoutMode,
        submissionMode,
        webhookUrl: webhookUrl || "",
        fields,
        published,
      });
      isDirty.current = false;
    }, 1000); // 1-second debounce

    return () => clearTimeout(timer);
  }, [title, description, theme, layoutMode, submissionMode, webhookUrl, fields, published, formId]);

  // Helper to mark form as modified
  const markDirty = () => {
    isDirty.current = true;
  };

  // 6. Action Handlers
  const handleAddField = (type: FormFieldType, index?: number) => {
    const id = `field_${Math.random().toString(36).substring(2, 10)}`;
    let defaultField: FormField;

    const baseDefaults = {
      id,
      label: `Question Label (${type.toLowerCase()})`,
      placeholder: "Add helper placeholder...",
      required: false,
    };

    switch (type) {
      case "SELECT":
      case "RADIO":
      case "CHECKBOX":
        defaultField = {
          ...baseDefaults,
          type,
          options: ["Choice 1", "Choice 2"],
        };
        break;
      case "NUMBER":
        defaultField = {
          ...baseDefaults,
          type,
        };
        break;
      case "FILE":
        defaultField = {
          ...baseDefaults,
          type,
          accept: "any",
          maxSizeMB: 10,
        };
        break;
      case "RATING":
        defaultField = {
          ...baseDefaults,
          type,
          maxStars: 5,
        };
        break;
      default:
        defaultField = {
          ...baseDefaults,
          type: type as any,
        };
    }

    let updatedFields: FormField[];
    if (typeof index === "number") {
      updatedFields = [...fields];
      updatedFields.splice(index, 0, defaultField);
    } else {
      updatedFields = [...fields, defaultField];
    }

    setFields(updatedFields);
    markDirty();
    toast.success(`Appended new ${type.toLowerCase()} field.`);
  };

  const handleUpdateField = (id: string, updated: Partial<FormField>) => {
    setFields(
      fields.map((f) => {
        if (f.id === id) {
          return { ...f, ...updated } as FormField;
        }
        return f;
      })
    );
    markDirty();
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    markDirty();
    toast.success("Question deleted.");
  };

  const handleUpdateSettings = (settings: {
    title?: string;
    description?: string;
    theme?: Theme;
    layoutMode?: LayoutMode;
    submissionMode?: SubmissionMode;
    webhookUrl?: string;
  }) => {
    if (settings.title !== undefined) setTitle(settings.title);
    if (settings.description !== undefined) setDescription(settings.description);
    if (settings.theme !== undefined) setTheme(settings.theme);
    if (settings.layoutMode !== undefined) setLayoutMode(settings.layoutMode);
    if (settings.submissionMode !== undefined) setSubmissionMode(settings.submissionMode);
    if (settings.webhookUrl !== undefined) setWebhookUrl(settings.webhookUrl);
    markDirty();
  };

  const handlePublishToggle = () => {
    const nextPublished = !published;
    setPublished(nextPublished);
    isDirty.current = true;
    toast.info(nextPublished ? "Form is now live!" : "Form is now draft.");
  };

  // Render Loader
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-xs font-mono font-bold mt-4 animate-pulse">Loading form details...</p>
      </div>
    );
  }

  // Render Error state
  if (error || !initialForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Failed to load Form Builder</h2>
          <p className="text-xs text-muted-foreground max-w-sm">
            {error?.message || "Form might have been deleted, or there was a credential error."}
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
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans">
      
      {/* 1. TOP HEADER NAVIGATION */}
      <header className="h-16 px-6 border-b border-border/50 bg-card flex items-center justify-between select-none shrink-0 z-20">
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
            <h1 className="text-xs font-black text-foreground truncate pr-2">
              {title || "Draft Form Builder"}
            </h1>
            <p className="text-5xs text-muted-foreground font-mono mt-0.5 tracking-wider truncate">
              FORM_ID: {formId}
            </p>
          </div>
        </div>

        {/* Action Controls & Saving status */}
        <div className="flex items-center gap-4">
          
          {/* Saving Status Indicators */}
          <div className="flex items-center gap-1.5 select-none">
            {savingStatus === "saving" && (
              <>
                <Loader2 className="w-3 h-3 text-primary animate-spin" />
                <span className="text-5xs font-black uppercase text-primary animate-pulse">Saving...</span>
              </>
            )}
            {savingStatus === "saved" && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-5xs font-black uppercase text-emerald-500">Saved</span>
              </>
            )}
            {savingStatus === "idle" && (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                <span className="text-5xs font-black uppercase text-muted-foreground/80">Synced</span>
              </>
            )}
            {savingStatus === "error" && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                <span className="text-5xs font-black uppercase text-destructive">Save Failed</span>
              </>
            )}
          </div>

          <span className="h-5 w-px bg-border/60" />

          {/* Test Live Preview */}
          {published ? (
            <a
              href={`/form/${initialForm.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-foreground border border-border bg-background hover:bg-muted/80 rounded-xl transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Form
            </a>
          ) : (
            <button
              onClick={() => toast.warning("Draft form cannot be previewed in a separate window. Toggle Publish first!")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-muted-foreground/50 border border-border bg-background cursor-not-allowed rounded-xl"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Form
            </button>
          )}

          {/* Toggle Live publishing status */}
          <button
            onClick={handlePublishToggle}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md ${
              published
                ? "bg-[#ff2e8c]/10 border border-[#ff2e8c]/35 text-[#ff2e8c] shadow-[#ff2e8c]/5"
                : "bg-primary text-primary-foreground hover:opacity-95 shadow-primary/10"
            }`}
          >
            {published ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                Draft Mode
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5" />
                Publish Live
              </>
            )}
          </button>

        </div>
      </header>

      {/* 2. THREE PANEL WORKSPACE GRID */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Inventory Palette */}
        <SidebarLeft onAddField={handleAddField} />

        {/* Center Reactive Canvas */}
        <Canvas
          fields={fields}
          onAddField={handleAddField}
          onUpdateField={handleUpdateField}
          onDeleteField={handleDeleteField}
        />

        {/* Right Settings panel */}
        <SidebarRight
          title={title}
          description={description}
          theme={theme}
          layoutMode={layoutMode}
          submissionMode={submissionMode}
          webhookUrl={webhookUrl}
          onUpdateSettings={handleUpdateSettings}
        />

      </div>

    </div>
  );
}

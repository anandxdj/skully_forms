"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { trpc } from "~/trpc/client";
import { toast } from "sonner";
import { FormField, FormFieldType } from "@repo/trpc/server/schemas/form-field-schemas";
import { LayoutMode, Theme, SubmissionMode, Visibility } from "@repo/trpc/server/schemas/form-schemas";

import { useRequireAuth } from "~/hooks/use-require-auth";
import TopBarPrimary, { BuilderTab } from "./components/top-bar-primary";
import TopBarSecondary, { DeviceMode } from "./components/top-bar-secondary";
import DesignSheet from "./components/design-sheet";
import SettingsSheet from "./components/settings-sheet";
import PreviewModal from "./components/preview-modal";
import PublishDialog from "./components/publish-dialog";
import LeftPanel from "./panels/left-panel";
import CanvasPanel from "./panels/canvas-panel";
import RightPanel from "./panels/right-panel";

interface BuilderPageViewProps {
  formId: string;
}

export default function BuilderPageView({ formId }: BuilderPageViewProps) {
  useRequireAuth();
  const { data: initialForm, isLoading, error } = trpc.forms.getForm.useQuery(
    { formId },
    { refetchOnWindowFocus: false, retry: 1 }
  );

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

  // ── Form state ────────────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | null>("");
  const [theme, setTheme] = useState<Theme>("skullyLight");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("SCROLL");
  const [submissionMode, setSubmissionMode] = useState<SubmissionMode>("ANONYMOUS");
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const [webhookUrl, setWebhookUrl] = useState<string | null>("");
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [published, setPublished] = useState(false);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<BuilderTab>("content");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDesignOpen, setIsDesignOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // ── Auto-save ─────────────────────────────────────────────────────────────
  const [savingStatus, setSavingStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const isFirstRender = useRef(true);
  const isDirty = useRef(false);

  useEffect(() => {
    if (initialForm) {
      setTitle(initialForm.title);
      setDescription(initialForm.description);
      setTheme(initialForm.theme as Theme);
      setLayoutMode(initialForm.layoutMode as LayoutMode);
      setSubmissionMode(initialForm.submissionMode as SubmissionMode);
      setVisibility((initialForm.visibility as Visibility) ?? "PUBLIC");
      setWebhookUrl(initialForm.webhookUrl);
      setExpiresAt(initialForm.expiresAt ? new Date(initialForm.expiresAt) : null);
      setFields(initialForm.fields as FormField[]);
      setPublished(!!initialForm.published);
      isFirstRender.current = true;
      isDirty.current = false;
    }
  }, [initialForm]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!isDirty.current) return;

    setSavingStatus("saving");
    const timer = setTimeout(() => {
      updateFormMutation.mutate({
        formId,
        title,
        description: description || undefined,
        theme,
        layoutMode,
        submissionMode,
        visibility,
        webhookUrl: webhookUrl || "",
        fields,
        published,
        expiresAt: expiresAt ? expiresAt.toISOString() : null,
      });
      isDirty.current = false;
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, description, theme, layoutMode, submissionMode, visibility, webhookUrl, expiresAt, fields, published, formId]);

  const markDirty = () => {
    isDirty.current = true;
  };

  // ── Field operations ──────────────────────────────────────────────────────
  const getNewFieldOrder = (insertIndex?: number): number => {
    if (fields.length === 0) return 1000;
    const sorted = [...fields].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    if (typeof insertIndex !== "number") {
      return (sorted[sorted.length - 1]?.order ?? 0) + 1000;
    }
    const before = sorted[insertIndex - 1]?.order;
    const after = sorted[insertIndex]?.order;
    const b = before ?? 0;
    const a = after ?? b + 2000;
    return (b + a) / 2;
  };

  const handleAddField = (type: FormFieldType, index?: number) => {
    const id = `field_${Math.random().toString(36).substring(2, 10)}`;
    const baseDefaults = {
      id,
      // Empty by default so the inline editor renders only the placeholder
      // hint ("Untitled question" / "Add a description"). Author types
      // directly without first having to delete seeded copy.
      label: "",
      placeholder: "",
      required: false,
      order: getNewFieldOrder(index),
    };

    let defaultField: FormField;
    switch (type) {
      case "SELECT":
      case "RADIO":
      case "CHECKBOX":
        defaultField = { ...baseDefaults, type, options: ["Option 1", "Option 2"] };
        break;
      case "NUMBER":
        defaultField = { ...baseDefaults, type };
        break;
      case "FILE":
        defaultField = { ...baseDefaults, type, accept: "any", maxSizeMB: 10 };
        break;
      case "RATING":
        defaultField = { ...baseDefaults, type, maxStars: 5 };
        break;
      default:
        defaultField = { ...baseDefaults, type: type as any };
    }

    let updatedFields: FormField[];
    if (typeof index === "number") {
      updatedFields = [...fields];
      updatedFields.splice(index, 0, defaultField);
    } else {
      updatedFields = [...fields, defaultField];
    }

    setFields(updatedFields);
    setSelectedFieldId(id);
    markDirty();
  };

  const handleUpdateField = (id: string, updated: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? ({ ...f, ...updated } as FormField) : f)));
    markDirty();
  };

  const handleChangeFieldType = (id: string, nextType: FormFieldType) => {
    setFields(
      fields.map((f) => {
        if (f.id !== id) return f;
        const { label, placeholder, required, order } = f;
        const base = { id, label, placeholder, required, order };
        switch (nextType) {
          case "SELECT":
          case "RADIO":
          case "CHECKBOX": {
            const existing = "options" in f ? f.options : undefined;
            return {
              ...base,
              type: nextType,
              options: existing && existing.length > 0 ? existing : ["Option 1", "Option 2"],
            } as FormField;
          }
          case "FILE":
            return { ...base, type: "FILE", accept: "any", maxSizeMB: 10 } as FormField;
          case "RATING":
            return { ...base, type: "RATING", maxStars: 5 } as FormField;
          case "NUMBER":
            return { ...base, type: "NUMBER" } as FormField;
          default:
            return { ...base, type: nextType } as FormField;
        }
      })
    );
    markDirty();
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
    markDirty();
    toast.success("Question removed.");
  };

  const handleReorderFields = (updated: FormField[]) => {
    setFields(updated);
    markDirty();
  };

  const handleUpdateSettings = (settings: {
    title?: string;
    description?: string;
    theme?: Theme;
    layoutMode?: LayoutMode;
    submissionMode?: SubmissionMode;
    visibility?: Visibility;
    webhookUrl?: string;
    expiresAt?: Date | null;
  }) => {
    if (settings.title !== undefined) setTitle(settings.title);
    if (settings.description !== undefined) setDescription(settings.description);
    if (settings.theme !== undefined) setTheme(settings.theme);
    if (settings.layoutMode !== undefined) setLayoutMode(settings.layoutMode);
    if (settings.submissionMode !== undefined) setSubmissionMode(settings.submissionMode);
    if (settings.visibility !== undefined) setVisibility(settings.visibility);
    if (settings.webhookUrl !== undefined) setWebhookUrl(settings.webhookUrl);
    if (settings.expiresAt !== undefined) setExpiresAt(settings.expiresAt);
    markDirty();
  };

  /**
   * Validates that the form can be published. Returns the list of issues
   * (empty array means OK). Reused by both the top-bar quick path and the
   * publish dialog so the same gates apply everywhere.
   */
  const collectPublishIssues = (): string[] => {
    const issues: string[] = [];
    if (fields.length === 0) issues.push("Add at least one question.");
    const missing = fields
      .map((f, i) => ({ idx: i + 1, label: f.label.trim() }))
      .filter((f) => f.label.length === 0);
    if (missing.length > 0) {
      issues.push(`Add question text to: ${missing.map((m) => `#${m.idx}`).join(", ")}`);
    }
    return issues;
  };

  const openPublishFlow = () => {
    if (published) {
      // Unpublish path stays direct — confirms via toast, no dialog.
      setPublished(false);
      isDirty.current = true;
      toast.info("Form moved to draft.");
      return;
    }
    const issues = collectPublishIssues();
    if (issues.length > 0) {
      issues.forEach((msg) => toast.error(msg));
      return;
    }
    setIsPublishDialogOpen(true);
  };

  const handlePublishConfirm = (next: {
    submissionMode: SubmissionMode;
    visibility: Visibility;
    webhookUrl: string;
    expiresAt: Date | null;
  }) => {
    setSubmissionMode(next.submissionMode);
    setVisibility(next.visibility);
    setWebhookUrl(next.webhookUrl);
    setExpiresAt(next.expiresAt);
    setPublished(true);
    isDirty.current = true;
    setIsPublishDialogOpen(false);
    toast.success("Form is live!");
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/form/${formId}`;
      navigator.clipboard?.writeText(url).then(
        () => toast.info("Public link copied to clipboard."),
        () => {}
      );
    }
  };

  const handleShareClick = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/form/${formId}`;
      navigator.clipboard?.writeText(url).then(
        () => toast.success("Form link copied!"),
        () => toast.error("Could not copy link.")
      );
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs font-mono font-bold mt-4 animate-pulse text-muted-foreground">
          Loading form...
        </p>
      </div>
    );
  }

  if (error || !initialForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold">Failed to load builder</h2>
          <p className="text-xs text-muted-foreground max-w-xs">
            {error?.message || "Form may have been deleted or there was a credentials error."}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground border border-border px-4 py-2 rounded-xl bg-card hover:bg-muted/50 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to dashboard
        </Link>
      </div>
    );
  }

  const stubContent = (label: string) => (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center space-y-3 max-w-sm">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-muted/60 border border-border/40 flex items-center justify-center">
          <span className="text-xl">✨</span>
        </div>
        <h2 className="text-sm font-bold text-foreground">{label} coming soon</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This area is on the roadmap. For now, use the Content tab to build and the Results tab to view submissions.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Primary nav */}
      <TopBarPrimary
        formId={formId}
        formTitle={title}
        onTitleChange={(t) => {
          setTitle(t);
          markDirty();
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savingStatus={savingStatus}
        published={published}
        onPublishClick={openPublishFlow}
        onShareClick={handleShareClick}
      />

      {/* Secondary toolbar — only on Content tab */}
      {activeTab === "content" && (
        <TopBarSecondary
          onDesignClick={() => setIsDesignOpen(true)}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onPreviewOpen={() => setIsPreviewOpen(true)}
          deviceMode={deviceMode}
          onDeviceModeChange={setDeviceMode}
        />
      )}

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {activeTab === "content" ? (
          <>
            <LeftPanel
              fields={fields}
              selectedFieldId={selectedFieldId}
              onSelectField={setSelectedFieldId}
              onAddField={handleAddField}
              onDeleteField={handleDeleteField}
              onReorderFields={handleReorderFields}
            />
            <CanvasPanel
              fields={fields}
              selectedFieldId={selectedFieldId}
              theme={theme}
              deviceMode={deviceMode}
              onSelectField={setSelectedFieldId}
              onAddField={handleAddField}
              onUpdateField={handleUpdateField}
              onDeleteField={handleDeleteField}
            />
            <RightPanel
              selectedField={
                fields.find((f) => f.id === selectedFieldId) ?? null
              }
              onUpdateField={handleUpdateField}
              onChangeFieldType={handleChangeFieldType}
              onDeleteField={handleDeleteField}
            />
          </>
        ) : activeTab === "connect" ? (
          stubContent("Integrations")
        ) : activeTab === "share" ? (
          stubContent("Share")
        ) : null}
      </div>

      {/* Sheets */}
      <DesignSheet
        open={isDesignOpen}
        onOpenChange={setIsDesignOpen}
        description={description}
        theme={theme}
        layoutMode={layoutMode}
        visibility={visibility}
        onUpdate={handleUpdateSettings}
      />
      <SettingsSheet
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        submissionMode={submissionMode}
        webhookUrl={webhookUrl}
        published={published}
        onUpdate={handleUpdateSettings}
        onPublishToggle={openPublishFlow}
      />

      {/* Preview modal */}
      <PreviewModal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        form={{
          title,
          description,
          layoutMode,
          theme,
          fields,
        }}
      />

      {/* Publish dialog */}
      <PublishDialog
        open={isPublishDialogOpen}
        onOpenChange={setIsPublishDialogOpen}
        formId={formId}
        title={title}
        submissionMode={submissionMode}
        visibility={visibility}
        webhookUrl={webhookUrl || ""}
        expiresAt={expiresAt}
        onConfirm={handlePublishConfirm}
      />
    </div>
  );
}

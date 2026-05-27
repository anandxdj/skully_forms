"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Globe,
  Calendar,
  ShieldAlert,
  Webhook,
  Sparkles,
  Link2,
  Clock,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { SubmissionMode, Visibility } from "@repo/trpc/server/schemas/form-schemas";
import { cn } from "~/lib/utils";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string;
  title: string;
  submissionMode: SubmissionMode;
  visibility: Visibility;
  webhookUrl: string;
  expiresAt: Date | null;
  onConfirm: (next: {
    submissionMode: SubmissionMode;
    visibility: Visibility;
    webhookUrl: string;
    expiresAt: Date | null;
  }) => void;
}

const VISIBILITY_OPTIONS: { id: Visibility; label: string; desc: string; icon: typeof Eye }[] = [
  { id: "PUBLIC",   label: "Public",   desc: "Discoverable in galleries and the explore page.", icon: Eye },
  { id: "UNLISTED", label: "Unlisted", desc: "Only people with the link can access.",            icon: EyeOff },
];

const SUBMISSION_MODES: { id: SubmissionMode; label: string; desc: string; icon: typeof Globe }[] = [
  { id: "ANONYMOUS",     label: "Anyone with the link", desc: "No login required. Best for public surveys.", icon: Globe },
  { id: "AUTHENTICATED", label: "Signed-in users only", desc: "Respondents must have an account.",          icon: ShieldAlert },
  { id: "BOTH",          label: "Either",               desc: "Accept both anonymous and signed-in.",       icon: Sparkles },
];

const QUICK_DURATIONS = [
  { label: "1 day",   ms: 24 * 60 * 60 * 1000 },
  { label: "1 week",  ms: 7 * 24 * 60 * 60 * 1000 },
  { label: "1 month", ms: 30 * 24 * 60 * 60 * 1000 },
];

/** Format a Date for an `<input type="datetime-local">` field in local TZ. */
function toLocalInputValue(date: Date | null): string {
  if (!date) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function PublishDialog({
  open,
  onOpenChange,
  formId,
  title,
  submissionMode,
  visibility,
  webhookUrl,
  expiresAt,
  onConfirm,
}: PublishDialogProps) {
  const [localMode, setLocalMode] = useState<SubmissionMode>(submissionMode);
  const [localVisibility, setLocalVisibility] = useState<Visibility>(visibility);
  const [localWebhook, setLocalWebhook] = useState<string>(webhookUrl);
  const [scheduleEnabled, setScheduleEnabled] = useState<boolean>(!!expiresAt);
  const [localExpiresAt, setLocalExpiresAt] = useState<Date | null>(expiresAt);

  // Re-seed local state every time the dialog opens so the parent's latest
  // values are reflected without leaking edits from a cancelled session.
  useEffect(() => {
    if (open) {
      setLocalMode(submissionMode);
      setLocalVisibility(visibility);
      setLocalWebhook(webhookUrl);
      setScheduleEnabled(!!expiresAt);
      setLocalExpiresAt(expiresAt);
    }
  }, [open, submissionMode, visibility, webhookUrl, expiresAt]);

  const publicUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/form/${formId}`;
  }, [formId]);

  const expiresAtValid = !scheduleEnabled || (localExpiresAt && localExpiresAt.getTime() > Date.now());
  const webhookValid =
    localWebhook.trim().length === 0 || /^https?:\/\//i.test(localWebhook.trim());
  const canPublish = expiresAtValid && webhookValid;

  const applyQuickDuration = (ms: number) => {
    setLocalExpiresAt(new Date(Date.now() + ms));
  };

  const handleConfirm = () => {
    onConfirm({
      submissionMode: localMode,
      visibility: localVisibility,
      webhookUrl: localWebhook.trim(),
      expiresAt: scheduleEnabled ? localExpiresAt : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-card">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/40">
          <DialogTitle className="flex items-center gap-2 text-lg font-heading font-extrabold tracking-tight">
            <span className="inline-flex w-8 h-8 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Globe className="w-4 h-4" />
            </span>
            Publish form
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure how <span className="font-bold text-foreground">{title || "this form"}</span>{" "}
            collects responses before going live.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="px-6 py-5 space-y-7">
            {/* Visibility */}
            <section className="space-y-3">
              <h3 className="text-3xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                <Eye className="w-3 h-3" />
                Discoverability
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {VISIBILITY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = localVisibility === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setLocalVisibility(opt.id)}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all cursor-pointer",
                        isSelected
                          ? "bg-primary/5 border-primary"
                          : "bg-card border-border/50 hover:border-border"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className={cn("w-3.5 h-3.5", isSelected ? "text-primary" : "text-muted-foreground")} />
                        <p className={cn("text-xs font-bold", isSelected ? "text-primary" : "text-foreground")}>
                          {opt.label}
                        </p>
                      </div>
                      <p className="text-3xs text-muted-foreground/70 leading-relaxed">
                        {opt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Access */}
            <section className="space-y-3">
              <header className="flex items-center justify-between">
                <h3 className="text-3xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                  <ShieldAlert className="w-3 h-3" />
                  Who can respond
                </h3>
              </header>
              <div className="space-y-1.5">
                {SUBMISSION_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = localMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setLocalMode(mode.id)}
                      className={cn(
                        "w-full px-3.5 py-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3",
                        isSelected
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-card border-border/50 hover:border-border"
                      )}
                    >
                      <span
                        className={cn(
                          "shrink-0 w-7 h-7 rounded-lg flex items-center justify-center",
                          isSelected ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-xs font-bold", isSelected ? "text-primary" : "text-foreground")}>
                          {mode.label}
                        </p>
                        <p className="text-3xs text-muted-foreground/80 mt-0.5 leading-relaxed">
                          {mode.desc}
                        </p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Schedule */}
            <section className="space-y-3">
              <header className="flex items-center justify-between">
                <h3 className="text-3xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  Close date
                </h3>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={scheduleEnabled}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setScheduleEnabled(next);
                      if (next && !localExpiresAt) applyQuickDuration(QUICK_DURATIONS[1]!.ms);
                    }}
                    className="sr-only peer"
                  />
                  <span className="relative w-8 h-4 bg-muted rounded-full peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-background after:rounded-full after:shadow after:transition-transform peer-checked:after:translate-x-4" />
                  <span className="text-3xs font-bold text-muted-foreground">
                    {scheduleEnabled ? "On" : "Off"}
                  </span>
                </label>
              </header>
              {scheduleEnabled ? (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_DURATIONS.map((d) => (
                      <button
                        key={d.label}
                        onClick={() => applyQuickDuration(d.ms)}
                        className="px-2.5 py-1 rounded-full text-3xs font-bold border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors cursor-pointer bg-card/60"
                      >
                        +{d.label}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="datetime-local"
                      value={toLocalInputValue(localExpiresAt)}
                      onChange={(e) => {
                        const v = e.target.value;
                        setLocalExpiresAt(v ? new Date(v) : null);
                      }}
                      min={toLocalInputValue(new Date())}
                      className="w-full pl-9 pr-3 py-2.5 bg-card border border-border/60 rounded-xl text-xs outline-none focus:border-primary text-foreground transition-colors"
                    />
                  </div>
                  {!expiresAtValid && (
                    <p className="text-3xs font-bold text-destructive">
                      Close date must be in the future.
                    </p>
                  )}
                  <p className="text-3xs text-muted-foreground/70 leading-relaxed">
                    After this date, the form will no longer accept submissions. Existing responses are preserved.
                  </p>
                </div>
              ) : (
                <p className="text-3xs text-muted-foreground/70 leading-relaxed">
                  Form stays open until you manually unpublish.
                </p>
              )}
            </section>

            {/* Webhook */}
            <section className="space-y-2.5">
              <h3 className="text-3xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                <Webhook className="w-3 h-3" />
                Webhook delivery <span className="text-muted-foreground/50 font-bold">(optional)</span>
              </h3>
              <input
                type="url"
                value={localWebhook}
                onChange={(e) => setLocalWebhook(e.target.value)}
                placeholder="https://api.yourserver.com/webhook"
                className="w-full bg-card border border-border/60 rounded-xl text-xs py-2.5 px-3 outline-none focus:border-primary text-foreground font-mono transition-colors"
              />
              {!webhookValid && (
                <p className="text-3xs font-bold text-destructive">
                  Must start with http:// or https://.
                </p>
              )}
              <p className="text-3xs text-muted-foreground/70 leading-relaxed">
                Every new submission POSTs to this URL as JSON.
              </p>
            </section>

            {/* Public URL preview */}
            <section className="space-y-2">
              <h3 className="text-3xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                <Link2 className="w-3 h-3" />
                Public link
              </h3>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/40 border border-border/40">
                <code className="flex-1 text-3xs font-mono text-muted-foreground truncate">
                  {publicUrl}
                </code>
              </div>
              <p className="text-3xs text-muted-foreground/70 leading-relaxed">
                The link is copied to your clipboard the moment you publish.
              </p>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t border-border/40 bg-muted/20 flex-row justify-between sm:justify-between gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-3.5 py-2 text-xs font-bold text-muted-foreground hover:text-foreground rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canPublish}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-primary/15",
              canPublish
                ? "bg-primary text-primary-foreground hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
            )}
          >
            <Globe className="w-3.5 h-3.5" />
            Publish form
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

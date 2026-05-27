"use client";

import React from "react";
import { Settings as SettingsIcon, ShieldAlert, Webhook, Globe, Lock } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { ScrollArea } from "~/components/ui/scroll-area";
import { SubmissionMode } from "@repo/trpc/server/schemas/form-schemas";
import { cn } from "~/lib/utils";

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionMode: SubmissionMode;
  webhookUrl: string | null;
  published: boolean;
  onUpdate: (s: { submissionMode?: SubmissionMode; webhookUrl?: string }) => void;
  onPublishToggle: () => void;
}

export default function SettingsSheet({
  open,
  onOpenChange,
  submissionMode,
  webhookUrl,
  published,
  onUpdate,
  onPublishToggle,
}: SettingsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="border-b border-border/40">
          <SheetTitle className="flex items-center gap-2 text-base font-bold">
            <SettingsIcon className="w-4 h-4 text-primary" />
            Settings
          </SheetTitle>
          <SheetDescription className="text-xs">
            Publishing, submission rules, and integrations.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-5 space-y-8">
            {/* Publish */}
            <section className="space-y-2">
              <h3 className="text-3xs font-black uppercase text-muted-foreground tracking-widest">
                Publish status
              </h3>
              <button
                onClick={onPublishToggle}
                className={cn(
                  "w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer",
                  published
                    ? "bg-muted border border-border text-muted-foreground hover:text-foreground"
                    : "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20"
                )}
              >
                {published ? (
                  <><Lock className="w-3.5 h-3.5" /> Set to Draft</>
                ) : (
                  <><Globe className="w-3.5 h-3.5" /> Open publish settings</>
                )}
              </button>
            </section>

            {/* Submission rules */}
            <section className="space-y-3">
              <h3 className="text-3xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="w-3 h-3" />
                Submission rules
              </h3>
              <div className="space-y-2">
                {(
                  [
                    { id: "ANONYMOUS",     label: "Anyone",                desc: "No authentication required" },
                    { id: "AUTHENTICATED", label: "Signed-in users only",  desc: "Enforce JWT authentication" },
                    { id: "BOTH",          label: "Both",                  desc: "Allow all access modes" },
                  ] as const
                ).map((mode) => {
                  const isSelected = submissionMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => onUpdate({ submissionMode: mode.id })}
                      className={cn(
                        "w-full p-3 rounded-xl border text-left transition-colors cursor-pointer",
                        isSelected
                          ? "bg-primary/5 border-primary text-primary"
                          : "bg-card border-border/50 hover:border-border text-muted-foreground"
                      )}
                    >
                      <p className="text-xs font-bold">{mode.label}</p>
                      <p className="text-4xs text-muted-foreground/70 mt-0.5">{mode.desc}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Webhook */}
            <section className="space-y-2">
              <h3 className="text-3xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                <Webhook className="w-3 h-3" />
                Webhook delivery
              </h3>
              <input
                type="url"
                value={webhookUrl || ""}
                onChange={(e) => onUpdate({ webhookUrl: e.target.value })}
                placeholder="https://api.yourserver.com/webhook"
                className="w-full bg-card border border-border/60 rounded-xl text-xs py-2.5 px-3 outline-none focus:border-primary text-foreground font-mono transition-colors"
              />
              <p className="text-3xs text-muted-foreground/60">
                Every new submission POSTs to this URL as JSON.
              </p>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

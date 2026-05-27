"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { trpc } from "~/trpc/client";
import { toast } from "sonner";
import { Loader2, AlertCircle, RotateCcw, CheckCircle } from "lucide-react";
import { FormField } from "@repo/trpc/server/schemas/form-field-schemas";
import { LayoutMode } from "@repo/trpc/server/schemas/form-schemas";
import { ASSETS } from "~/lib/assets";

import ThemeWrapper from "./theme-wrapper";
import LayoutScroll from "./layout-scroll";
import LayoutSlide from "./layout-slide";

interface PublicFormPageViewProps {
  slug: string;
}

export default function PublicFormPageView({ slug }: PublicFormPageViewProps) {
  // 1. Fetch published form layout
  const { data: form, isLoading, error } = trpc.forms.getPublicForm.useQuery(
    { slug },
    { refetchOnWindowFocus: false, retry: 1 }
  );

  // 2. Submit response mutation
  const submitFormMutation = trpc.submissions.submitForm.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Responses sealed successfully.");
    },
    onError: (err) => {
      toast.error(`Submission failed: ${err.message}`);
    },
  });

  // 3. Page operational states
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const startedAt = useRef<Date | null>(null);

  // Set started timestamp on mount
  useEffect(() => {
    startedAt.current = new Date();
  }, []);

  const handleChangeValue = (fieldId: string, val: any) => {
    setValues((prev) => ({ ...prev, [fieldId]: val }));
    // Clear errors when user types or selects
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  // 4. Form Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    // Validate fields locally first
    const fields = form.fields as FormField[];
    const nextErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const val = values[field.id];
      if (field.required) {
        if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
          nextErrors[field.id] = `${field.label} is required.`;
        }
      }

      // Type-specific basic validation edge cases
      if (field.type === "EMAIL" && val) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          nextErrors[field.id] = "Please provide a valid email address.";
        }
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fill in all mandatory questions correctly.");
      return;
    }

    // Retrieve or generate respondent UUID
    let respondentId = localStorage.getItem("x-respondent-id");
    if (!respondentId) {
      respondentId = "00000000-0000-0000-0000-0000" + Math.random().toString(36).substring(2, 10).padStart(12, "0");
      localStorage.setItem("x-respondent-id", respondentId);
    }

    const deviceFingerprint = navigator.userAgent.slice(0, 60);
    const durationMs = startedAt.current
      ? Date.now() - startedAt.current.getTime()
      : undefined;

    submitFormMutation.mutate({
      slug,
      data: values,
      respondentId,
      deviceFingerprint,
      startedAt: startedAt.current || undefined,
      durationMs,
    });
  };

  const handleResetForm = () => {
    setValues({});
    setErrors({});
    setSubmitted(false);
    startedAt.current = new Date();
  };

  // Loader
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-background text-foreground">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-xs font-mono font-bold mt-4 animate-pulse">Resolving dynamic form schema...</p>
      </div>
    );
  }

  // Error Page (draft form or wrong slug)
  if (error || !form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-background text-foreground px-4 text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-heading font-extrabold text-foreground">Form is not available</h2>
          <p className="text-xs text-muted-foreground max-w-sm">
            {error?.message || "Form might be in draft mode. Creators must toggle 'Publish Live' in builder to enable public access."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeWrapper theme={form.theme as any}>
      {submitted ? (
        /* 5.1 SUCCESS SCREEN */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6 min-h-dvh bg-section-mint animate-fade-in">
          {/* Green success badge */}
          <div className="w-14 h-14 rounded-full bg-success/15 border border-success/30 text-success flex items-center justify-center shadow-sm animate-scale-in">
            <CheckCircle className="w-7 h-7 stroke-[1.5]" />
          </div>
          <div className="relative w-36 h-36 select-none">
            <Image
              src={ASSETS.skeletons.dancing}
              alt="Success skeleton celebration"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
          <div className="space-y-2.5">
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-success tracking-tight">Response Sealed!</h2>
            <p className="text-xs text-foreground/60 max-w-xs mx-auto leading-relaxed">
              Your answers have been logged in the crypt. Thank you for completing this form.
            </p>
          </div>
          <button
            onClick={handleResetForm}
            className="inline-flex items-center gap-1.5 text-2xs font-black text-success bg-success/10 border border-success/25 px-4 py-2.5 rounded-lg hover:bg-success/20 transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Submit Another Response
          </button>
        </div>
      ) : (
        /* 5.2 ACTIVE QUESTIONNAIRE LAYOUT */
        form.layoutMode === "SLIDE" ? (
          <LayoutSlide
            fields={form.fields as FormField[]}
            values={values}
            errors={errors}
            onChangeValue={handleChangeValue}
            onSubmit={handleSubmit}
            submitting={submitFormMutation.isPending}
            title={form.title}
            description={form.description}
          />
        ) : (
          <LayoutScroll
            fields={form.fields as FormField[]}
            values={values}
            errors={errors}
            onChangeValue={handleChangeValue}
            onSubmit={handleSubmit}
            submitting={submitFormMutation.isPending}
            title={form.title}
            description={form.description}
          />
        )
      )}
    </ThemeWrapper>
  );
}

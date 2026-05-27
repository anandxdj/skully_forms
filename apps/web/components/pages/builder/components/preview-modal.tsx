"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { FormField } from "@repo/trpc/server/schemas/form-field-schemas";
import { LayoutMode, Theme } from "@repo/trpc/server/schemas/form-schemas";
import { toast } from "sonner";
import ThemeWrapper from "~/components/pages/form/theme-wrapper";
import LayoutSlide from "~/components/pages/form/layout-slide";
import LayoutScroll from "~/components/pages/form/layout-scroll";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  form: {
    title: string;
    description: string | null;
    layoutMode: LayoutMode;
    theme: Theme;
    fields: FormField[];
  };
}

export default function PreviewModal({ open, onClose, form }: PreviewModalProps) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors] = useState<Record<string, string>>({});

  const handleChangeValue = (fieldId: string, val: any) => {
    setValues((prev) => ({ ...prev, [fieldId]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Preview mode — submissions are disabled.");
  };

  const handleClose = () => {
    setValues({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-none w-screen h-[100dvh] p-0 m-0 rounded-none border-none overflow-hidden [&>button]:hidden">
        {/* Preview header bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-black/70 backdrop-blur-sm border-b border-white/10">
          <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
            Preview Mode
          </span>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form player */}
        <div className="w-full h-full overflow-auto pt-10">
          <ThemeWrapper theme={form.theme}>
            {form.layoutMode === "SLIDE" ? (
              <LayoutSlide
                fields={form.fields}
                values={values}
                errors={errors}
                onChangeValue={handleChangeValue}
                onSubmit={handleSubmit}
                submitting={false}
                title={form.title}
                description={form.description}
              />
            ) : (
              <LayoutScroll
                fields={form.fields}
                values={values}
                errors={errors}
                onChangeValue={handleChangeValue}
                onSubmit={handleSubmit}
                submitting={false}
                title={form.title}
                description={form.description}
              />
            )}
          </ThemeWrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
}

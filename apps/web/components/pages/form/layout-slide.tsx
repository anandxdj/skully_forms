"use client";

import React, { useState, useEffect } from "react";
import { FormField } from "@repo/trpc/server/schemas/form-field-schemas";
import { ArrowLeft, ArrowRight, Loader2, Skull, CheckCircle2 } from "lucide-react";
import QuestionRenderer from "./question-renderer";

interface LayoutSlideProps {
  fields: FormField[];
  values: Record<string, any>;
  errors: Record<string, string>;
  onChangeValue: (fieldId: string, val: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  title: string;
  description: string | null;
}

export default function LayoutSlide({
  fields,
  values,
  errors,
  onChangeValue,
  onSubmit,
  submitting,
  title,
  description,
}: LayoutSlideProps) {
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 is the Welcome Slide, fields.length is Submit Slide
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");

  const totalSlides = fields.length + 2; // Welcome slide + fields + Submit slide
  const activeProgress = ((currentIndex + 1) / (totalSlides - 1)) * 100;

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keys inside textarea elements
      if (e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, values, fields]);

  const handleNext = () => {
    // If it's the welcome slide (-1)
    if (currentIndex === -1) {
      setSlideDirection("next");
      setCurrentIndex(0);
      return;
    }

    // If it's a question slide
    if (currentIndex >= 0 && currentIndex < fields.length) {
      const field = fields[currentIndex];
      if (!field) return;
      const val = values[field.id];

      // Client-side required check
      if (field.required && (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0))) {
        toastRequiredError(field.label);
        return;
      }

      setSlideDirection("next");
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > -1) {
      setSlideDirection("prev");
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toastRequiredError = (label: string) => {
    // Quick vibration error effect
    const element = document.getElementById("slide-card");
    if (element) {
      element.classList.add("animate-shake");
      setTimeout(() => element.classList.remove("animate-shake"), 500);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 w-full max-w-2xl mx-auto select-none min-h-[80vh]">
      
      {/* 1. Progress Bar Header */}
      <header className="space-y-3 shrink-0">
        <div className="w-full h-1 bg-border/40 rounded-full overflow-hidden relative">
          <div
            style={{ width: `${activeProgress}%` }}
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
          />
        </div>
        <div className="flex items-center justify-between text-5xs font-mono font-black uppercase text-muted-foreground tracking-wider">
          <span>{title}</span>
          <span>{Math.round(activeProgress)}% Completed</span>
        </div>
      </header>

      {/* 2. Slide Main Card (Dynamic transition layout) */}
      <div className="flex-1 flex items-center justify-center py-8">
        <div
          id="slide-card"
          key={currentIndex} // Re-mounts to trigger enter keyframes naturally
          className={`w-full p-8 rounded-3xl border border-border bg-card/65 backdrop-blur-md shadow-2xl flex flex-col justify-between min-h-[360px] text-left transition-all ${
            slideDirection === "next" ? "animate-fade-in-up" : "animate-fade-in-up"
          }`}
        >
          {currentIndex === -1 && (
            /* Slide A: Welcome Screen */
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-primary">
                <Skull className="w-8 h-8 fill-current" />
                <span className="text-2xs font-black uppercase tracking-widest">Skully Forms</span>
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-black text-foreground tracking-tight leading-tight">
                  {title}
                </h1>
                {description && (
                  <p className="text-xs text-muted-foreground/90 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
              <div className="pt-2">
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-6 py-3.5 text-xs font-black text-white bg-primary hover:opacity-95 rounded-xl transition-all shadow-md shadow-primary/10 active:scale-97 cursor-pointer"
                >
                  Start Questionnaire
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-5xs text-muted-foreground font-mono ml-3 uppercase tracking-wider select-none hidden sm:inline-block">
                  Press Enter ↵
                </span>
              </div>
            </div>
          )}

          {currentIndex >= 0 && currentIndex < fields.length && fields[currentIndex] && (
            /* Slide B: Questions Screens */
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              <QuestionRenderer
                field={fields[currentIndex]!}
                value={values[fields[currentIndex]!.id]}
                onChange={(val) => onChangeValue(fields[currentIndex]!.id, val)}
                error={errors[fields[currentIndex]!.id]}
              />
              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-black text-white bg-primary hover:opacity-95 rounded-xl transition-all shadow-md active:scale-97 cursor-pointer"
                >
                  OK
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
                <span className="text-5xs text-muted-foreground font-mono uppercase tracking-wider hidden sm:inline-block">
                  Press Enter ↵
                </span>
              </div>
            </div>
          )}

          {currentIndex === fields.length && (
            /* Slide C: Submit/End Screen */
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center animate-bounce">
                <Skull className="w-6 h-6 fill-current" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-foreground">Ready to Submit?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                  You have answered all questions. Seal your responses in the obsidian ledger database below!
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={onSubmit}
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3.5 text-xs font-black text-white bg-gradient-to-r from-primary to-[#ff2e8c]/80 hover:opacity-95 rounded-xl transition-all shadow-lg active:scale-97 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sealing responses...
                    </>
                  ) : (
                    <>
                      Seal and Submit Form
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3. Immersive Bottom Navigation Panels */}
      <footer className="flex items-center justify-between shrink-0 select-none">
        <div>
          {currentIndex > -1 && (
            <button
              onClick={handlePrev}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          )}
        </div>

        {/* Action Keys Visual Arrows */}
        <div className="flex items-center gap-1.5 border border-border/80 bg-card rounded-xl p-0.5 shadow-sm text-muted-foreground select-none">
          <button
            onClick={handlePrev}
            disabled={currentIndex === -1}
            className="p-2 rounded-lg hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Previous question (ArrowUp)"
          >
            <ArrowLeft className="w-3.5 h-3.5 -rotate-90" />
          </button>
          <span className="h-4 w-px bg-border/60" />
          <button
            onClick={handleNext}
            disabled={currentIndex === fields.length}
            className="p-2 rounded-lg hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Next question (ArrowDown)"
          >
            <ArrowLeft className="w-3.5 h-3.5 rotate-90" />
          </button>
        </div>
      </footer>

    </div>
  );
}

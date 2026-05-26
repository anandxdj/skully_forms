"use client";

import React, { useState } from "react";
import { UploadCloud, Star, FileText, Loader2, Check, AlertCircle, X } from "lucide-react";
import { FormField } from "@repo/trpc/server/schemas/form-field-schemas";
import { toast } from "sonner";

interface QuestionRendererProps {
  field: FormField;
  value: any;
  onChange: (val: any) => void;
  error?: string;
}

export default function QuestionRenderer({
  field,
  value,
  onChange,
  error,
}: QuestionRendererProps) {
  const [uploading, setUploading] = useState(false);

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file) return;

    // Enforce size check (default 10MB)
    const maxBytes = (field.type === "FILE" ? field.maxSizeMB ?? 10 : 10) * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(`File size exceeds limit of ${field.type === "FILE" ? field.maxSizeMB ?? 10 : 10}MB`);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        onChange(resData.data); // Save the fileAnswer reference (url, name, size, type)
        toast.success("File uploaded successfully.");
      } else {
        throw new Error(resData.error?.message || "Upload payload malformed");
      }
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message || err}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCheckboxToggle = (option: string, isChecked: boolean) => {
    const currentList = Array.isArray(value) ? value : [];
    if (isChecked) {
      onChange([...currentList, option]);
    } else {
      onChange(currentList.filter((o) => o !== option));
    }
  };

  return (
    <div className="space-y-2.5 text-left w-full">
      {/* Question Header */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-1">
          {field.label}
          {field.required && (
            <span className="text-[#ff2e8c] font-black text-xs select-none">*</span>
          )}
        </label>
        {field.placeholder && !["TEXT", "TEXTAREA", "EMAIL", "DATE"].includes(field.type) && (
          <p className="text-5xs text-muted-foreground/80 leading-normal select-none">{field.placeholder}</p>
        )}
      </div>

      {/* Inputs Rendering Swapper */}
      <div className="w-full">
        
        {/* 1. TEXT Input */}
        {field.type === "TEXT" && (
          <input
            type="text"
            required={field.required}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || "Enter your short response..."}
            className="w-full bg-[#08080a]/60 border border-border/80 rounded-xl text-xs py-3 px-4 outline-none focus:border-primary text-foreground transition-all duration-200"
          />
        )}

        {/* 2. TEXTAREA Input */}
        {field.type === "TEXTAREA" && (
          <textarea
            required={field.required}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || "Write your long commentary here..."}
            rows={4}
            className="w-full bg-[#08080a]/60 border border-border/80 rounded-xl text-xs py-3 px-4 outline-none focus:border-primary text-foreground transition-all duration-200 resize-none"
          />
        )}

        {/* 3. NUMBER Input */}
        {field.type === "NUMBER" && (
          <input
            type="number"
            min={field.min}
            max={field.max}
            required={field.required}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
            placeholder={field.placeholder || "Enter numeric response..."}
            className="w-full bg-[#08080a]/60 border border-border/80 rounded-xl text-xs py-3 px-4 outline-none focus:border-primary text-foreground transition-all duration-200"
          />
        )}

        {/* 4. EMAIL Input */}
        {field.type === "EMAIL" && (
          <input
            type="email"
            required={field.required}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || "e.g. email@provider.com"}
            className="w-full bg-[#08080a]/60 border border-border/80 rounded-xl text-xs py-3 px-4 outline-none focus:border-primary text-foreground transition-all duration-200"
          />
        )}

        {/* 5. DATE Input */}
        {field.type === "DATE" && (
          <input
            type="date"
            required={field.required}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#08080a]/60 border border-border/80 rounded-xl text-xs py-3 px-4 outline-none focus:border-primary text-foreground transition-all duration-200 font-mono"
          />
        )}

        {/* 6. SELECT Input */}
        {field.type === "SELECT" && (
          <select
            required={field.required}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#08080a]/60 border border-border/80 rounded-xl text-xs py-3 px-4 outline-none focus:border-primary text-foreground transition-all duration-200"
          >
            <option value="" disabled>
              {field.placeholder || "Select one choice..."}
            </option>
            {(field.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {/* 7. RADIO Input */}
        {field.type === "RADIO" && (
          <div className="flex flex-col gap-2">
            {(field.options || []).map((opt) => {
              const isSelected = value === opt;
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => onChange(opt)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-[#08080a]/30 border-border/60 hover:border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-primary bg-primary text-white" : "border-border"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 8. CHECKBOX Input */}
        {field.type === "CHECKBOX" && (
          <div className="flex flex-col gap-2">
            {(field.options || []).map((opt) => {
              const isChecked = Array.isArray(value) && value.includes(opt);
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => handleCheckboxToggle(opt, !isChecked)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-[#08080a]/30 border-border/60 hover:border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                      isChecked ? "bg-primary border-primary text-white" : "border-border"
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 9. FILE Upload */}
        {field.type === "FILE" && (
          <div className="space-y-3">
            {value ? (
              /* Already Uploaded Preview Card */
              <div className="p-3 border border-emerald-500/30 bg-emerald-500/5 rounded-xl flex items-center justify-between gap-3 animate-scale-in">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-3xs font-extrabold text-foreground truncate max-w-[240px]">
                      {value.name}
                    </p>
                    <p className="text-5xs text-muted-foreground/90 font-mono mt-0.5">
                      {(value.size / 1024 / 1024).toFixed(2)} MB • {value.type}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="p-1 rounded bg-muted hover:bg-destructive/15 text-muted-foreground hover:text-destructive cursor-pointer transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Uploader Drag-drop box */
              <div className="relative border-2 border-dashed border-border/80 bg-[#08080a]/30 rounded-xl hover:border-primary/50 transition-all duration-300 p-8 text-center flex flex-col items-center justify-center space-y-2">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept={
                    field.accept === "image"
                      ? "image/*"
                      : field.accept === "video"
                        ? "video/*"
                        : undefined
                  }
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {uploading ? (
                  <>
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-3xs font-black uppercase text-primary animate-pulse tracking-wide">
                      Uploading to obsidian registry...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xs font-extrabold text-foreground">
                        Click or drag to upload
                      </p>
                      <p className="text-5xs text-muted-foreground mt-1 select-none">
                        Max size: {field.maxSizeMB ?? 10}MB • {field.accept || "Any"} format
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* 10. RATING Input */}
        {field.type === "RATING" && (
          <div className="flex items-center gap-1.5 pt-1 select-none">
            {Array.from({ length: field.maxStars ?? 5 }).map((_, idx) => {
              const starIndex = idx + 1;
              const isSelected = value >= starIndex;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => onChange(starIndex)}
                  className="transition-transform duration-200 hover:scale-120 cursor-pointer text-muted-foreground focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 stroke-[1.5] transition-all ${
                      isSelected
                        ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(237,145,148,0.25)]"
                        : "opacity-40"
                    }`}
                  />
                </button>
              );
            })}
            <span className="text-3xs font-mono text-muted-foreground/80 ml-2">
              ({value || 0}/{field.maxStars ?? 5})
            </span>
          </div>
        )}

      </div>

      {/* Field Level Error Validation Banners */}
      {error && (
        <div className="flex items-center gap-1.5 text-[#ff2e8c] text-5xs font-black uppercase tracking-wider animate-shake mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

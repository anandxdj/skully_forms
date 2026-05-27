"use client";

import React, { useState } from "react";
import NextImage from "next/image";
import { trpc } from "~/trpc/client";
import { FormField } from "@repo/trpc/server/schemas/form-field-schemas";
import { Loader2, AlertCircle, FileText, Download, Play, X, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { ASSETS } from "~/lib/assets";

interface TabGalleryProps {
  formId: string;
  fields: FormField[];
}

interface UploadedFileItem {
  fieldId: string;
  fieldLabel: string;
  submissionId: string;
  createdAt: string | null;
  url: string;
  name: string;
  size: number;
  type: string;
}

export default function TabGallery({ formId, fields }: TabGalleryProps) {
  // Query raw submissions chronological feed to extract file answers
  const { data: submissions, isLoading, error } = trpc.submissions.getSubmissions.useQuery(
    { formId },
    { refetchOnWindowFocus: false, retry: 1 }
  );

  // Full image preview modal state
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);

  // 1. Gather all file fields from the form layout
  const fileFields = fields.filter((f) => f.type === "FILE");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs font-mono font-bold animate-pulse">Compiling respondent attachments...</p>
      </div>
    );
  }

  if (error || !submissions) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-destructive" />
        <p className="text-xs font-bold text-foreground">Failed to compile files</p>
        <p className="text-4xs text-muted-foreground/80 max-w-xs">
          {error?.message || "There was a database error listing media attachments."}
        </p>
      </div>
    );
  }

  // 2. Extract uploaded file answer records from submissions
  const galleryItems: UploadedFileItem[] = [];

  submissions.forEach((sub) => {
    fileFields.forEach((field) => {
      const answer = sub.data[field.id];
      if (answer && typeof answer === "object" && !Array.isArray(answer) && "url" in answer) {
        galleryItems.push({
          fieldId: field.id,
          fieldLabel: field.label,
          submissionId: sub.id,
          createdAt: sub.createdAt,
          url: answer.url,
          name: answer.name,
          size: answer.size,
          type: answer.type,
        });
      }
    });
  });

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-4 select-none">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Attachments & Media Catalog
        </h3>
        <span className="text-5xs font-mono font-bold bg-muted px-2 py-0.5 rounded border border-border">
          Total: {galleryItems.length} attachments
        </span>
      </div>

      {fileFields.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-xl select-none space-y-3">
          <div className="relative w-24 h-24">
            <NextImage src={ASSETS.skeletons.inBox} alt="No file fields" fill className="object-contain drop-shadow" />
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-[220px]">No File Upload fields in this form. Add one to collect attachments.</p>
        </div>
      ) : galleryItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-xl select-none space-y-3">
          <div className="relative w-24 h-24">
            <NextImage src={ASSETS.skeletons.inBox} alt="No uploads yet" fill className="object-contain drop-shadow" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-bold text-foreground">No attachments yet</p>
            <p className="text-4xs text-muted-foreground max-w-[220px]">Uploads from respondents will appear here once they start submitting.</p>
          </div>
        </div>
      ) : (
        /* Visual Media Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, idx) => {
            const isImage = item.type.startsWith("image/");
            const isVideo = item.type.startsWith("video/");
            const isAudio = item.type.startsWith("audio/");

            return (
              <div
                key={`${item.submissionId}-${idx}`}
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between"
              >
                
                {/* Visual Media Canvas (Image thumbs, audio controllers, video players) */}
                <div className="bg-muted/40 aspect-video w-full relative flex items-center justify-center overflow-hidden border-b border-border/40 select-none">
                  
                  {isImage && (
                    <img
                      src={item.url}
                      alt={item.name}
                      onClick={() => setActiveImageUrl(item.url)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  )}

                  {isVideo && (
                    <video
                      src={item.url}
                      controls
                      className="w-full h-full object-contain"
                    />
                  )}

                  {isAudio && (
                    <div className="w-full p-4 flex flex-col items-center justify-center space-y-2.5">
                      <Play className="w-8 h-8 text-primary animate-pulse" />
                      <audio src={item.url} controls className="w-full max-w-[200px]" />
                    </div>
                  )}

                  {!isImage && !isVideo && !isAudio && (
                    /* Generic Attachment visual representation */
                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                      <FileText className="w-10 h-10 text-primary" />
                      <span className="text-5xs font-mono font-bold uppercase tracking-wider">
                        {item.type.split("/")[1] || "document"}
                      </span>
                    </div>
                  )}

                </div>

                {/* Meta details footer */}
                <div className="p-4 space-y-3">
                  <div className="text-left space-y-1">
                    <p className="text-3xs font-extrabold text-foreground truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-5xs font-mono text-muted-foreground">
                      {(item.size / 1024 / 1024).toFixed(2)} MB • {item.type}
                    </p>
                  </div>

                  <div className="border-t border-border/30 pt-3 flex items-center justify-between">
                    {/* Timestamp & Field labels */}
                    <div className="text-left">
                      <p className="text-5xs font-black uppercase text-muted-foreground tracking-widest truncate max-w-[130px]">
                        Question: {item.fieldLabel}
                      </p>
                      <p className="text-5xs text-muted-foreground mt-0.5">
                        {item.createdAt ? format(new Date(item.createdAt), "MMM dd, yyyy") : "-"}
                      </p>
                    </div>

                    {/* Direct download button */}
                    <a
                      href={item.url}
                      download={item.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border border-border bg-card hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all shadow-sm cursor-pointer shrink-0"
                      title="Download Attachment"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Full Image viewer modal popup */}
      {activeImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setActiveImageUrl(null)}
            className="absolute inset-0 bg-background/90 backdrop-blur-sm transition-all"
          />
          <button
            onClick={() => setActiveImageUrl(null)}
            className="absolute top-6 right-6 p-2 rounded-xl border border-border bg-card text-foreground cursor-pointer z-10 hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative max-w-4xl max-h-[85vh] z-10 overflow-hidden rounded-2xl border border-border/80 shadow-2xl">
            <img
              src={activeImageUrl}
              alt="Full Visual Attachment Preview"
              className="object-contain max-w-full max-h-[85vh]"
            />
          </div>
        </div>
      )}

    </div>
  );
}

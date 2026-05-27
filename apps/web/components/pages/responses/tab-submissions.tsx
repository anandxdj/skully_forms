"use client";

import React, { useState } from "react";
import Image from "next/image";
import { trpc } from "~/trpc/client";
import { FormField } from "@repo/trpc/server/schemas/form-field-schemas";
import { Loader2, AlertCircle, Calendar, Clock, User, ArrowRight, X, FileText } from "lucide-react";
import { format } from "date-fns";
import { ASSETS } from "~/lib/assets";

interface TabSubmissionsProps {
  formId: string;
  fields: FormField[];
}

export default function TabSubmissions({ formId, fields }: TabSubmissionsProps) {
  // Query raw submissions chronological feed
  const { data: submissions, isLoading, error } = trpc.submissions.getSubmissions.useQuery(
    { formId },
    { refetchOnWindowFocus: false, retry: 1 }
  );

  // Modal detailed selector state
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);

  const activeSub = submissions?.find((s) => s.id === selectedSubId);

  // Helper to format answers for datatable column previews
  const renderValuePreview = (val: any) => {
    if (val === undefined || val === null) return "-";
    if (typeof val === "boolean") return val ? "True" : "False";
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === "object" && val.url) {
      return `File: ${val.name}`;
    }
    return String(val);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs font-mono font-bold animate-pulse">Retrieving submission ledger records...</p>
      </div>
    );
  }

  if (error || !submissions) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-destructive" />
        <p className="text-xs font-bold text-foreground">Failed to compile submissions</p>
        <p className="text-4xs text-muted-foreground/85 max-w-xs">
          {error?.message || "There was a database error listing response values."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-left relative">
      
      <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Chronological Records Feed
        </h3>
        <span className="text-5xs font-mono font-bold bg-muted px-2 py-0.5 rounded border border-border">
          Aggregate: {submissions.length} records
        </span>
      </div>

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-xl select-none space-y-3">
          <div className="relative w-24 h-24">
            <Image src={ASSETS.skeletons.inBox} alt="No submissions yet" fill className="object-contain drop-shadow" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-bold text-foreground">The crypt is empty</p>
            <p className="text-4xs text-muted-foreground max-w-[220px]">No submissions logged yet. Share your form link to start collecting responses!</p>
          </div>
        </div>
      ) : (
        /* Responsive Datatable Container */
        <div className="border border-border/80 rounded-2xl bg-card overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-muted/40 border-b border-border/50 text-4xs font-black uppercase text-muted-foreground tracking-widest select-none">
                <th className="px-5 py-3.5">Submission ID</th>
                <th className="px-5 py-3.5">Submitted Date</th>
                <th className="px-5 py-3.5">Duration</th>
                <th className="px-5 py-3.5">Key Preview</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {submissions.map((sub) => {
                // Grab the first question as a preview
                const firstField = fields[0];
                const previewAnswer = firstField ? sub.data[firstField.id] : undefined;

                return (
                  <tr key={sub.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-5 py-4 font-mono text-3xs font-bold text-foreground">
                      {sub.id.slice(0, 8)}...
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {sub.createdAt ? format(new Date(sub.createdAt), "MMM dd, yyyy h:mm a") : "-"}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground font-mono">
                      {sub.durationMs ? `${(sub.durationMs / 1000).toFixed(1)}s` : "-"}
                    </td>
                    <td className="px-5 py-4 text-foreground font-semibold max-w-[200px] truncate">
                      {renderValuePreview(previewAnswer)}
                    </td>
                    <td className="px-5 py-4 text-right select-none">
                      <button
                        onClick={() => setSelectedSubId(sub.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-primary/15 hover:border-primary/20 hover:text-primary transition-all text-3xs font-extrabold cursor-pointer active:scale-95"
                      >
                        Inspect
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 5.3 RADIX-STYLE EXPANDED DETAILS MODAL DIALOG */}
      {selectedSubId && activeSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedSubId(null)}
            className="absolute inset-0 bg-background/85 backdrop-blur-sm transition-all"
          />

          <div className="relative w-full max-w-lg p-6 rounded-2xl border border-border bg-card shadow-2xl z-10 animate-scale-in flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border/50 pb-4 mb-4 select-none">
              <div>
                <h3 className="text-sm font-black text-foreground flex items-center gap-1.5">
                  Submission Inspect Details
                </h3>
                <p className="text-5xs text-muted-foreground font-mono mt-0.5 uppercase tracking-wide">
                  ID: {activeSub.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubId(null)}
                className="p-1 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Meta Grid */}
            <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-xl border border-border bg-muted/20 text-muted-foreground text-5xs font-mono font-bold uppercase tracking-wider mb-6 select-none shrink-0">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>
                  {activeSub.createdAt ? format(new Date(activeSub.createdAt), "MMM dd, yyyy") : "-"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>
                  {activeSub.durationMs ? `${(activeSub.durationMs / 1000).toFixed(1)} seconds` : "-"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <User className="w-3.5 h-3.5 text-primary" />
                <span className="truncate">
                  {activeSub.respondentId?.slice(0, 12) || "Anonymous"}
                </span>
              </div>
            </div>

            {/* List of Questions & Answers */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {fields.map((field) => {
                const answer = activeSub.data[field.id];

                return (
                  <div key={field.id} className="space-y-1.5">
                    <p className="text-5xs font-black uppercase text-muted-foreground tracking-widest">
                      {field.label}
                    </p>
                    <div className="p-3 bg-muted/30 border border-border/60 rounded-xl text-xs font-semibold text-foreground">
                      {typeof answer === "object" && answer && !Array.isArray(answer) && "url" in answer ? (
                        /* Handle uploaded file layout detail */
                        <a
                          href={(answer as any).url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1.5 w-max"
                        >
                          <FileText className="w-4 h-4" />
                          <span>{(answer as any).name}</span>
                          <span className="text-5xs font-mono font-bold bg-muted px-2 py-0.5 border border-border text-muted-foreground/90 no-underline rounded">
                            {((answer as any).size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </a>
                      ) : (
                        renderValuePreview(answer)
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Close footer buttons */}
            <div className="border-t border-border/50 pt-4 mt-6 flex justify-end shrink-0 select-none">
              <button
                onClick={() => setSelectedSubId(null)}
                className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

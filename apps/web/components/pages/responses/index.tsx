import React from "react";

interface ResponsesPageViewProps {
  formId: string;
}

export default function ResponsesPageView({ formId }: ResponsesPageViewProps) {
  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center space-x-4 border-b border-border pb-4">
          <a href="/dashboard" className="text-sm font-semibold hover:underline text-muted-foreground">
            ← Dashboard
          </a>
          <span className="h-4 w-px bg-border" />
          <h1 className="text-3xl font-bold tracking-tight">Responses & Analytics</h1>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
            Form ID: {formId}
          </span>
        </div>

        {/* Tab Selection Row */}
        <div className="flex space-x-2 border-b border-border/60 pb-px">
          <button className="px-4 py-2 border-b-2 border-primary text-sm font-semibold">
            Analytics Overview
          </button>
          <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
            Submissions Table
          </button>
          <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
            File Gallery
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-8 rounded-xl border border-border bg-card shadow-sm text-center">
          <p className="text-sm text-muted-foreground">
            Submissions loading... (Setup in Progress)
          </p>
        </div>
      </div>
    </div>
  );
}

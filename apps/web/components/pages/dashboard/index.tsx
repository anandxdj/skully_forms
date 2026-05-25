import React from "react";

export default function DashboardPageView() {
  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight">Forms Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your forms, analyze submissions, and build new schemas.
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md cursor-not-allowed opacity-75"
            disabled
          >
            Create Form
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card placeholders */}
          <div className="p-6 space-y-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Published
              </span>
              <span className="text-xs text-muted-foreground">Submissions: 24</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold">Feedback Survey</h3>
              <p className="text-sm text-muted-foreground truncate">
                slug: feedback-survey-nanoid
              </p>
            </div>
            <div className="flex gap-2 pt-2 text-xs">
              <span className="px-3 py-1.5 rounded bg-muted hover:bg-muted/80 cursor-not-allowed text-muted-foreground">
                Edit
              </span>
              <span className="px-3 py-1.5 rounded bg-muted hover:bg-muted/80 cursor-not-allowed text-muted-foreground">
                Responses
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

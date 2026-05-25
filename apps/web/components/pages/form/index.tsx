import React from "react";

interface PublicFormPageViewProps {
  slug: string;
}

export default function PublicFormPageView({ slug }: PublicFormPageViewProps) {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-background text-foreground">
      <div className="w-full max-w-xl p-8 space-y-6 rounded-2xl border border-border bg-card shadow-2xl backdrop-blur-md">
        <div className="space-y-2 border-b border-border pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Public Submission Form</h1>
          <p className="text-sm text-muted-foreground">
            Form slug parameter: <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">{slug}</span>
          </p>
        </div>
        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg bg-background text-center">
            <p className="text-sm text-muted-foreground">
              Form schema loading... (Setup in Progress)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

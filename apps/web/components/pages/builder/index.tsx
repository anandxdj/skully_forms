import React from "react";

interface BuilderPageViewProps {
  formId: string;
}

export default function BuilderPageView({ formId }: BuilderPageViewProps) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Top Header Shell */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center space-x-4">
          <a href="/dashboard" className="text-sm font-semibold hover:underline text-muted-foreground">
            ← Dashboard
          </a>
          <span className="h-4 w-px bg-border" />
          <h2 className="text-lg font-bold">Form Builder Workspace</h2>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
            ID: {formId}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-muted-foreground">Saving in progress...</span>
          <button
            type="button"
            className="px-4 py-2 text-sm font-semibold rounded bg-primary text-primary-foreground opacity-80 cursor-not-allowed"
            disabled
          >
            Publish Form
          </button>
        </div>
      </header>

      {/* Builder Layout Grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Inventory */}
        <aside className="w-64 border-r border-border bg-card p-4 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Field Inventory
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 border border-border rounded bg-background hover:border-primary transition-all text-center cursor-pointer">
              Text Input
            </div>
            <div className="p-3 border border-border rounded bg-background hover:border-primary transition-all text-center cursor-pointer">
              TextArea
            </div>
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 p-8 bg-muted/30 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-8 rounded-xl border border-border bg-card shadow-sm space-y-6">
            <div className="space-y-2 border-b border-border pb-4">
              <h1 className="text-2xl font-bold">Form Title Placeholder</h1>
              <p className="text-muted-foreground text-sm">Add questions from the left panel.</p>
            </div>
            {/* Empty Canvas visual */}
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-lg bg-background">
              <p className="text-muted-foreground text-sm">Canvas is empty</p>
            </div>
          </div>
        </main>

        {/* Right Settings */}
        <aside className="w-80 border-l border-border bg-card p-4 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Form Settings
          </h3>
          <div className="space-y-4 text-sm">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Layout Type</label>
              <select className="w-full p-2 border border-border rounded bg-background" disabled>
                <option>Scroll Mode (Vertical Stack)</option>
                <option>Slide Mode (Single Page Slides)</option>
              </select>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

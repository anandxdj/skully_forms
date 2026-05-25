import React from "react";

export default function LandingPageView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-background text-foreground text-center">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-primary animate-fade-in-down">
          Skully Forms
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Premium, interactive form-building experience with dynamic theming and AI-assisted generation.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <a
            href="/login"
            className="px-6 py-3 font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            Get Started
          </a>
          <a
            href="/dashboard"
            className="px-6 py-3 font-semibold rounded-lg border border-border bg-card text-card-foreground hover:bg-muted transition-all"
          >
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

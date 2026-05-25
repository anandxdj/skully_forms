import React from "react";

export default function LoginPageView() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-background text-foreground">
      <div className="w-full max-w-md p-8 space-y-6 rounded-2xl border border-border bg-card shadow-2xl backdrop-blur-md">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Developer Login
          </h2>
          <p className="text-sm text-muted-foreground">
            Sign in using your developer credentials from the database.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. dev@example.com"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
              disabled
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
              disabled
            />
          </div>
          <button
            type="button"
            className="w-full py-3 mt-2 font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/10 cursor-not-allowed opacity-70"
            disabled
          >
            Login (Setup in Progress)
          </button>
        </div>
      </div>
    </div>
  );
}

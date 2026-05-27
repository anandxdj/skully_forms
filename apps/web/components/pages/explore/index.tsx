"use client";

import React from "react";
import Link from "next/link";
import { Skull, ArrowRight, Loader2, FileText, Globe, LayoutDashboard } from "lucide-react";
import { trpc } from "~/trpc/client";
import { cn } from "~/lib/utils";
import { useRequireAuth } from "~/hooks/use-require-auth";

const THEME_LABELS: Record<string, { label: string; color: string }> = {
  slate:       { label: "Midnight Slate",   color: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" },
  cyberpunk:   { label: "Cyberpunk Neon",   color: "bg-pink-500/15 text-pink-400 border-pink-500/30" },
  sunset:      { label: "Sunset Glow",      color: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  forest:      { label: "Deep Forest",      color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  skullyLight: { label: "Cute Skully Pink", color: "bg-rose-400/15 text-rose-400 border-rose-400/30" },
  skullyDark:  { label: "Gothic Skully",    color: "bg-red-500/15 text-red-400 border-red-500/30" },
  skullyNeon:  { label: "Neon Gaming",      color: "bg-green-400/15 text-green-400 border-green-400/30" },
  skullyGold:  { label: "Golden Skull",     color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
  skullyGreen: { label: "Jungle Bones",     color: "bg-lime-500/15 text-lime-400 border-lime-500/30" },
  skullyParty: { label: "Party Skeleton",   color: "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30" },
};

export default function ExplorePageView() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const { data, isLoading, isError } = trpc.forms.getPublicForms.useQuery(
    { limit: 24 },
    { enabled: !!user },
  );

  // While auth resolves (or while redirecting an anonymous visitor to /login),
  // render a thin loader rather than the public marketing chrome — the page
  // is for signed-in creators only.
  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Skull className="w-5 h-5 text-primary" />
            Skully Forms
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <Globe className="w-4 h-4" />
          <span>Public forms from the community</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-3">
          Explore <span className="text-primary">Forms</span>
        </h1>
        <p className="text-muted-foreground max-w-xl">
          Browse and fill forms created by the Skully community. No account needed to respond.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {isLoading && (
          <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading forms...</span>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <Skull className="w-8 h-8 opacity-30" />
            <p className="text-sm">Failed to load forms. Try again later.</p>
          </div>
        )}

        {!isLoading && !isError && data?.items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
            <Skull className="w-12 h-12 opacity-20" />
            <div className="text-center">
              <p className="font-semibold text-foreground">No public forms yet</p>
              <p className="text-sm mt-1">Be the first to publish a form!</p>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Create a form <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {!isLoading && data && data.items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.items.map((form) => {
              const themeInfo = THEME_LABELS[form.theme] ?? { label: form.theme, color: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" };
              return (
                <Link
                  key={form.id}
                  href={`/form/${form.slug}`}
                  className="group relative bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col gap-3"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <span className={cn("text-3xs font-semibold px-2 py-0.5 rounded-full border", themeInfo.color)}>
                      {themeInfo.label}
                    </span>
                  </div>

                  {/* Title + description */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-foreground leading-snug group-hover:text-primary transition-colors truncate">
                      {form.title}
                    </h3>
                    {form.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {form.description}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1 border-t border-border/30">
                    <span className="text-xs text-muted-foreground">
                      {form.submissionCount ?? 0} {(form.submissionCount ?? 0) === 1 ? "response" : "responses"}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Fill form <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Skull,
  Plus,
  Search,
  Grid,
  List,
  ExternalLink,
  Trash2,
  Edit3,
  BarChart3,
  Copy,
  ChevronDown,
  Sun,
  Moon,
  Folder,
  FileText,
  Palette,
  Layers,
  HelpCircle,
  LogOut,
  Loader2,
  Sparkles,
  Info
} from "lucide-react";
import { trpc } from "~/trpc/client";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { ASSETS } from "~/lib/assets";
import { useRequireAuth } from "~/hooks/use-require-auth";

// Random color arrays for Typeform-style form badge icons
const FORM_BADGE_COLORS = [
  "bg-rose-500/10 text-rose-500 border-rose-500/20",
  "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "bg-sky-500/10 text-sky-500 border-sky-500/20",
  "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "bg-teal-500/10 text-teal-500 border-teal-500/20"
];

export default function DashboardPageView() {
  const { user, logout } = useRequireAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Layout states
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWorkspace, setActiveWorkspace] = useState("My Workspace");
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);

  // Form creation modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState("");
  const [newFormDesc, setNewFormDesc] = useState("");

  // Set mounted state
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { data: forms, isLoading, refetch } = trpc.forms.getUserForms.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!user,
  });

  const createFormMutation = trpc.forms.createForm.useMutation({
    onSuccess: (data) => {
      toast.success(`Form "${data.title}" created successfully!`);
      setCreateModalOpen(false);
      setNewFormTitle("");
      setNewFormDesc("");
      refetch();
      // Optionally redirect to builder
      router.push(`/builder/${data.id}`);
    },
    onError: (err) => {
      toast.error(`Failed to create form: ${err.message}`);
    }
  });

  const deleteFormMutation = trpc.forms.deleteForm.useMutation({
    onSuccess: () => {
      toast.success("Form deleted permanently.");
      refetch();
    },
    onError: (err) => {
      toast.error(`Failed to delete form: ${err.message}`);
    }
  });

  // Action handlers
  const handleCreateFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormTitle.trim()) {
      toast.error("Please provide a form title.");
      return;
    }
    createFormMutation.mutate({
      title: newFormTitle.trim(),
      description: newFormDesc.trim() || undefined
    });
  };

  const handleDeleteForm = (formId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you absolutely sure you want to delete this form and all its submissions permanently?")) {
      deleteFormMutation.mutate({ formId });
    }
  };

  const handleCopyLink = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const publicUrl = `${window.location.origin}/form/${slug}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success("Public form URL copied to clipboard!");
  };

  // Local filtering
  const filteredForms = forms?.filter((form) =>
    form.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* ==================== 1. SIDEBAR (Typeform-style) ==================== */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-sidebar-border bg-sidebar select-none shrink-0">
        {/* Header Branding */}
        <div className="h-16 px-6 border-b border-border/50 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1 rounded-lg bg-primary/10 border border-primary/20 text-primary transition-all duration-200">
              <Skull className="w-5 h-5 fill-current" />
            </div>
            <span className="font-heading font-extrabold text-base tracking-tight text-foreground">
              Skully<span className="text-primary">Forms</span>
            </span>
          </Link>
          <span className="text-3xs font-black bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full">v1.0</span>
        </div>

        {/* Workspace Selector */}
        <div className="p-4 relative">
          <button
            onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-border bg-card/60 hover:bg-card text-left transition-all duration-200 text-xs font-bold"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary/15 text-primary flex items-center justify-center text-3xs font-black shadow-sm">
                {activeWorkspace.split(" ").map(w => w[0]).join("")}
              </div>
              <span className="truncate text-foreground/90">{activeWorkspace}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {/* Workspace Dropdown Panel */}
          {workspaceDropdownOpen && (
            <div className="absolute top-16 left-4 right-4 z-50 rounded-xl border border-border bg-card/95 shadow-xl p-1.5 space-y-1 backdrop-blur-md animate-fade-in">
              {["My Workspace", "Developer Sandbox", "Spooky Workspace"].map((w) => (
                <button
                  key={w}
                  onClick={() => {
                    setActiveWorkspace(w);
                    setWorkspaceDropdownOpen(false);
                    toast.info(`Switched to ${w}`);
                  }}
                  className={cn(
                    "w-full text-left p-2 rounded-lg text-xs transition-colors duration-150 flex items-center gap-2 font-semibold",
                    activeWorkspace === w
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Folder className="w-3.5 h-3.5" />
                  {w}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-3 py-2 space-y-1">
          <Link
            href="/dashboard"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold bg-primary/10 text-primary transition-all"
          >
            <FileText className="w-4 h-4" />
            Forms
          </Link>
          <button
            onClick={() => toast.info("Brand Kits are coming soon in Phase 3!")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
          >
            <Palette className="w-4 h-4" />
            Brand Kits
          </button>
          <button
            onClick={() => toast.info("Integrations require tRPC webhook setup.")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            Integrations
          </button>
          <button
            onClick={() => toast.info("Developer documentation available in llm-wiki.")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            System Docs
          </button>
        </div>

        {/* Developer Session Profile */}
        <div className="p-4 border-t border-border/50 bg-muted/20 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-sm shrink-0">
              <Skull className="w-5 h-5 fill-current" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-2xs font-extrabold text-foreground truncate uppercase tracking-wide">{user?.fullName || "Developer Session"}</p>
              <p className="text-4xs text-muted-foreground font-mono truncate">{user?.id || "Loading..."}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-2 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-border/60 hover:bg-destructive/10 hover:border-destructive/30 text-3xs font-extrabold hover:text-destructive transition-all cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            Leave Session
          </button>
        </div>
      </aside>

      {/* ==================== 2. MAIN PANEL ==================== */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Top Control Bar */}
        <header className="h-16 border-b border-border/50 bg-background/90 backdrop-blur-md flex items-center justify-between px-6 z-20 sticky top-0 shrink-0">
          
          {/* Search Inputs */}
          <div className="relative w-64 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search forms by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-card/45 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-foreground"
            />
          </div>

          {/* Secondary settings & Theme Toggles */}
          <div className="flex items-center gap-3">
            
            {/* Grid vs List view toggle */}
            <div className="hidden sm:flex items-center border border-border rounded-xl p-0.5 bg-card/40">
              <button
                onClick={() => setLayoutMode("grid")}
                className={cn(
                  "p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-all",
                  layoutMode === "grid" && "bg-background text-primary shadow-sm"
                )}
                aria-label="Grid Mode"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLayoutMode("list")}
                className={cn(
                  "p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-all",
                  layoutMode === "list" && "bg-background text-primary shadow-sm"
                )}
                aria-label="List Mode"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Dynamic theme switcher */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl border border-border hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all shadow-sm"
              aria-label="Toggle Theme"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-primary" />
                )
              ) : (
                <div className="w-3.5 h-3.5 rounded-full bg-muted animate-pulse" />
              )}
            </button>

            {/* Mobile Workspace Initials Indicator */}
            <div className="lg:hidden w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-black shadow-sm select-none">
              MW
            </div>

          </div>
        </header>

        {/* Stats Bar — computed from real forms data */}
        {!isLoading && !isLoading && mounted && forms && (
          <div className="grid grid-cols-4 divide-x divide-border/50 border-b border-border/50 shrink-0">
            {[
              { value: forms.length, label: "Total Forms", sub: "in workspace", accent: false },
              { value: forms.reduce((s, f) => s + f.submissionCount, 0).toLocaleString(), label: "Responses", sub: "all time", accent: true },
              { value: forms.filter(f => f.published).length, label: "Published", sub: "live now", accent: true },
              { value: forms.filter(f => !f.published).length, label: "Drafts", sub: "not live", accent: false },
            ].map((stat) => (
              <div key={stat.label} className="py-5 px-6 bg-background/60">
                <p className={`font-heading text-2xl font-extrabold tracking-tighter leading-none ${stat.accent ? "text-success" : "text-foreground"}`}>{stat.value}</p>
                <p className="text-3xs font-bold uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</p>
                <p className="text-4xs text-muted-foreground/60 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 max-w-6xl w-full mx-auto space-y-8">
          
          {/* Workspace Hello Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">{activeWorkspace}</h2>
                {forms && (
                  <span className="px-2 py-0.5 text-3xs font-extrabold rounded-full bg-primary/10 border border-primary/20 text-primary select-none uppercase tracking-wide">
                    {forms.length === 1 ? "1 Form" : `${forms.length} Forms`}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground max-w-xl">
                Typeform-style dynamic interface. Review form responses, copy public links, or click to edit layout.
              </p>
            </div>
            
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold text-primary-foreground bg-primary hover:opacity-95 rounded-xl transition-all duration-200 shadow-md shadow-primary/15 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Create form
            </button>
          </div>

          {/* Dynamic Loading State */}
          {isLoading || isLoading || !mounted ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-6 space-y-4 rounded-xl border border-border/80 bg-card/45 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-muted" />
                    <div className="w-16 h-4 bg-muted rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-3/4 h-5 bg-muted rounded" />
                    <div className="w-1/2 h-3 bg-muted rounded" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="w-16 h-7 bg-muted rounded-lg" />
                    <div className="w-16 h-7 bg-muted rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Forms Representation */
            <div className="space-y-6">
              {filteredForms.length === 0 ? (
                /* Empty state with skeleton illustration */
                <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-2xl border-2 border-dashed border-border/60 bg-card/25 backdrop-blur max-w-lg mx-auto space-y-4 animate-fade-in-up">
                  <div className="relative w-36 h-36 shrink-0">
                    <Image
                      src={ASSETS.skeletons.inBox}
                      alt="No forms yet"
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-foreground">
                      {searchQuery ? "No forms matched" : "Your crypt is empty"}
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                      {searchQuery
                        ? `No forms match "${searchQuery}". Try a different keyword.`
                        : "Create your first Skully Form and start collecting spooky responses."}
                    </p>
                  </div>
                  {!searchQuery && (
                    <button
                      onClick={() => setCreateModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-primary-foreground bg-primary hover:opacity-95 rounded-xl transition-all shadow-md shadow-primary/10 active:scale-95"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      Create first form
                    </button>
                  )}
                </div>
              ) : (
                /* Switch Grid/List views */
                layoutMode === "grid" ? (
                  /* Grid representation */
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    
                    {/* Create form shortcut card */}
                    <button
                      onClick={() => setCreateModalOpen(true)}
                      className="group p-6 h-full flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed border-border/80 hover:border-primary/50 bg-card/15 hover:bg-card/45 transition-all duration-300 min-h-[176px] cursor-pointer"
                    >
                      <div className="p-3 rounded-full bg-muted border border-border group-hover:bg-primary/15 group-hover:border-primary/30 group-hover:text-primary transition-all duration-300 shadow-sm mb-3">
                        <Plus className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <p className="text-xs font-extrabold text-foreground/90 group-hover:text-primary transition-colors">
                        Create new form
                      </p>
                      <p className="text-4xs text-muted-foreground mt-1 max-w-[150px] mx-auto select-none uppercase tracking-wide">
                        Start from scratch
                      </p>
                    </button>

                    {/* Forms cards */}
                    {filteredForms.map((form, index) => {
                      // Grab a deterministic color for the visual alphabet logo matching form title
                      const colorIndex = (form.title.charCodeAt(0) || 0) % FORM_BADGE_COLORS.length;
                      const badgeColorClass = FORM_BADGE_COLORS[colorIndex];
                      
                      return (
                        <div
                          key={form.id}
                          className="group p-6 rounded-2xl border border-border/70 hover:border-primary/40 bg-card hover:bg-card/75 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col justify-between min-h-[176px]"
                        >
                          <div className="space-y-4">
                            {/* Card Header Section */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                {/* Typeform-style clean letter logo */}
                                <div className={cn(
                                  "w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-black shadow-inner select-none",
                                  badgeColorClass
                                )}>
                                  {form.title.trim()[0]?.toUpperCase() || "F"}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-xs font-black text-foreground truncate group-hover:text-primary transition-colors pr-2">
                                    {form.title}
                                  </h3>
                                  <p className="text-4xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">
                                    {form.published ? "🟢 Live" : "⚪ Draft"}
                                  </p>
                                </div>
                              </div>
                              <span className="text-4xs font-mono font-bold bg-muted/65 text-muted-foreground px-2 py-0.5 rounded border border-border select-none shrink-0">
                                Responses: {form.submissionCount}
                              </span>
                            </div>

                            {/* Description subtext */}
                            <p className="text-3xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {form.description || "No custom description supplied for this database schema."}
                            </p>
                          </div>

                          {/* Card bottom triggers */}
                          <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-4">
                            <div className="flex items-center gap-1.5">
                              {/* Edit Builder */}
                              <Link
                                href={`/builder/${form.id}`}
                                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-200 shadow-sm"
                                title="Edit Form"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </Link>
                              
                              {/* View Responses */}
                              <Link
                                href={`/responses/${form.id}`}
                                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-200 shadow-sm"
                                title="View Responses"
                              >
                                <BarChart3 className="w-3.5 h-3.5" />
                              </Link>

                              {/* Copy Link to share */}
                              {form.published ? (
                                <button
                                  onClick={(e) => handleCopyLink(form.slug, e)}
                                  className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-200 shadow-sm cursor-pointer"
                                  title="Copy Public Link"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => toast.warning("Form is draft. Publish first to enable sharing links!")}
                                  className="p-2 rounded-lg bg-muted hover:bg-yellow-500/10 hover:text-yellow-500 text-muted-foreground/40 transition-all duration-200 shadow-sm cursor-pointer"
                                  title="Cannot Share Draft Form"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={(e) => handleDeleteForm(form.id, e)}
                              className="p-2 rounded-lg hover:bg-destructive hover:text-destructive-foreground text-muted-foreground/60 hover:text-destructive transition-all duration-200 shadow-sm cursor-pointer"
                              title="Delete Form"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                  </div>
                ) : (
                  /* List Representation */
                  <div className="border border-border/80 rounded-2xl bg-card overflow-hidden divide-y divide-border/60 shadow-sm">
                    {filteredForms.map((form) => (
                      <div
                        key={form.id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-muted/10 transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Round alphabet visual logo */}
                          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-black shadow-inner select-none shrink-0">
                            {form.title[0]?.toUpperCase() || "F"}
                          </div>
                          
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-extrabold text-foreground group-hover:text-primary transition-colors truncate">
                                {form.title}
                              </h3>
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-5xs font-black select-none uppercase tracking-wider",
                                form.published
                                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                  : "bg-muted text-muted-foreground border border-border/60"
                              )}>
                                {form.published ? "Live" : "Draft"}
                              </span>
                            </div>
                            <p className="text-3xs text-muted-foreground truncate max-w-md mt-0.5">
                              {form.description || "No description provided."}
                            </p>
                          </div>
                        </div>

                        {/* List Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 select-none shrink-0">
                          <span className="text-4xs font-mono font-bold bg-muted/65 text-muted-foreground px-2 py-0.5 rounded border border-border">
                            Submissions: {form.submissionCount}
                          </span>
                          
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/builder/${form.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-4xs font-extrabold rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-200 border border-border/50"
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit
                            </Link>
                            <Link
                              href={`/responses/${form.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-4xs font-extrabold rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-200 border border-border/50"
                            >
                              <BarChart3 className="w-3 h-3" />
                              Results
                            </Link>
                            <button
                              onClick={(e) => handleDeleteForm(form.id, e)}
                              className="p-1.5 rounded-lg border border-border/50 hover:bg-destructive hover:text-destructive-foreground text-muted-foreground/60 hover:text-destructive transition-all duration-200 cursor-pointer"
                              title="Delete Form"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}

        </div>
      </main>

      {/* ==================== 3. RADIX-STYLE CREATE FORM DIALOG ==================== */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay backdrop */}
          <div
            onClick={() => !createFormMutation.isPending && setCreateModalOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-all"
          />

          {/* Dialog Container */}
          <div className="relative w-full max-w-md p-6 space-y-6 rounded-2xl border border-border bg-card shadow-2xl z-10 animate-scale-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <h3 className="text-lg font-black text-foreground">Create New Form</h3>
              </div>
              <p className="text-2xs text-muted-foreground">
                Set up a fresh schema. You can edit layouts, visual themes, and Zod assertions inside the builder.
              </p>
            </div>

            <form onSubmit={handleCreateFormSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest">
                  Form Title
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. User Feedback Survey"
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  disabled={createFormMutation.isPending}
                  className="w-full bg-background border-b border-border/80 focus:border-primary text-xs py-2 px-1.5 outline-none text-foreground transition-colors"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="e.g. Collect responses for Skully Forms performance checks."
                  value={newFormDesc}
                  onChange={(e) => setNewFormDesc(e.target.value)}
                  disabled={createFormMutation.isPending}
                  rows={2}
                  className="w-full bg-background border border-border/60 focus:border-primary rounded-lg text-xs p-2.5 outline-none text-foreground transition-colors resize-none"
                />
              </div>

              {/* Dialog Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  disabled={createFormMutation.isPending}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createFormMutation.isPending}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:opacity-95 shadow-md shadow-primary/10 transition-all cursor-pointer"
                >
                  {createFormMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Creating Form...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      Create Form
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

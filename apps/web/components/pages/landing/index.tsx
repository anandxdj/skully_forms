"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Skull,
  Sun,
  Moon,
  Sparkles,
  Palette,
  GitBranch,
  BarChart3,
  Check,
  ArrowRight,
  ChevronDown,
  RotateCcw,
  Zap,
  Github,
  Twitter,
  Heart,
  Loader2,
  Plus,
  X,
  TrendingUp,
  Users,
  FileText,
  Star,
} from "lucide-react";
import { ASSETS } from "~/lib/assets";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";
import { toast } from "sonner";

interface FormField {
  id: string;
  type: "text" | "boba" | "checkbox" | "slider";
  label: string;
  placeholder?: string;
  value?: any;
}

export default function LandingPageView() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState("");
  const [newFormDesc, setNewFormDesc] = useState("");

  const createFormMutation = trpc.forms.createForm.useMutation({
    onSuccess: (data) => {
      toast.success(`Form "${data.title}" created!`);
      setCreateModalOpen(false);
      setNewFormTitle("");
      setNewFormDesc("");
      localStorage.setItem("x-user-id", "00000000-0000-0000-0000-000000000000");
      router.push(`/builder/${data.id}`);
    },
    onError: (err) => {
      toast.error(`Failed: ${err.message}`);
    },
  });

  const handleQuickCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormTitle.trim()) {
      toast.error("Please add a form title.");
      return;
    }
    createFormMutation.mutate({
      title: newFormTitle.trim(),
      description: newFormDesc.trim() || undefined,
    });
  };

  useEffect(() => { setMounted(true); }, []);

  const [activeFields, setActiveFields] = useState<FormField[]>([
    { id: "1", type: "text", label: "Your Name", placeholder: "e.g., Alex Johnson" },
    { id: "2", type: "boba", label: "Rate Your Experience", value: 4 },
  ]);
  const [sandboxSubmitting, setSandboxSubmitting] = useState(false);
  const [sandboxSuccess, setSandboxSuccess] = useState(false);
  const [formInputValues, setFormInputValues] = useState<Record<string, any>>({
    name: "", bobaRating: 4, skullConsent: false, spookiness: 50,
  });

  const availableFieldsList = [
    { id: "text", type: "text", label: "Text Input", description: "Standard short answer" },
    { id: "boba", type: "boba", label: "Boba Rating", description: "Boba cup scale (1–5)" },
    { id: "checkbox", type: "checkbox", label: "Agreement Box", description: "Checkbox for consent" },
    { id: "slider", type: "slider", label: "Range Slider", description: "Numeric range input" },
  ];

  const handleToggleField = (fieldType: string) => {
    const exists = activeFields.find(f => f.type === fieldType);
    if (exists) {
      if (activeFields.length > 1) setActiveFields(activeFields.filter(f => f.type !== fieldType));
    } else {
      const fieldMap: Record<string, FormField> = {
        text: { id: "text-" + Date.now(), type: "text", label: "Your Name", placeholder: "e.g., Alex Johnson" },
        boba: { id: "boba-" + Date.now(), type: "boba", label: "Rate Your Experience", value: 4 },
        checkbox: { id: "check-" + Date.now(), type: "checkbox", label: "I agree to the terms", value: false },
        slider: { id: "slide-" + Date.now(), type: "slider", label: "Satisfaction Level", value: 50 },
      };
      setActiveFields([...activeFields, fieldMap[fieldType]]);
    }
  };

  const handleSandboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSandboxSubmitting(true);
    setTimeout(() => { setSandboxSubmitting(false); setSandboxSuccess(true); }, 1500);
  };

  const handleResetSandbox = () => {
    setSandboxSuccess(false);
    setFormInputValues({ name: "", bobaRating: 4, skullConsent: false, spookiness: 50 });
  };

  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* ── NAVIGATION ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 transition-colors group-hover:bg-primary/20">
              <Skull className="w-5 h-5 text-primary fill-current" />
            </div>
            <span className="font-heading font-extrabold text-lg tracking-tight text-foreground">
              Skully<span className="text-primary">Forms</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {[
              { label: "Product", href: "#", dropdown: true },
              { label: "Templates", href: "#sandbox", dropdown: false },
              { label: "Pricing", href: "#pricing", dropdown: false },
              { label: "Resources", href: "#", dropdown: true },
            ].map((item) => (
              <a key={item.label} href={item.href}
                className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200">
                {item.label}
                {item.dropdown && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl border border-border/70 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === "dark"
                  ? <Sun className="w-4 h-4 text-amber-400" />
                  : <Moon className="w-4 h-4 text-primary" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
              )}
            </button>
            <Link href="/login"
              className="text-sm font-semibold text-muted-foreground hover:text-foreground px-3 py-2 transition-colors duration-200">
              Log in
            </Link>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-primary-foreground bg-primary hover:opacity-95 rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Get started free
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-section-peach pt-16 pb-24 md:pb-32 lg:py-32">
        {/* Soft background blobs */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-l from-background/60 via-section-peach/40 to-transparent" />
          <div className="absolute top-[8%] right-[-8%] w-[520px] h-[520px] rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-accent-purple/5 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                AI-powered form builder
              </div>

              <h1 className="font-heading text-5xl sm:text-6xl md:text-[64px] font-extrabold tracking-tight leading-[1.08] text-foreground max-w-xl">
                Forms that don&apos;t{" "}
                <span className="text-primary relative">
                  feel like
                </span>{" "}
                forms
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">
                Create beautiful, one-question-at-a-time forms that earn more completions and richer data from every respondent.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-primary-foreground bg-primary hover:opacity-95 rounded-xl shadow-md shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  Get started free
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a href="#sandbox"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-foreground border border-border bg-background/80 hover:bg-background rounded-xl transition-all duration-200">
                  See it live
                </a>
              </div>

              <div className="pt-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 mb-3 select-none">
                  Trusted by teams worldwide
                </p>
                <div className="flex flex-wrap items-center gap-x-7 gap-y-3 opacity-30 hover:opacity-60 transition-opacity duration-300 select-none">
                  {["loom", "Notion", "webflow", "_zapier", "HubSpot", "mailchimp"].map(b => (
                    <span key={b} className="text-sm font-extrabold font-mono tracking-tighter text-foreground">{b}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Illustration */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[440px] aspect-[1.4/1] select-none animate-float">
                {mounted && (
                  <Image
                    src={theme === "dark" ? ASSETS.illustrations.heroSkeletonDark : ASSETS.illustrations.heroSkeleton}
                    alt="Skully hero illustration — skeleton with boba tea"
                    fill
                    className="object-contain"
                    priority
                  />
                )}
                {!mounted && (
                  <div className="w-full h-full rounded-2xl bg-primary/5 animate-pulse" />
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────── */}
      <section className="py-14 border-y border-border/40 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/40">
            {[
              { value: "12,400+", label: "Forms Created",        icon: FileText,   color: "text-primary" },
              { value: "1.2M+",   label: "Responses Collected",  icon: TrendingUp, color: "text-accent-purple" },
              { value: "94.7%",   label: "Avg Completion Rate",  icon: Star,       color: "text-success" },
              { value: "50+",     label: "Field Types",          icon: Users,      color: "text-success" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center gap-2 py-8 px-4">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <p className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tighter leading-none">
                  {s.value}
                </p>
                <p className="text-xs font-semibold text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <p className="text-xs font-extrabold tracking-widest uppercase text-primary">Built for Creators</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Say goodbye to dull, boring forms.
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Modular, high-fidelity form components with beautiful themes, advanced logic, and real-time analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Sparkles,
                label: "AI Form Builder",
                color: "text-primary",
                bg: "bg-primary/10",
                desc: "Describe what you need — our AI generates logic trees, field types, and layouts automatically.",
              },
              {
                icon: Palette,
                label: "Dynamic Themes",
                color: "text-accent-purple",
                bg: "bg-accent-purple/10",
                desc: "Beautiful palettes, custom shapes, and smooth blur effects. Fully responsive light and dark themes.",
              },
              {
                icon: GitBranch,
                label: "Logic Branching",
                color: "text-accent-cyan",
                bg: "bg-accent-cyan/10",
                desc: "Design multi-path conditional flows with an intuitive visual builder. Branch on any answer.",
              },
              {
                icon: BarChart3,
                label: "Deep Analytics",
                color: "text-success",
                bg: "bg-success-bg",
                desc: "Visual drop-off charts, real-time responses, and completion rates. Privacy-first by default.",
              },
            ].map((f) => (
              <div
                key={f.label}
                className="bg-card border border-border/60 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.015] group"
              >
                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-heading text-base font-bold text-foreground mb-2">{f.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SANDBOX ──────────────────────────────────────────────────── */}
      <section id="sandbox" className="py-24 bg-section-peach relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14 space-y-4">
            <p className="text-xs font-extrabold tracking-widest uppercase text-primary">Interactive Preview</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Build and interact in real time.
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Toggle fields on the left and watch them instantly populate the live mobile preview.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch max-w-5xl mx-auto">

            {/* Left: Field Palette */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-border/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Field Palette</span>
                  <span className="text-xs font-mono text-muted-foreground bg-background/80 px-2 py-0.5 rounded-lg border border-border/50">
                    Toggle fields
                  </span>
                </div>

                <div className="space-y-2.5">
                  {availableFieldsList.map((field) => {
                    const isAdded = activeFields.some(f => f.type === field.type);
                    return (
                      <button
                        key={field.id}
                        onClick={() => handleToggleField(field.type)}
                        className={cn(
                          "w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group cursor-pointer",
                          isAdded
                            ? "bg-primary/8 border-primary/30 shadow-sm"
                            : "bg-background/70 hover:bg-background border-border/60 hover:border-border"
                        )}
                      >
                        <div>
                          <p className={cn("text-sm font-semibold", isAdded ? "text-primary" : "text-foreground")}>
                            {field.label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{field.description}</p>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ml-3",
                          isAdded
                            ? "bg-primary border-primary"
                            : "border-border/60 group-hover:border-muted-foreground/40"
                        )}>
                          {isAdded && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-background/60 border border-border/50 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
                <p className="text-xs text-muted-foreground font-medium">Live sync active — changes reflect instantly.</p>
              </div>
            </div>

            {/* Right: Phone Mockup */}
            <div className="lg:col-span-7 flex justify-center items-center">
              <div className="relative w-full max-w-[310px] aspect-[9/18.5] bg-[#0c0c0e] rounded-[44px] p-3 shadow-2xl border-4 border-[#1e1e24] flex flex-col overflow-hidden animate-pulseGlow">

                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-xl z-20" />

                {/* Screen */}
                <div className="flex-1 bg-[#131317] rounded-[32px] overflow-hidden flex flex-col relative p-5 pt-9 border border-white/5">
                  {/* Status bar */}
                  <div className="absolute top-2 left-5 right-5 flex items-center justify-between text-[9px] font-mono text-white/30 select-none">
                    <span>9:41</span>
                    <span>5G ▓▓▓</span>
                  </div>

                  {sandboxSuccess ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 animate-fade-in">
                      <div className="w-14 h-14 rounded-full bg-success/15 border border-success/30 flex items-center justify-center">
                        <Check className="w-7 h-7 text-success stroke-[2.5]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">Response Submitted!</h4>
                        <p className="text-xs text-white/45 max-w-[170px] mx-auto leading-relaxed">
                          Your response has been recorded.
                        </p>
                      </div>
                      <button
                        onClick={handleResetSandbox}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/15 border border-primary/25 px-3 py-1.5 rounded-lg hover:bg-primary/25 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSandboxSubmit} className="flex-1 flex flex-col justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Skull className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[9px] font-extrabold tracking-widest text-primary uppercase">Skully Forms</span>
                        </div>
                        <h3 className="text-xs font-bold text-white leading-tight">The Spooky Evaluation</h3>
                        <p className="text-[9px] text-white/40">Complete all fields to continue.</p>
                      </div>

                      <div className="flex-1 my-4 overflow-y-auto space-y-3.5 scrollbar-none">
                        {activeFields.map((field) => (
                          <div key={field.id} className="space-y-1 text-left">
                            <label className="flex items-center justify-between text-[9px] font-bold text-white/50 uppercase tracking-wider">
                              <span>{field.label}</span>
                              <span className="text-primary text-[8px] normal-case tracking-normal font-semibold">Required</span>
                            </label>

                            {field.type === "text" && (
                              <input
                                type="text"
                                required
                                value={formInputValues.name}
                                onChange={(e) => setFormInputValues({ ...formInputValues, name: e.target.value })}
                                placeholder={field.placeholder}
                                className="w-full bg-white/5 border-b border-white/15 focus:border-primary text-xs py-1.5 px-1 outline-none text-white transition-colors placeholder:text-white/20"
                              />
                            )}

                            {field.type === "boba" && (
                              <div className="flex items-center gap-1.5 pt-0.5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <button
                                    type="button"
                                    key={i}
                                    onClick={() => setFormInputValues({ ...formInputValues, bobaRating: i })}
                                    className="text-base transition-transform hover:scale-125 cursor-pointer"
                                  >
                                    <span className={cn("filter transition-all", i <= formInputValues.bobaRating ? "opacity-100" : "opacity-25 grayscale")}>
                                      🧋
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}

                            {field.type === "checkbox" && (
                              <div className="flex items-start gap-2 pt-1">
                                <input
                                  type="checkbox"
                                  id="mock-consent"
                                  checked={formInputValues.skullConsent}
                                  onChange={(e) => setFormInputValues({ ...formInputValues, skullConsent: e.target.checked })}
                                  className="w-3 h-3 mt-0.5 accent-primary cursor-pointer"
                                />
                                <label htmlFor="mock-consent" className="text-[9px] text-white/40 leading-tight cursor-pointer">
                                  I agree to the terms and conditions.
                                </label>
                              </div>
                            )}

                            {field.type === "slider" && (
                              <div className="space-y-1 pt-0.5">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={formInputValues.spookiness}
                                  onChange={(e) => setFormInputValues({ ...formInputValues, spookiness: parseInt(e.target.value) })}
                                  className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-[8px] font-mono text-white/30">
                                  <span>Low</span>
                                  <span className="text-primary font-bold">{formInputValues.spookiness}%</span>
                                  <span>High</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={sandboxSubmitting}
                        className="w-full py-2 px-4 rounded-xl text-xs font-bold text-white bg-primary hover:opacity-90 flex items-center justify-center gap-1.5 transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {sandboxSubmitting ? (
                          <>
                            <div className="w-3 h-3 rounded-full border border-t-transparent border-white animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>Submit <ArrowRight className="w-3 h-3" /></>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* Home bar */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/10 rounded-full z-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-section-lavender relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <p className="text-xs font-extrabold tracking-widest uppercase text-primary">Simple Pricing</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              A plan for every project.
            </h2>
            <p className="text-base text-muted-foreground">No hidden fees. Scale as your volume grows. Cancel anytime.</p>

            {/* Billing toggle */}
            <div className="inline-flex items-center p-1 bg-background/80 border border-border/60 rounded-xl backdrop-blur-sm">
              {(["monthly", "annual"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setBillingPeriod(p)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize flex items-center gap-1.5 cursor-pointer",
                    billingPeriod === p
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p}
                  {p === "annual" && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-success text-success-foreground font-extrabold uppercase">
                      −20%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">

            {/* Free */}
            <div className="bg-background/80 border border-border/60 rounded-2xl p-7 shadow-sm flex flex-col backdrop-blur-sm">
              <div className="flex-1 space-y-5">
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">Spooky Seed</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">For creators just starting out.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-extrabold text-foreground">$0</span>
                  <span className="text-xs text-muted-foreground">/ forever</span>
                </div>
                <ul className="space-y-2.5 pt-2 border-t border-border/40">
                  {["3 Active Forms", "100 Responses / month", "Standard Themes", "Community Support"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="/login"
                className="mt-7 w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold text-foreground border border-border/70 hover:bg-muted/60 transition-colors">
                Start for Free
              </a>
            </div>

            {/* Pro — highlighted */}
            <div className="bg-background border-2 border-primary rounded-2xl p-7 shadow-xl flex flex-col relative lg:scale-[1.03] z-10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-extrabold uppercase tracking-wide shadow-md shadow-primary/20">
                Most Popular
              </div>
              <div className="flex-1 space-y-5">
                <div>
                  <h3 className="font-heading text-lg font-extrabold text-foreground flex items-center gap-1.5">
                    Necromancer <Zap className="w-4 h-4 text-primary fill-primary" />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">For scaling startups and serious creators.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-extrabold text-foreground">
                    {billingPeriod === "monthly" ? "$29" : "$23"}
                  </span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>
                <ul className="space-y-2.5 pt-2 border-t border-border/40">
                  {[
                    ["Unlimited Active Forms", true],
                    ["10,000 Responses / month", true],
                    ["Custom High-Glow Themes", false],
                    ["Advanced AI Generator", false],
                    ["Webhook Integrations", false],
                    ["Priority Email Support", false],
                  ].map(([f, bold]) => (
                    <li key={f as string} className="flex items-center gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className={cn(bold ? "text-foreground font-semibold" : "text-muted-foreground")}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a href="/login"
                className="mt-7 w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold text-primary-foreground bg-primary hover:opacity-95 shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Get Necromancer
              </a>
            </div>

            {/* Enterprise */}
            <div className="bg-background/80 border border-border/60 rounded-2xl p-7 shadow-sm flex flex-col backdrop-blur-sm">
              <div className="flex-1 space-y-5">
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">Skull Overlord</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Enterprise-grade security and scale.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-extrabold text-foreground">
                    {billingPeriod === "monthly" ? "$149" : "$119"}
                  </span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>
                <ul className="space-y-2.5 pt-2 border-t border-border/40">
                  {[
                    ["Unlimited Active Forms", true],
                    ["Unlimited Responses", true],
                    ["White-label Branding", false],
                    ["Custom Domains + SSL", false],
                    ["SLA Uptime Guarantee", false],
                    ["Dedicated Slack / Zoom", false],
                  ].map(([f, bold]) => (
                    <li key={f as string} className="flex items-center gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span className={cn(bold ? "text-foreground font-semibold" : "text-muted-foreground")}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a href="mailto:overlord@skullyforms.com?subject=Enterprise Query"
                className="mt-7 w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold text-foreground border border-border/70 hover:bg-muted/60 transition-colors">
                Contact Sales
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="bg-section-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">

            {/* Brand */}
            <div className="md:col-span-4 space-y-4">
              <Link href="/" className="flex items-center gap-2.5 group w-fit">
                <div className="p-1.5 rounded-lg bg-primary/20 border border-primary/30">
                  <Skull className="w-5 h-5 text-primary fill-current" />
                </div>
                <span className="font-heading font-extrabold text-lg tracking-tight text-white">
                  Skully<span className="text-primary">Forms</span>
                </span>
              </Link>
              <p className="text-xs text-white/45 leading-relaxed max-w-sm">
                Premium, whimsical form-building with AI assistance, dynamic themes, and deep analytics.
              </p>
              <div className="flex items-center gap-3">
                {[Twitter, Github].map((Icon, i) => (
                  <a key={i} href="#"
                    className="p-2 rounded-lg border border-white/10 hover:bg-white/10 text-white/45 hover:text-white transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {[
                { title: "Product",   links: ["Features", "Sandbox", "Pricing", "Templates"] },
                { title: "Resources", links: ["Docs", "Guides", "Help Center", "API Reference"] },
                { title: "Company",   links: ["About Us", "Careers", "Press", "Contact"] },
                { title: "Legal",     links: ["Terms", "Privacy", "Cookies", "Security"] },
              ].map((col) => (
                <div key={col.title} className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/60">{col.title}</p>
                  <ul className="space-y-2">
                    {col.links.map(l => (
                      <li key={l}>
                        <a href="#" className="text-xs text-white/35 hover:text-primary transition-colors">{l}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
            <p>© {new Date().getFullYear()} Skully Forms Inc. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              Made with <Heart className="w-3.5 h-3.5 text-primary fill-primary animate-pulse" /> in the spooky catacombs.
            </p>
          </div>
        </div>
      </footer>

      {/* ── CREATE FORM MODAL ─────────────────────────────────────────── */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => !createFormMutation.isPending && setCreateModalOpen(false)}
            className="absolute inset-0 bg-foreground/25 backdrop-blur-md animate-fade-in"
          />

          <div className="relative w-full max-w-md p-7 space-y-5 rounded-3xl border border-border bg-card shadow-2xl z-10 animate-scale-in">
            <div className="space-y-1.5 relative">
              <button
                onClick={() => setCreateModalOpen(false)}
                disabled={createFormMutation.isPending}
                className="absolute right-0 top-0 p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                  <Skull className="w-4 h-4 text-primary fill-current" />
                </div>
                <h3 className="font-heading text-base font-bold text-foreground">Create New Form</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Launch a new form and open the visual builder instantly.
              </p>
            </div>

            <form onSubmit={handleQuickCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Form Title
                  <span className="text-primary font-bold font-mono normal-case text-xs">Required</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g., Customer Satisfaction Survey"
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  disabled={createFormMutation.isPending}
                  className="w-full bg-background border-b border-border/80 focus:border-primary text-sm py-2 px-1 outline-none text-foreground transition-colors font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Description
                  <span className="text-muted-foreground/60 font-semibold font-mono normal-case text-xs">Optional</span>
                </label>
                <textarea
                  placeholder="Brief description of the form's purpose..."
                  value={newFormDesc}
                  onChange={(e) => setNewFormDesc(e.target.value)}
                  disabled={createFormMutation.isPending}
                  rows={2}
                  className="w-full bg-background border border-border/60 focus:border-primary rounded-xl text-sm p-2.5 outline-none text-foreground transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  disabled={createFormMutation.isPending}
                  className="px-4 py-2.5 rounded-xl border border-border hover:bg-muted text-sm font-semibold text-foreground transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createFormMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-primary-foreground bg-primary hover:opacity-95 shadow-md shadow-primary/10 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  {createFormMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
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

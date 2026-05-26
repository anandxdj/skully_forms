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
  ChevronRight,
  ChevronDown,
  Terminal,
  Play,
  RotateCcw,
  Zap,
  Shield,
  Layers,
  HelpCircle,
  Github,
  Twitter,
  Heart,
  Loader2,
  Plus,
  X
} from "lucide-react";
import { ASSETS } from "~/lib/assets";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";
import { toast } from "sonner";

// Custom type for sandbox fields
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

  // Quick form creation states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState("");
  const [newFormDesc, setNewFormDesc] = useState("");

  // tRPC Create Form Mutation
  const createFormMutation = trpc.forms.createForm.useMutation({
    onSuccess: (data) => {
      toast.success(`Form "${data.title}" created successfully!`);
      setCreateModalOpen(false);
      setNewFormTitle("");
      setNewFormDesc("");
      // Set dev user bypass context
      localStorage.setItem("x-user-id", "00000000-0000-0000-0000-000000000000");
      router.push(`/builder/${data.id}`);
    },
    onError: (err) => {
      toast.error(`Failed to create form: ${err.message}`);
    }
  });

  // Action handler
  const handleQuickCreateSubmit = (e: React.FormEvent) => {
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

  // Prevent Next.js hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sandbox State
  const [activeFields, setActiveFields] = useState<FormField[]>([
    { id: "1", type: "text", label: "Full Spooky Name", placeholder: "e.g., Jack O. Lantern" },
    { id: "2", type: "boba", label: "Rate Our Boba Preference 🧋", value: 4 },
  ]);

  const [sandboxSubmitting, setSandboxSubmitting] = useState(false);
  const [sandboxSuccess, setSandboxSuccess] = useState(false);

  // Mock responses inside phone mockup
  const [formInputValues, setFormInputValues] = useState<Record<string, any>>({
    name: "",
    bobaRating: 4,
    skullConsent: false,
    spookiness: 50,
  });

  // Available fields that can be toggled/added
  const availableFieldsList = [
    { id: "text", type: "text", label: "Text Input", description: "Standard text question" },
    { id: "boba", type: "boba", label: "Boba Rating 🧋", description: "Boba cup-based rating scale" },
    { id: "checkbox", type: "checkbox", label: "Skull Checkbox 💀", description: "A whimsical agreement box" },
    { id: "slider", type: "slider", label: "Skeleton Slider 🦴", description: "🦴 Bone-shaped range slider" }
  ];

  const handleToggleField = (fieldType: string) => {
    const exists = activeFields.find(f => f.type === fieldType);
    if (exists) {
      // Remove it (keep at least 1)
      if (activeFields.length > 1) {
        setActiveFields(activeFields.filter(f => f.type !== fieldType));
      }
    } else {
      // Add it
      let newField: FormField;
      if (fieldType === "text") {
        newField = { id: "text-" + Date.now(), type: "text", label: "Full Spooky Name", placeholder: "e.g., Jack O. Lantern" };
      } else if (fieldType === "boba") {
        newField = { id: "boba-" + Date.now(), type: "boba", label: "Rate Our Boba Preference 🧋", value: 4 };
      } else if (fieldType === "checkbox") {
        newField = { id: "checkbox-" + Date.now(), type: "checkbox", label: "Accept the terms of the Skull 💀", value: false };
      } else {
        newField = { id: "slider-" + Date.now(), type: "slider", label: "Spookiness Level 🦴", value: 50 };
      }
      setActiveFields([...activeFields, newField]);
    }
  };

  const handleSandboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSandboxSubmitting(true);
    setTimeout(() => {
      setSandboxSubmitting(false);
      setSandboxSuccess(true);
    }, 1500);
  };

  const handleResetSandbox = () => {
    setSandboxSuccess(false);
    setFormInputValues({
      name: "",
      bobaRating: 4,
      skullConsent: false,
      spookiness: 50,
    });
  };

  // Pricing State
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans selection:bg-primary/20 selection:text-foreground relative">
      
      {/* Global CSS Keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulseGlow {
          0%, 100% { border-color: var(--border); box-shadow: 0 0 15px rgba(228, 143, 144, 0.05); }
          50% { border-color: var(--primary); box-shadow: 0 0 25px rgba(228, 143, 144, 0.15); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulseGlow {
          animation: pulseGlow 4s infinite ease-in-out;
        }
      `}</style>

      {/* ==================== 1. NAVIGATION BAR ==================== */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary transition-all duration-200 shadow-sm">
              <Skull className="w-5 h-5 fill-current" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-foreground transition-colors duration-200">
              Skully Forms
            </span>
          </Link>

          {/* Standard Navigation Links matching the mock exactly */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary cursor-pointer transition-colors duration-200 select-none">
              <span>Product</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
            <a href="#features" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors duration-200">
              Templates
            </a>
            <a href="#pricing" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors duration-200">
              Pricing
            </a>
            <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary cursor-pointer transition-colors duration-200 select-none">
              <span>Resources</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </nav>

          {/* Right Actions & Theme Toggle */}
          <div className="flex items-center gap-4">
            {/* Functional Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl border border-border/70 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 shadow-sm"
              aria-label="Toggle Theme"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-primary" />
                )
              ) : (
                <div className="w-4.5 h-4.5 rounded-full bg-muted animate-pulse" />
              )}
            </button>

            {/* CTAs */}
            <Link
              href="/login"
              className="text-sm font-bold text-muted-foreground hover:text-foreground px-3 py-2 transition-colors duration-200"
            >
              Log in
            </Link>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center justify-center text-sm font-bold text-primary-foreground bg-primary hover:opacity-95 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Get started free
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2. HERO SECTION ==================== */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 lg:py-32">
        {/* Soft Organic Wavy Gradients matching the mockup image */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-l from-[#FAF8F5] via-[#F9EAE1]/70 to-transparent opacity-95 dark:opacity-20" />
          <div className="absolute top-[10%] right-[-10%] w-[580px] h-[580px] rounded-full bg-[#F5DCD0]/45 blur-[90px] dark:opacity-20" />
          
          {/* Subtle Organic Bottom Wave Accent */}
          <svg className="absolute bottom-0 left-0 w-full h-[15%] text-background fill-current" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,32 C320,80 720,80 1080,32 L1440,0 L1440,120 L0,120 Z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Side */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 md:space-y-7">
              
              {/* Bold Solid Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-[56px] font-black tracking-tight leading-[1.15] text-foreground max-w-xl">
                Forms that don&apos;t feel like forms
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-muted-foreground/90 font-medium max-w-lg leading-relaxed">
                Create beautiful, one-question-at-a-time forms that get more responses and better data.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 w-full sm:w-auto pt-2">
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-primary-foreground bg-primary hover:opacity-95 rounded-xl transition-all duration-200 shadow-md shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Get started free
                </button>
                <a
                  href="#sandbox"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-foreground border border-border bg-background/50 hover:bg-muted/50 rounded-xl transition-all duration-200"
                >
                  View templates
                </a>
              </div>

              {/* Grayscale Trusted Banner */}
              <div className="pt-10 w-full">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/75 mb-4 select-none">
                  Trusted by teams around the world
                </p>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 opacity-40 hover:opacity-75 transition-all duration-300 select-none">
                  <span className="text-sm font-extrabold font-mono tracking-tighter text-foreground">loom</span>
                  <span className="text-sm font-bold font-mono tracking-tighter text-foreground">Notion</span>
                  <span className="text-sm font-extrabold font-mono tracking-tighter text-foreground">webflow</span>
                  <span className="text-sm font-bold font-mono tracking-tighter text-foreground">_zapier</span>
                  <span className="text-sm font-extrabold font-mono tracking-tighter text-foreground">HubSpot</span>
                  <span className="text-sm font-bold font-mono tracking-tighter text-foreground">mailchimp</span>
                </div>
              </div>

            </div>

            {/* Right Hero Side: Boba Skeleton sits natively on wavy background */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[460px] aspect-[1.55/1] select-none animate-float">
                <Image
                  src={mounted && theme === "dark" ? ASSETS.illustrations.heroSkeletonDark : ASSETS.illustrations.heroSkeleton}
                  alt="Skully Hero Boba Skeleton Illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 3. FEATURES GRID ==================== */}
      <section id="features" className="py-24 bg-muted/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-black tracking-widest uppercase text-[#ff2e8c]">
              Built for Creators
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Say goodbye to dull, boring questions.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our skull-infused modular systems offer unparalleled high-fidelity layouts, advanced mechanics, and beautiful, customizable glows.
            </p>
          </div>

          {/* 4 Gorgeous Glassmorphic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="group relative bg-card/50 hover:bg-card/75 border border-border/70 hover:border-[#ff2e8c]/35 rounded-2xl p-8 backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(255,46,140,0.1)] hover:scale-[1.01]">
              <div className="w-12 h-12 rounded-xl bg-[#ff2e8c]/10 text-[#ff2e8c] border border-[#ff2e8c]/25 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                AI Form Builder
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Describe your requirements in plain speech. Our AI necromancy engine designs logic trees, custom layouts, and type-safe payloads automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-card/50 hover:bg-card/75 border border-border/70 hover:border-[#9d4edd]/35 rounded-2xl p-8 backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(157,78,221,0.1)] hover:scale-[1.01]">
              <div className="w-12 h-12 rounded-xl bg-[#9d4edd]/10 text-[#9d4edd] border border-[#9d4edd]/25 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                Dynamic Themes
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unlock high-fidelity neon palettes, custom squircle shapes, and smooth backdrop blurs. Fully responsive light and dark themes out-of-the-box.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-card/50 hover:bg-card/75 border border-border/70 hover:border-[#00f5ff]/35 rounded-2xl p-8 backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(0,245,255,0.1)] hover:scale-[1.01]">
              <div className="w-12 h-12 rounded-xl bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/25 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <GitBranch className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                Logic Branching
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Link questions like joints and bones. Design intricate multi-path structures with our highly intuitive and responsive conditional visual flow.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-card/50 hover:bg-card/75 border border-border/70 hover:border-[#ff2e8c]/35 rounded-2xl p-8 backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(255,46,140,0.1)] hover:scale-[1.01]">
              <div className="w-12 h-12 rounded-xl bg-[#ff2e8c]/10 text-[#ff2e8c] border border-[#ff2e8c]/25 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                Deep Analytics
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dive into visual drop-off charts, real-time responses, and emoji sentiment ratings. Track metrics without violating user privacy rules.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 4. INTERACTIVE SANDBOX BUILDER WIDGET ==================== */}
      <section id="sandbox" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-xs font-black tracking-widest uppercase text-[#ff2e8c]">
              Interactive Sandbox
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Build and interact in real time.
            </p>
            <p className="text-lg text-muted-foreground">
              Toggle form components on the left and watch them instantly populate the high-fidelity virtual mobile preview on the right! Try interacting with the fields inside the mockup!
            </p>
          </div>

          {/* Sandbox Widget Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto">
            
            {/* Left Column: Builder Controls (5 columns) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              {/* Field Palette */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-xs font-bold uppercase text-muted-foreground">Field Palette</span>
                  <span className="text-2xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded">Select & Toggle</span>
                </div>
                
                <div className="space-y-3">
                  {availableFieldsList.map((field) => {
                    const isAdded = activeFields.some(f => f.type === field.type);
                    return (
                      <button
                        key={field.id}
                        onClick={() => handleToggleField(field.type)}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start justify-between group",
                          isAdded
                            ? "bg-gradient-to-r from-[#ff2e8c]/5 to-[#9d4edd]/5 border-[#ff2e8c]/40 shadow-sm"
                            : "bg-card/45 hover:bg-card/85 border-border/80 hover:border-muted-foreground/30"
                        )}
                      >
                        <div>
                          <p className={cn("text-sm font-bold transition-colors", isAdded ? "text-[#ff2e8c]" : "text-foreground")}>
                            {field.label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {field.description}
                          </p>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                          isAdded 
                            ? "bg-[#ff2e8c] border-[#ff2e8c] text-white scale-110" 
                            : "border-border text-transparent group-hover:border-muted-foreground/50"
                        )}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="bg-card/35 border border-border p-4.5 rounded-2xl flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-mono text-muted-foreground">
                  Virtual screen synced perfectly. Fully reactive.
                </p>
              </div>

            </div>

            {/* Right Column: Virtual Phone Mockup (7 columns) */}
            <div className="lg:col-span-7 flex justify-center items-center">
              <div className="relative w-full max-w-[340px] aspect-[9/18.5] bg-[#0c0c0e] rounded-[48px] p-3.5 shadow-2xl border-4 border-[#1e1e24] flex flex-col overflow-hidden animate-pulseGlow">
                
                {/* Phone Speaker Notch */}
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20 flex items-center justify-center">
                  <div className="w-12 h-1 bg-[#1e1e24] rounded-full" />
                </div>

                {/* Inner Screen Container */}
                <div className="flex-1 bg-[#131317] rounded-[36px] overflow-hidden flex flex-col relative p-6 pt-10 border border-white/5 selection:bg-[#ff2e8c] selection:text-white">
                  
                  {/* Status Bar */}
                  <div className="absolute top-2 left-6 right-6 flex items-center justify-between text-3xs font-mono text-muted-foreground/60 select-none">
                    <span>9:41 AM</span>
                    <div className="flex items-center gap-1.5">
                      <span>5G</span>
                      <div className="w-5 h-2.5 rounded bg-muted-foreground/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-muted-foreground/80 w-4/5" />
                      </div>
                    </div>
                  </div>

                  {sandboxSuccess ? (
                    /* 4.1 Mockup SUCCESS Screen */
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 animate-fade-in">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/35 flex items-center justify-center shadow-lg shadow-emerald-500/5 animate-bounce">
                        <Skull className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-base font-bold text-foreground">Form Submitted!</h4>
                        <p className="text-xs text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                          Your response has been sealed in the obsidian registry.
                        </p>
                      </div>
                      <button
                        onClick={handleResetSandbox}
                        className="inline-flex items-center gap-1.5 text-2xs font-black text-[#ff2e8c] bg-[#ff2e8c]/10 border border-[#ff2e8c]/20 px-3.5 py-1.5 rounded-lg hover:bg-[#ff2e8c]/20 transition-all active:scale-95"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Mockup
                      </button>
                    </div>
                  ) : (
                    /* 4.2 Mockup ACTIVE FORM Screen */
                    <form onSubmit={handleSandboxSubmit} className="flex-1 flex flex-col justify-between">
                      
                      {/* Top Header */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <Skull className="w-4 h-4 text-[#ff2e8c]" />
                          <span className="text-3xs font-black tracking-widest text-[#ff2e8c] uppercase">Skully Forms</span>
                        </div>
                        <h3 className="text-sm font-bold text-foreground leading-tight">
                          The Spooky Evaluation Form
                        </h3>
                        <p className="text-3xs text-muted-foreground">
                          Please complete this form to unlock your test.
                        </p>
                      </div>

                      {/* Dynamic Fields List */}
                      <div className="flex-1 my-6 overflow-y-auto space-y-4 pr-1 scrollbar-none">
                        {activeFields.map((field) => (
                          <div key={field.id} className="space-y-1.5 text-left">
                            <label className="text-3xs font-black text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                              <span>{field.label}</span>
                              <span className="text-4xs text-[#ff2e8c] font-mono">Required</span>
                            </label>

                            {field.type === "text" && (
                              <input
                                type="text"
                                required
                                value={formInputValues.name}
                                onChange={(e) => setFormInputValues({ ...formInputValues, name: e.target.value })}
                                placeholder={field.placeholder}
                                className="w-full bg-[#08080a] border-b border-border/80 focus:border-[#ff2e8c] text-xs py-1.5 px-1 outline-none text-foreground transition-colors"
                              />
                            )}

                            {field.type === "boba" && (
                              <div className="flex items-center gap-2 pt-1">
                                {[1, 2, 3, 4, 5].map((index) => (
                                  <button
                                    type="button"
                                    key={index}
                                    onClick={() => setFormInputValues({ ...formInputValues, bobaRating: index })}
                                    className="text-lg transition-transform hover:scale-125 focus:outline-none"
                                  >
                                    <span className={cn(
                                      "filter transition-all",
                                      index <= formInputValues.bobaRating ? "opacity-100 drop-shadow-[0_0_4px_rgba(255,46,140,0.3)]" : "opacity-35 grayscale"
                                    )}>
                                      🧋
                                    </span>
                                  </button>
                                ))}
                                <span className="text-3xs font-mono text-muted-foreground ml-1">
                                  ({formInputValues.bobaRating}/5)
                                </span>
                              </div>
                            )}

                            {field.type === "checkbox" && (
                              <div className="flex items-start gap-2.5 pt-1.5">
                                <input
                                  type="checkbox"
                                  id="mock-consent"
                                  checked={formInputValues.skullConsent}
                                  onChange={(e) => setFormInputValues({ ...formInputValues, skullConsent: e.target.checked })}
                                  className="w-3.5 h-3.5 mt-0.5 rounded border-border text-[#ff2e8c] accent-[#ff2e8c] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                />
                                <label htmlFor="mock-consent" className="text-4xs text-muted-foreground leading-tight cursor-pointer select-none">
                                  I agree that my anonymized soul rating will be processed in the ledger database.
                                </label>
                              </div>
                            )}

                            {field.type === "slider" && (
                              <div className="space-y-1.5 pt-1">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={formInputValues.spookiness}
                                  onChange={(e) => setFormInputValues({ ...formInputValues, spookiness: parseInt(e.target.value) })}
                                  className="w-full h-1 bg-[#1e1e24] rounded-lg appearance-none cursor-pointer accent-[#ff2e8c] focus:outline-none"
                                />
                                <div className="flex items-center justify-between text-4xs font-mono text-muted-foreground">
                                  <span>Cute</span>
                                  <span className="text-[#ff2e8c] font-black">{formInputValues.spookiness}% spookiness</span>
                                  <span>Terrifying</span>
                                </div>
                              </div>
                            )}

                          </div>
                        ))}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={sandboxSubmitting}
                        className="w-full py-2 px-4 rounded-xl text-3xs font-black text-white bg-gradient-to-r from-[#ff2e8c] to-[#9d4edd] hover:opacity-95 flex items-center justify-center gap-1.5 shadow-md shadow-[#ff2e8c]/15 transition-all"
                      >
                        {sandboxSubmitting ? (
                          <>
                            <div className="w-3 h-3 rounded-full border border-t-transparent border-white animate-spin" />
                            Sealing response...
                          </>
                        ) : (
                          <>
                            Submit Spooky Form
                            <ArrowRight className="w-3 h-3" />
                          </>
                        )}
                      </button>

                    </form>
                  )}

                </div>

                {/* Virtual Phone Home Bar */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-[#1e1e24] rounded-full z-20" />

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 5. PRICING TIERS SECTION ==================== */}
      <section id="pricing" className="py-24 bg-muted/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
            <h2 className="text-xs font-black tracking-widest uppercase text-[#ff2e8c]">
              Simple Transparent Pricing
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              A plan for every spooky project.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No hidden fees. Scale as your volume grows. Save 20% by toggling our annual plans.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center gap-2 p-1 bg-card border border-border rounded-xl">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                  billingPeriod === "monthly"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annual")}
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5",
                  billingPeriod === "annual"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Annual
                <span className="text-4xs px-1.5 py-0.5 rounded-full bg-[#ff2e8c] text-white font-extrabold uppercase">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* 3 Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            
            {/* Plan 1: Free */}
            <div className="bg-card border border-border/80 rounded-2xl p-8 flex flex-col justify-between shadow-lg relative">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Spooky Seed</h3>
                  <p className="text-xs text-muted-foreground mt-1">Perfect for casual creators starting out.</p>
                </div>
                
                <div className="flex items-baseline text-foreground">
                  <span className="text-4xl font-black tracking-tight">$0</span>
                  <span className="text-xs font-semibold text-muted-foreground ml-1">/ forever</span>
                </div>

                <div className="border-t border-border/80 pt-6 space-y-4">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span>3 Active Forms</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span>100 Responses / month</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span>Standard OKLCH Themes</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span>Community Discord Support</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="/login"
                  className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl text-xs font-bold text-foreground border border-border hover:bg-muted transition-colors text-center"
                >
                  Start for Free
                </a>
              </div>
            </div>

            {/* Plan 2: Pro (NECROMANCER) */}
            <div className="bg-card border-2 border-[#ff2e8c] rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative scale-100 lg:scale-[1.03] z-10">
              
              {/* Popular Badge */}
              <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 rounded-full bg-[#ff2e8c] text-white text-3xs font-black tracking-wider uppercase shadow-md shadow-[#ff2e8c]/20">
                Most Popular
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-foreground flex items-center gap-1.5">
                    Necromancer
                    <Zap className="w-4 h-4 text-[#ff2e8c] fill-[#ff2e8c]" />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Best for scaling startups and serious creators.</p>
                </div>
                
                <div className="flex items-baseline text-foreground">
                  <span className="text-4xl font-black tracking-tight">
                    {billingPeriod === "monthly" ? "$29" : "$23"}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground ml-1">/ month</span>
                </div>

                <div className="border-t border-border/80 pt-6 space-y-4">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span className="text-foreground font-semibold">Unlimited Active Forms</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span className="text-foreground font-semibold">10,000 Responses / month</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span>Custom OKLCH High-Glow Themes</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span>Advanced AI Necromancy Generator</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span>Webhook Integrations</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span>Priority Email Support</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="/login"
                  className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#ff2e8c] to-[#9d4edd] hover:opacity-95 shadow-lg shadow-[#ff2e8c]/15 text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Necromancer Pro
                </a>
              </div>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="bg-card border border-border/80 rounded-2xl p-8 flex flex-col justify-between shadow-lg relative">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Skull Overlord</h3>
                  <p className="text-xs text-muted-foreground mt-1">Enterprise-grade security and scale.</p>
                </div>
                
                <div className="flex items-baseline text-foreground">
                  <span className="text-4xl font-black tracking-tight">
                    {billingPeriod === "monthly" ? "$149" : "$119"}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground ml-1">/ month</span>
                </div>

                <div className="border-t border-border/80 pt-6 space-y-4">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span className="text-foreground font-semibold">Unlimited Active Forms</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span className="text-foreground font-semibold">Unlimited Responses</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span>White-label Custom Branding</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span>Dedicated SSL Custom Domains</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span>SLA Uptime Guarantees</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#ff2e8c] shrink-0" />
                      <span>Dedicated Overlord Slack/Zoom support</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="mailto:overlord@skullyforms.com?subject=Enterprise Query"
                  className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl text-xs font-bold text-foreground border border-border hover:bg-muted transition-colors text-center"
                >
                  Contact the Overlord
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 6. RESPONSIVE FOOTER ==================== */}
      <footer className="bg-background border-t border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-border">
            
            {/* Brand Column (4 columns) */}
            <div className="md:col-span-4 space-y-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative p-1.5 rounded-lg bg-gradient-to-tr from-[#ff2e8c]/10 to-[#9d4edd]/10 border border-[#ff2e8c]/20">
                  <Skull className="w-5 h-5 text-[#ff2e8c]" />
                </div>
                <span className="font-extrabold text-lg tracking-tight">
                  Skully<span className="text-[#ff2e8c]">Forms</span>
                </span>
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                Premium, whimsical, and highly interactive form-building experience with dynamic OKLCH theming and AI-assisted generation.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links Columns (8 columns total) */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
              
              {/* Col 1 */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">Product</p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li><a href="#features" className="hover:text-[#ff2e8c] transition-colors">Features</a></li>
                  <li><a href="#sandbox" className="hover:text-[#ff2e8c] transition-colors">Sandbox</a></li>
                  <li><a href="#pricing" className="hover:text-[#ff2e8c] transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-[#ff2e8c] transition-colors">Templates</a></li>
                </ul>
              </div>

              {/* Col 2 */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">Resources</p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li><a href="#" className="hover:text-[#ff2e8c] transition-colors">Docs</a></li>
                  <li><a href="#" className="hover:text-[#ff2e8c] transition-colors">Guides</a></li>
                  <li><a href="#" className="hover:text-[#ff2e8c] transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-[#ff2e8c] transition-colors">API Reference</a></li>
                </ul>
              </div>

              {/* Col 3 */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">Company</p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li><a href="#" className="hover:text-[#ff2e8c] transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-[#ff2e8c] transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-[#ff2e8c] transition-colors">Press</a></li>
                  <li><a href="#" className="hover:text-[#ff2e8c] transition-colors">Contact</a></li>
                </ul>
              </div>

              {/* Col 4 */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">Legal</p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li><a href="#" className="hover:text-[#ff2e8c] transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-[#ff2e8c] transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-[#ff2e8c] transition-colors">Cookie Policy</a></li>
                  <li><a href="#" className="hover:text-[#ff2e8c] transition-colors">Security</a></li>
                </ul>
              </div>

            </div>

          </div>

          {/* Bottom Copyright Block */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-muted-foreground">
            <p>© {new Date().getFullYear()} Skully Forms Inc. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-[#ff2e8c] fill-[#ff2e8c] animate-pulse" />
              <span>in the spooky catacombs.</span>
            </p>
          </div>

        </div>
      </footer>

      {/* ==================== 6. QUICK FORM CREATOR DIALOG OVERLAY ==================== */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay backdrop */}
          <div
            onClick={() => !createFormMutation.isPending && setCreateModalOpen(false)}
            className="absolute inset-0 bg-background/85 backdrop-blur-md transition-all duration-300 animate-fade-in"
          />

          {/* Dialog Container */}
          <div className="relative w-full max-w-md p-6.5 space-y-6 rounded-3xl border border-border bg-card/90 shadow-2xl z-10 animate-scale-in border-t-primary/30 dark:border-t-primary/45">
            {/* Header info */}
            <div className="space-y-1.5 text-left relative">
              {/* Close Button */}
              <button
                onClick={() => setCreateModalOpen(false)}
                disabled={createFormMutation.isPending}
                className="absolute right-0 top-0 p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 text-primary">
                <div className="p-1 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                  <Skull className="w-5 h-5 fill-current animate-pulse" />
                </div>
                <h3 className="text-base font-black text-foreground">Create Spooky Form Instantly</h3>
              </div>
              <p className="text-3xs text-muted-foreground leading-normal max-w-[90%]">
                Provision a live interactive form in the catacombs. We will bypass sign-in and open the visual skeleton builder automatically!
              </p>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleQuickCreateSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest flex items-center justify-between">
                  <span>Form Title</span>
                  <span className="text-[#ff2e8c] font-black font-mono">Required</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g., Gaming Tournament Registration"
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  disabled={createFormMutation.isPending}
                  className="w-full bg-background border-b border-border/80 focus:border-primary text-xs py-2 px-1 outline-none text-foreground transition-colors font-semibold"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest flex items-center justify-between">
                  <span>Description</span>
                  <span className="text-muted-foreground/60 font-semibold font-mono">Optional</span>
                </label>
                <textarea
                  placeholder="e.g., Sign up for our summer esports competition and get awesome rewards."
                  value={newFormDesc}
                  onChange={(e) => setNewFormDesc(e.target.value)}
                  disabled={createFormMutation.isPending}
                  rows={2}
                  className="w-full bg-background border border-border/60 focus:border-primary rounded-xl text-xs p-2.5 outline-none text-foreground transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Action Triggers */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  disabled={createFormMutation.isPending}
                  className="px-4.5 py-2.5 rounded-xl border border-border hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createFormMutation.isPending}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:opacity-95 shadow-md shadow-primary/10 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  {createFormMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Provisioning...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      Seal & Build Form
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

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Skull,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Loader2,
  Plus,
  X,
  Heart,
  Check,
  RotateCcw,
  FileText,
  TrendingUp,
  Star,
  Users,
  Palette,
  GitBranch,
  BarChart3,
  Zap,
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

interface HeroMascot {
  id: string;
  name: string;
  path: string;
  description: string;
}

const HERO_MASCOTS: HeroMascot[] = [
  { id: "boba", name: "Boba Skully 🧋", path: "/assets/illustrations/illustration-hero-skeleton.png", description: "Classic boba sipping skeleton" },
  { id: "gaming", name: "Gamer Skully 🎮", path: "/assets/skeletons/Skeleton%20Gaming.png", description: "Neon pink headset gamer" },
  { id: "dancing", name: "Dancing Skully 💃", path: "/assets/skeletons/Skeleton%20Dancing.png", description: "Pink stage dancing skeleton" },
  { id: "cookie", name: "Cookie Skully 🍪", path: "/assets/skeletons/Skeleton%20with%20jacket%20with%20cookie.png", description: "Cozy jacket skeleton" },
  { id: "skateboard", name: "Skater Skully 🛹", path: "/assets/skeletons/Skeleton%20with%20skateboard.png", description: "Red skateboard rider" },
  { id: "animated", name: "Animated Skully 🎬", path: "/assets/fun_skeleton/frame_001%202.png", description: "Fully animated flipbook skully" },
];

export const FLIPBOOK_FRAMES = [
  "frame_001 2.png", "frame_002 2.png", "frame_003 2.png", "frame_004 2.png", "frame_005 2.png",
  "frame_006 2.png", "frame_007 2.png", "frame_008 2.png", "frame_009 2.png", "frame_011 2.png",
  "frame_012 2.png", "frame_013 2.png", "frame_014 2.png", "frame_015 2.png", "frame_016 2.png",
  "frame_017 2.png", "frame_018 2.png", "frame_019 2.png", "frame_020 2.png", "frame_021 2.png",
  "frame_022 2.png", "frame_023 2.png", "frame_024 2.png", "frame_025 2.png", "frame_026 2.png",
  "frame_027 2.png", "frame_028 2.png", "frame_029 2.png", "frame_030 2.png", "frame_031 2.png",
  "frame_032 2.png", "frame_033 2.png", "frame_034 2.png", "frame_035 2.png", "frame_036 2.png",
  "frame_037 2.png", "frame_038 2.png", "frame_039 2.png", "frame_040 2.png", "frame_041 2.png",
  "frame_042 2.png", "frame_043 2.png", "frame_044 2.png", "frame_045 2.png", "frame_046 2.png",
  "frame_047 2.png", "frame_048 2.png", "frame_049 2.png", "frame_050 2.png"
];

interface ShowcasePersona {
  id: string;
  name: string;
  emoji: string;
  bgAsset: string;
  illustrationAsset: string;
  themeName: string;
  title: string;
  description: string;
  badgeText: string;
  badgeBg: string;
  bgHexClass: string;
  borderClass: string;
  textColor: string;
  textMutedColor: string;
  accentColor: string;
  btnBg: string;
  btnHoverBg: string;
  btnText: string;
}

const SHOWCASE_PERSONAS: ShowcasePersona[] = [
  {
    id: "boba",
    name: "Boba Skully",
    emoji: "🧋",
    bgAsset: ASSETS.backgrounds.pinkStage,
    illustrationAsset: ASSETS.illustrations.heroSkeleton,
    themeName: "Cozy Cream",
    title: "Taro Boba Tea Tasting",
    description: "Sip taro bubble tea. Rate your spookiness.",
    badgeText: "Cream Pastel Theme",
    badgeBg: "bg-[#ff2e8c]/10 text-[#ff2e8c] border-[#ff2e8c]/20",
    bgHexClass: "bg-[#faf6f0]/95 text-[#2d2623]",
    borderClass: "border-[#e3dcd2] focus:border-[#ff2e8c]",
    textColor: "text-[#2d2623]",
    textMutedColor: "text-[#7d7065]",
    accentColor: "accent-[#ff2e8c]",
    btnBg: "bg-[#ff2e8c]",
    btnHoverBg: "hover:bg-[#e02075]",
    btnText: "text-white font-bold"
  },
  {
    id: "gaming",
    name: "Gamer Skully",
    emoji: "🎮",
    bgAsset: ASSETS.backgrounds.dark,
    illustrationAsset: ASSETS.skeletons.gaming,
    themeName: "Cyberpunk Glow",
    title: "Vibe Check Protocol",
    description: "Initializing cyberpunk neural link assessment...",
    badgeText: "Cyberpunk Neon Theme",
    badgeBg: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    bgHexClass: "bg-[#09090b]/95 text-[#f4f4f5]",
    borderClass: "border-pink-500/30 focus:border-cyan-400",
    textColor: "text-white font-mono",
    textMutedColor: "text-white/45",
    accentColor: "accent-pink-500",
    btnBg: "bg-pink-600",
    btnHoverBg: "hover:bg-pink-500",
    btnText: "text-white font-bold font-mono"
  },
  {
    id: "plants",
    name: "Botanical Skully",
    emoji: "🌿",
    bgAsset: ASSETS.backgrounds.leaf,
    illustrationAsset: ASSETS.skeletons.greenPlants,
    themeName: "Forest Mint",
    title: "Seedling Growth Log",
    description: "Water the plants. Record organic soil metrics.",
    badgeText: "Botanical Forest Theme",
    badgeBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    bgHexClass: "bg-[#0b1712]/95 text-[#f1f5f3]",
    borderClass: "border-emerald-800/30 focus:border-emerald-400",
    textColor: "text-emerald-50 font-serif",
    textMutedColor: "text-[#a3b899]/60",
    accentColor: "accent-emerald-500",
    btnBg: "bg-emerald-600",
    btnHoverBg: "hover:bg-emerald-500",
    btnText: "text-white font-semibold"
  },
  {
    id: "skateboard",
    name: "Skater Skully",
    emoji: "🛹",
    bgAsset: ASSETS.backgrounds.goldenLeaf,
    illustrationAsset: ASSETS.skeletons.skateboard,
    themeName: "Sunset Rider",
    title: "Golden Hour Session",
    description: "Skate hard. Rest spooky. Fill the skater log.",
    badgeText: "Sunset Amber Theme",
    badgeBg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    bgHexClass: "bg-[#1c0d12]/95 text-[#fff5f6]",
    borderClass: "border-orange-500/25 focus:border-orange-400",
    textColor: "text-[#fff5f6]",
    textMutedColor: "text-[#fcd34d]/50",
    accentColor: "accent-orange-500",
    btnBg: "bg-orange-600",
    btnHoverBg: "hover:bg-orange-500",
    btnText: "text-white font-bold"
  },
  {
    id: "laptop",
    name: "Developer Skully",
    emoji: "💻",
    bgAsset: ASSETS.backgrounds.dark2,
    illustrationAsset: ASSETS.skeletons.laptop,
    themeName: "Dev Charcoal",
    title: "Monorepo Status Survey",
    description: "Verify compilation and active React hooks.",
    badgeText: "Dev Slate Theme",
    badgeBg: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    bgHexClass: "bg-[#121316]/95 text-[#e4e4e7]",
    borderClass: "border-zinc-800/80 focus:border-indigo-500",
    textColor: "text-white font-mono",
    textMutedColor: "text-zinc-500",
    accentColor: "accent-indigo-500",
    btnBg: "bg-indigo-600",
    btnHoverBg: "hover:bg-indigo-500",
    btnText: "text-white font-bold"
  }
];

export default function LandingPageView() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hero Carousel State
  const [heroMascotKey, setHeroMascotKey] = useState<string>("boba");
  const [displayedMascotKey, setDisplayedMascotKey] = useState<string>("boba");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Mascot Showcase State
  const [showcaseMascotKey, setShowcaseMascotKey] = useState<string>("boba");

  // Flipbook animation state
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFrameIndex((prevIndex) => (prevIndex + 1) % FLIPBOOK_FRAMES.length);
    }, 45);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (heroMascotKey !== displayedMascotKey) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayedMascotKey(heroMascotKey);
        setIsTransitioning(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [heroMascotKey, displayedMascotKey]);

  // Auto-rotation timer ref & function
  const autoRotateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoRotation = () => {
    if (autoRotateIntervalRef.current) clearInterval(autoRotateIntervalRef.current);
    autoRotateIntervalRef.current = setInterval(() => {
      setHeroMascotKey((currentKey) => {
        const currentIndex = HERO_MASCOTS.findIndex(m => m.id === currentKey);
        const nextIndex = (currentIndex + 1) % HERO_MASCOTS.length;
        const nextMascot = HERO_MASCOTS[nextIndex] as HeroMascot;
        return nextMascot.id;
      });
    }, 4000);
  };

  useEffect(() => {
    startAutoRotation();
    return () => {
      if (autoRotateIntervalRef.current) clearInterval(autoRotateIntervalRef.current);
    };
  }, []);

  const getDropShadowClass = (id: string) => {
    switch (id) {
      case "gaming":
        return "drop-shadow-[0_24px_70px_rgba(255,46,140,0.38)]";
      case "dancing":
        return "drop-shadow-[0_24px_70px_rgba(255,46,140,0.35)]";
      case "cookie":
        return "drop-shadow-[0_24px_70px_rgba(237,145,148,0.28)]";
      default:
        return "drop-shadow-[0_24px_70px_rgba(237,145,148,0.25)]";
    }
  };

  // Quick Create Modal States
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

  // Interactive Sandbox States
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
      const newField = fieldMap[fieldType];
      if (newField) {
        setActiveFields([...activeFields, newField]);
      }
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

  // Pricing State
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  useEffect(() => { setMounted(true); }, []);

  const selectedPersona = SHOWCASE_PERSONAS.find(p => p.id === showcaseMascotKey) || SHOWCASE_PERSONAS[0]!;

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
              { label: "Explore", href: "/explore", dropdown: false },
              { label: "Pricing", href: "/pricing", dropdown: false },
              { label: "API Docs", href: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/docs`, dropdown: false },
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
      <section className="relative overflow-hidden bg-section-peach py-14 md:py-20 transition-colors duration-300">
        
        {/* Soft oklch ambient glow blobs for a clean standard look */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-l from-background/50 via-section-peach/30 to-transparent" />
          <div className="absolute top-[8%] right-[-8%] w-[580px] h-[580px] rounded-full bg-primary/10 blur-[120px] animate-pulse duration-10000" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[420px] h-[420px] rounded-full bg-accent-purple/5 blur-[90px] animate-pulse duration-8000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Column: Witty text & micro-animated CTAs */}
            <div className="lg:col-span-6 flex flex-col items-start gap-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-wider shadow-sm shadow-primary/5 hover:scale-102 transition-transform duration-200 select-none">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Conversational, Spooky Form Builder
              </div>

              <h1 className="font-heading text-5xl sm:text-6xl md:text-[62px] font-black tracking-tight leading-[1.05] text-foreground max-w-2xl">
                Forms that don&apos;t feel like{" "}
                <span className="text-primary relative inline-block font-heading font-black">
                  boring
                  <span className="absolute bottom-1.5 left-0 w-full h-[6px] bg-primary/20 -z-10 rounded-full" />
                </span>{" "}
                paperwork.
              </h1>

              <p className="text-base md:text-lg text-muted-foreground/90 font-semibold font-sans max-w-xl leading-relaxed">
                Create beautiful, one-question-at-a-time forms. Engage your respondents with cute skeletons, bespoke themes, and lightning-fast completion rates.
              </p>

              <div className="flex flex-wrap gap-4 pt-1">
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-black text-primary-foreground bg-primary hover:opacity-95 rounded-xl shadow-lg shadow-primary/25 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer"
                >
                  Get started free
                  <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                </button>
                <Link href="/explore"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-black text-foreground border border-border bg-background/80 hover:bg-background rounded-xl shadow-2xs hover:scale-[1.01] active:scale-[0.99] transition-all duration-200">
                  Explore Forms
                </Link>
              </div>

              <div className="pt-4 w-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2.5 select-none">
                  Loved by design-forward developers and creators
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 opacity-35 hover:opacity-55 transition-opacity duration-300 select-none">
                  {["loom", "Notion", "webflow", "_zapier", "HubSpot", "mailchimp"].map(b => (
                    <span key={b} className="text-2xs font-black font-mono tracking-tighter text-foreground uppercase">{b}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Transparent Mascot sitting cleanly on page background */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] aspect-[1/1] select-none flex items-center justify-center">

                {/* Static mascot container with custom smooth fade/scale transition (no floating) */}
                <div className={cn(
                  "relative w-[460px] h-[460px] max-w-full aspect-[1/1] transition-all duration-300 transform",
                  isTransitioning ? "opacity-0 scale-[0.98] blur-[2px]" : "opacity-100 scale-100 blur-none"
                )}>
                  {mounted && displayedMascotKey === "animated" ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={`/assets/fun_skeleton/${FLIPBOOK_FRAMES[currentFrameIndex]}`}
                        alt="Animated Skully Mascot"
                        fill
                        className="object-contain transition-all duration-300 drop-shadow-[0_24px_70px_rgba(255,46,140,0.35)]"
                        priority
                      />
                    </div>
                  ) : (
                    mounted && (
                      <Image
                        src={HERO_MASCOTS.find(m => m.id === displayedMascotKey)?.path || ASSETS.illustrations.heroSkeleton}
                        alt="Skully hero illustration"
                        fill
                        className={cn("object-contain transition-all duration-300", getDropShadowClass(displayedMascotKey))}
                        priority
                      />
                    )
                  )}
                  {!mounted && (
                    <div className="w-[400px] h-[400px] rounded-full bg-primary/5 animate-pulse border border-primary/10" />
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── NEW: MASCOT & THEME STORYTELLING PREVIEWER ───────────────── */}
      <section className="py-14 md:py-20 border-y border-border/40 bg-background/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-[20%] left-[-10%] w-[380px] h-[380px] rounded-full bg-accent-purple/5 blur-[100px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[420px] h-[420px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-extrabold uppercase tracking-widest text-[#ff2e8c]">
              Bespoke Identity & Styles
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              A mascot & theme for every story.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Different form templates render custom skeletons and matched backgrounds, changing the atmosphere completely.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
            
            {/* Left Column: Mascot Selector Tabs */}
            <div className="lg:col-span-5 flex flex-col justify-center gap-3">
              {SHOWCASE_PERSONAS.map((p) => {
                const isActive = showcaseMascotKey === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setShowcaseMascotKey(p.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 cursor-pointer hover:translate-x-1 group",
                      isActive
                        ? "bg-card border-border shadow-md shadow-primary/5"
                        : "bg-background/40 hover:bg-background/80 border-transparent hover:border-border/40"
                    )}
                  >
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 transition-transform duration-200 group-hover:scale-105",
                      isActive ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted/80 text-muted-foreground border border-border/40"
                    )}>
                      {p.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn("text-sm font-bold truncate", isActive ? "text-foreground" : "text-muted-foreground")}>
                          {p.name}
                        </p>
                        {isActive && (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wide border border-primary/15 shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-2xs text-muted-foreground/80 truncate mt-0.5">{p.themeName} theme loaded</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Live Form Card Preview using matching Background and Mascot asset */}
            <div className="lg:col-span-7 flex items-center justify-center">
              <div className="relative w-full h-[370px] rounded-3xl overflow-hidden border border-border/80 shadow-2xl flex items-center justify-center p-6 bg-card transition-all duration-300">
                
                {/* Dynamically update matching background asset */}
                <Image
                  src={selectedPersona.bgAsset}
                  alt={`${selectedPersona.name} background`}
                  fill
                  className="object-cover absolute inset-0 pointer-events-none select-none transition-all duration-300"
                />
                
                {/* Soft backdrop blur to make form text legible */}
                <div className="absolute inset-0 bg-background/5 backdrop-blur-xs z-0 pointer-events-none" />

                {/* Form Card content styled dynamically based on theme class */}
                <div className={cn(
                  "relative z-10 w-full max-w-md rounded-2xl border p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl transition-all duration-300 transform scale-100",
                  selectedPersona.bgHexClass,
                  selectedPersona.borderClass
                )}>
                  {/* Persona Mascot Illustration inside the Form Card */}
                  <div className="relative w-[130px] h-[130px] aspect-[1/1] select-none shrink-0">
                    <Image
                      src={selectedPersona.illustrationAsset}
                      alt={selectedPersona.name}
                      fill
                      className="object-contain drop-shadow-md"
                    />
                  </div>

                  {/* Persona Form Question details */}
                  <div className="flex-1 space-y-3.5 text-left w-full min-w-0">
                    <div className="space-y-1">
                      <div className={cn("inline-block text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border mb-1", selectedPersona.badgeBg)}>
                        {selectedPersona.badgeText}
                      </div>
                      <h3 className={cn("text-base font-extrabold leading-tight truncate", selectedPersona.textColor)}>
                        {selectedPersona.title}
                      </h3>
                      <p className={cn("text-[11px] leading-relaxed", selectedPersona.textMutedColor)}>
                        {selectedPersona.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className={cn("block text-[8px] font-black uppercase tracking-widest", selectedPersona.textMutedColor)}>
                          Your spooky feedback
                        </label>
                        <input
                          type="text"
                          readOnly
                          placeholder="e.g. Absolutely magical experience!"
                          className={cn(
                            "w-full bg-transparent border-b text-[11px] py-1 px-0.5 outline-none font-medium placeholder:opacity-30",
                            selectedPersona.borderClass
                          )}
                        />
                      </div>

                      <button
                        type="button"
                        className={cn(
                          "w-full py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-all",
                          selectedPersona.btnBg,
                          selectedPersona.btnHoverBg,
                          selectedPersona.btnText
                        )}
                      >
                        Submit Answer <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 relative overflow-hidden bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[100px] bg-primary/5 blur-[90px] pointer-events-none select-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: "12,400+", label: "Forms Created",        icon: FileText,   color: "text-primary",        bg: "bg-primary/10" },
              { value: "1.2M+",   label: "Responses Collected",  icon: TrendingUp, color: "text-accent-purple", bg: "bg-accent-purple/10" },
              { value: "94.7%",   label: "Avg Completion Rate",  icon: Star,       color: "text-amber-500",      bg: "bg-amber-500/10" },
              { value: "50+",     label: "Field Types Available",icon: Users,      color: "text-accent-cyan",    bg: "bg-accent-cyan/10" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-card/45 backdrop-blur-xs border border-border/60 hover:border-border rounded-2xl p-5 flex flex-col items-center text-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 group"
              >
                <div className={`p-2.5 rounded-xl ${s.bg} text-foreground transition-transform duration-300 group-hover:scale-110`}>
                  <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                </div>
                <div className="space-y-0.5">
                  <p className="font-heading text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                    {s.value}
                  </p>
                  <p className="text-[9px] font-extrabold text-muted-foreground/80 tracking-widest uppercase">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────────────────── */}
      <section id="features" className="py-14 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <p className="text-xs font-extrabold tracking-widest uppercase text-primary">Built for Creators</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Say goodbye to dull, boring forms.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
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
                shadow: "group-hover:border-primary/30 group-hover:shadow-[0_8px_30px_rgba(255,46,140,0.08)]",
                desc: "Describe what you need — our AI generates logic trees, field types, and layouts automatically.",
              },
              {
                icon: Palette,
                label: "Dynamic Themes",
                color: "text-accent-purple",
                bg: "bg-accent-purple/10",
                shadow: "group-hover:border-accent-purple/30 group-hover:shadow-[0_8px_30px_rgba(168,85,247,0.08)]",
                desc: "Beautiful palettes, custom shapes, and smooth blur effects. Fully responsive light and dark themes.",
              },
              {
                icon: GitBranch,
                label: "Logic Branching",
                color: "text-accent-cyan",
                bg: "bg-accent-cyan/10",
                shadow: "group-hover:border-accent-cyan/30 group-hover:shadow-[0_8px_30px_rgba(6,182,212,0.08)]",
                desc: "Design multi-path conditional flows with an intuitive visual builder. Branch on any answer.",
              },
              {
                icon: BarChart3,
                label: "Deep Analytics",
                color: "text-success",
                bg: "bg-success-bg",
                shadow: "group-hover:border-success/30 group-hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)]",
                desc: "Visual drop-off charts, real-time responses, and completion rates. Privacy-first by default.",
              },
            ].map((f) => (
              <div
                key={f.label}
                className={`bg-card border border-border/60 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:scale-[1.015] hover:-translate-y-1 group ${f.shadow}`}
              >
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-heading text-sm font-bold text-foreground mb-1.5">{f.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SANDBOX ──────────────────────────────────────────────────── */}
      <section id="sandbox" className="py-14 md:py-20 bg-section-peach relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10 space-y-3">
            <p className="text-xs font-extrabold tracking-widest uppercase text-primary">Interactive Preview</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Build and interact in real time.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Toggle fields on the left and watch them instantly populate the live mobile preview.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-4xl mx-auto">

            {/* Left: Field Palette */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Field Palette</span>
                  <span className="text-[10px] font-mono text-muted-foreground bg-background/80 px-2 py-0.5 rounded-lg border border-border/50">
                    Toggle fields
                  </span>
                </div>

                <div className="space-y-2">
                  {availableFieldsList.map((field) => {
                    const isAdded = activeFields.some(f => f.type === field.type);
                    return (
                      <button
                        key={field.id}
                        onClick={() => handleToggleField(field.type)}
                        className={cn(
                          "w-full text-left px-3.5 py-3 rounded-xl border transition-all duration-200 flex items-center justify-between group cursor-pointer",
                          isAdded
                            ? "bg-primary/8 border-primary/30 shadow-sm"
                            : "bg-background/70 hover:bg-background border-border/60 hover:border-border"
                        )}
                      >
                        <div>
                          <p className={cn("text-xs font-semibold", isAdded ? "text-primary" : "text-foreground")}>
                            {field.label}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{field.description}</p>
                        </div>
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ml-3",
                          isAdded
                            ? "bg-primary border-primary"
                            : "border-border/60 group-hover:border-muted-foreground/40"
                        )}>
                          {isAdded && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-background/60 border border-border/50 rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shrink-0" />
                <p className="text-[10px] text-muted-foreground font-medium">Live sync active — changes reflect instantly.</p>
              </div>
            </div>

            {/* Right: Phone Mockup */}
            <div className="lg:col-span-7 flex justify-center items-center">
              <div className="relative w-full max-w-[270px] aspect-[9/18.5] bg-[#0c0c0e] rounded-[38px] p-2.5 shadow-2xl border-4 border-[#1e1e24] flex flex-col overflow-hidden animate-pulseGlow">

                {/* Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-b-xl z-20" />

                {/* Screen */}
                <div className="flex-1 bg-[#131317] rounded-[28px] overflow-hidden flex flex-col relative p-4 pt-8 border border-white/5">
                  {/* Status bar */}
                  <div className="absolute top-2 left-4 right-4 flex items-center justify-between text-[8px] font-mono text-white/30 select-none">
                    <span>9:41</span>
                    <span>5G ▓▓▓</span>
                  </div>

                  {sandboxSuccess ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 animate-fade-in">
                      <div className="w-12 h-12 rounded-full bg-success/15 border border-success/30 flex items-center justify-center">
                        <Check className="w-6 h-6 text-success stroke-[2.5]" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white">Response Submitted!</h4>
                        <p className="text-[10px] text-white/45 max-w-[150px] mx-auto leading-relaxed">
                          Your response has been recorded.
                        </p>
                      </div>
                      <button
                        onClick={handleResetSandbox}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/15 border border-primary/25 px-2.5 py-1 rounded-lg hover:bg-primary/25 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        Reset
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSandboxSubmit} className="flex-1 flex flex-col justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Skull className="w-3 h-3 text-primary" />
                          <span className="text-[8px] font-extrabold tracking-widest text-primary uppercase">Skully Forms</span>
                        </div>
                        <h3 className="text-[11px] font-bold text-white leading-tight">The Spooky Evaluation</h3>
                        <p className="text-[8px] text-white/40">Complete all fields to continue.</p>
                      </div>

                      <div className="flex-1 my-3 overflow-y-auto space-y-3 scrollbar-none">
                        {activeFields.map((field) => (
                          <div key={field.id} className="space-y-0.5 text-left">
                            <label className="flex items-center justify-between text-[8px] font-bold text-white/50 uppercase tracking-wider">
                              <span>{field.label}</span>
                              <span className="text-primary text-[7px] normal-case tracking-normal font-semibold">Required</span>
                            </label>

                            {field.type === "text" && (
                              <input
                                type="text"
                                required
                                value={formInputValues.name}
                                onChange={(e) => setFormInputValues({ ...formInputValues, name: e.target.value })}
                                placeholder={field.placeholder}
                                className="w-full bg-white/5 border-b border-white/15 focus:border-primary text-[10px] py-1 px-0.5 outline-none text-white transition-colors placeholder:text-white/20"
                              />
                            )}

                            {field.type === "boba" && (
                              <div className="flex items-center gap-1 pt-0.5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <button
                                    type="button"
                                    key={i}
                                    onClick={() => setFormInputValues({ ...formInputValues, bobaRating: i })}
                                    className="text-sm transition-transform hover:scale-125 cursor-pointer"
                                  >
                                    <span className={cn("filter transition-all", i <= formInputValues.bobaRating ? "opacity-100" : "opacity-25 grayscale")}>
                                      🧋
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}

                            {field.type === "checkbox" && (
                              <div className="flex items-start gap-1.5 pt-0.5">
                                <input
                                  type="checkbox"
                                  id="mock-consent"
                                  checked={formInputValues.skullConsent}
                                  onChange={(e) => setFormInputValues({ ...formInputValues, skullConsent: e.target.checked })}
                                  className="w-2.5 h-2.5 mt-0.5 accent-primary cursor-pointer"
                                />
                                <label htmlFor="mock-consent" className="text-[8px] text-white/40 leading-tight cursor-pointer">
                                  I agree to the terms.
                                </label>
                              </div>
                            )}

                            {field.type === "slider" && (
                              <div className="space-y-0.5 pt-0.5">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={formInputValues.spookiness}
                                  onChange={(e) => setFormInputValues({ ...formInputValues, spookiness: parseInt(e.target.value) })}
                                  className="w-full h-0.5 bg-white/10 rounded appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-[7px] font-mono text-white/30">
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
                        className="w-full py-1.5 px-3 rounded-lg text-[10px] font-bold text-white bg-primary hover:opacity-90 flex items-center justify-center gap-1 transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {sandboxSubmitting ? (
                          <>
                            <div className="w-2.5 h-2.5 rounded-full border border-t-transparent border-white animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>Submit <ArrowRight className="w-2.5 h-2.5" /></>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* Home bar */}
                <div className="absolute bottom-1 w-20 h-0.5 bg-white/10 rounded-full left-1/2 -translate-x-1/2 z-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────── */}
      <section id="pricing" className="py-14 md:py-20 bg-section-lavender relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <p className="text-xs font-extrabold tracking-widest uppercase text-primary">Simple Pricing</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              A plan for every project.
            </h2>
            <p className="text-sm text-muted-foreground">No hidden fees. Scale as your volume grows. Cancel anytime.</p>

            {/* Billing toggle */}
            <div className="inline-flex items-center p-0.5 bg-background/80 border border-border/60 rounded-xl backdrop-blur-sm">
              {(["monthly", "annual"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setBillingPeriod(p)}
                  className={cn(
                    "px-3.5 py-1.5 text-[10px] font-bold rounded-lg transition-all capitalize flex items-center gap-1 cursor-pointer",
                    billingPeriod === p
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p}
                  {p === "annual" && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-success text-success-foreground font-extrabold uppercase">
                      −20%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto items-stretch">

            {/* Free */}
            <div className="bg-background/85 border border-border/60 rounded-2xl p-6 shadow-sm flex flex-col backdrop-blur-sm">
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">Spooky Seed</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">For creators just starting out.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-3xl font-extrabold text-foreground">$0</span>
                  <span className="text-[10px] text-muted-foreground">/ forever</span>
                </div>
                <ul className="space-y-2 pt-2 border-t border-border/40">
                  {["3 Active Forms", "100 Responses / month", "Standard Themes", "Community Support"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="/login"
                className="mt-6 w-full inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-bold text-foreground border border-border/70 hover:bg-muted/60 transition-colors">
                Start for Free
              </a>
            </div>

            {/* Pro — highlighted */}
            <div className="bg-background border-2 border-primary rounded-2xl p-6 shadow-xl flex flex-col relative md:scale-[1.02] z-10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-wide shadow-md shadow-primary/20">
                Most Popular
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-heading text-base font-extrabold text-foreground flex items-center gap-1">
                    Necromancer <Zap className="w-3.5 h-3.5 text-primary fill-primary" />
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">For scaling startups and serious creators.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-3xl font-extrabold text-foreground">
                    {billingPeriod === "monthly" ? "$29" : "$23"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">/ month</span>
                </div>
                <ul className="space-y-2 pt-2 border-t border-border/40">
                  {[
                    ["Unlimited Active Forms", true],
                    ["10,000 Responses / month", true],
                    ["Custom High-Glow Themes", false],
                    ["Advanced AI Generator", false],
                    ["Webhook Integrations", false],
                    ["Priority Email Support", false],
                  ].map(([f, bold]) => (
                    <li key={f as string} className="flex items-center gap-2 text-xs">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className={cn(bold ? "text-foreground font-semibold" : "text-muted-foreground")}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a href="/login"
                className="mt-6 w-full inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:opacity-95 shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Get Necromancer
              </a>
            </div>

            {/* Enterprise */}
            <div className="bg-background/85 border border-border/60 rounded-2xl p-6 shadow-sm flex flex-col backdrop-blur-sm">
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">Skull Overlord</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Enterprise-grade security and scale.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-3xl font-extrabold text-foreground">
                    {billingPeriod === "monthly" ? "$149" : "$119"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">/ month</span>
                </div>
                <ul className="space-y-2 pt-2 border-t border-border/40">
                  {[
                    ["Unlimited Active Forms", true],
                    ["Unlimited Responses", true],
                    ["White-label Branding", false],
                    ["Custom Domains + SSL", false],
                    ["SLA Uptime Guarantee", false],
                    ["Dedicated Slack / Zoom", false],
                  ].map(([f, bold]) => (
                    <li key={f as string} className="flex items-center gap-2 text-xs">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span className={cn(bold ? "text-foreground font-semibold" : "text-muted-foreground")}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a href="mailto:overlord@skullyforms.com?subject=Enterprise Query"
                className="mt-6 w-full inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-bold text-foreground border border-border/70 hover:bg-muted/60 transition-colors">
                Contact Sales
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 bg-background/85 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-border/50">

            {/* Brand */}
            <div className="md:col-span-4 space-y-3">
              <Link href="/" className="flex items-center gap-2.5 group w-fit">
                <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 transition-colors group-hover:bg-primary/20">
                  <Skull className="w-4.5 h-4.5 text-primary fill-current animate-float" />
                </div>
                <span className="font-heading font-extrabold text-base tracking-tight text-foreground">
                  Skully<span className="text-primary">Forms</span>
                </span>
              </Link>
              <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs">
                Premium, whimsical form-building with AI assistance, dynamic themes, and deep analytics.
              </p>
              <div className="flex items-center gap-2.5 select-none">
                {/* Minimal socials */}
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-[10px] font-bold">Twitter</a>
                <span className="text-muted-foreground/30">•</span>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-[10px] font-bold">Github</a>
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { title: "Product", links: [
                  { label: "Explore Forms", href: "/explore" },
                  { label: "Pricing", href: "/pricing" },
                  { label: "Templates", href: "/explore" },
                ]},
                { title: "Resources", links: [
                  { label: "API Reference", href: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/docs` },
                  { label: "Guides", href: "#" },
                ]},
                { title: "Company", links: [
                  { label: "About Us", href: "#" },
                  { label: "Contact Us", href: "#" },
                ]},
                { title: "Legal", links: [
                  { label: "Terms", href: "#" },
                  { label: "Privacy", href: "#" },
                ]},
              ].map((col) => (
                <div key={col.title} className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-foreground/80">{col.title}</p>
                  <ul className="space-y-1.5">
                    {col.links.map(l => (
                      <li key={l.label}>
                        <a href={l.href} className="text-[10px] text-muted-foreground hover:text-primary transition-colors">{l.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-muted-foreground/60 select-none">
            <p>© {new Date().getFullYear()} Skully Forms Inc. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-primary fill-primary animate-pulse" /> in the spooky catacombs.
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

          <div className="relative w-full max-w-md p-6 space-y-4 rounded-3xl border border-border bg-card shadow-2xl z-10 animate-scale-in">
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
                  className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createFormMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:opacity-95 shadow-md shadow-primary/10 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
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

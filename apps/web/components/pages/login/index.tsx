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
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { ASSETS } from "~/lib/assets";
import { toast } from "sonner";
// ASSETS.skeletons used for illustration panel
import { trpc } from "~/trpc/client";
import { useAuth } from "~/providers/auth";

type AuthView = "login" | "signup" | "forgot" | "check-email";

export default function LoginPageView() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  // Auth local states
  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Simulated forgot loader
  const [forgotLoading, setForgotLoading] = useState(false);

  // tRPC Mutations
  const loginMutation = trpc.auth.signIn.useMutation({
    onSuccess: () => {
      toast.success("Welcome back to Skully Forms!");
      router.push("/dashboard");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to sign in. Please check your credentials.");
    },
  });

  const signUpMutation = trpc.auth.signUp.useMutation({
    onSuccess: () => {
      toast.success("Spooky account created! Directing to dashboard...");
      router.push("/dashboard");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create account. Please check your inputs.");
    },
  });

  const loading = loginMutation.isPending || signUpMutation.isPending || forgotLoading;
  
  const getLoadingStatus = () => {
    if (loginMutation.isPending) return "Verifying credentials ledger...";
    if (signUpMutation.isPending) return "Sealing credentials in vault...";
    return "Generating reset ticket...";
  };

  const loadingStatus = getLoadingStatus();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }
    loginMutation.mutate({
      email: email.trim(),
      password: password,
    });
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      toast.error("Please fill out all fields.");
      return;
    }
    signUpMutation.mutate({
      email: email.trim(),
      password: password,
      fullName: fullName.trim(),
    });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setCurrentView("check-email");
    }, 900);
  };

  const handleSocialClick = (provider: string) => {
    toast.info(`${provider} sign-in is currently under maintenance. Please use Credentials login!`);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden select-none">
      
      {/* Visual Organic Wavy Mesh Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[10%] left-[-10%] w-[480px] h-[480px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[580px] h-[580px] rounded-full bg-accent-purple/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-6">
        
        {/* ==================== A. AUTH HEADER ==================== */}
        <header className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary transition-all duration-200 shadow-sm">
              <Skull className="w-5 h-5 fill-current" />
            </div>
            <span className="font-heading font-extrabold text-base tracking-tight text-foreground">
              Skully<span className="text-primary">Forms</span>
            </span>
          </Link>

          {/* Theme switcher toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl border border-border/70 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 shadow-sm cursor-pointer"
            aria-label="Toggle Theme"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-primary" />
              )
            ) : (
              <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
            )}
          </button>
        </header>

        {/* ==================== B. AUTH GRID CONTAINER ==================== */}
        <main className="my-auto py-12 flex items-center justify-center">
          <div className="w-full max-w-5xl rounded-[32px] border border-border/80 bg-card/65 backdrop-blur-md shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            
            {/* 1. LEFT COLUMN: Auth Form Panel (5 columns) */}
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/60 text-left">
              
              {loading ? (
                /* LOADING AUTO-BYPASS STATE */
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-pulse select-none">
                  <div className="p-4 rounded-full bg-primary/10 border border-primary/25 text-primary animate-spin">
                    <Loader2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground">Establishing Secure Link</h3>
                    <p className="text-2xs text-muted-foreground font-mono uppercase tracking-wider">{loadingStatus}</p>
                  </div>
                </div>
              ) : (
                /* INTERACTIVE VIEWS */
                <div className="space-y-6 flex-1 flex flex-col justify-center">
                  
                  {/* VIEW A: LOGIN CARD */}
                  {currentView === "login" && (
                    <form onSubmit={handleLoginSubmit} className="space-y-6 animate-fade-in">
                      <div className="space-y-1.5">
                        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">Welcome back</h2>
                        <p className="text-2xs text-muted-foreground">Log in to your Skully Forms account.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                            <Mail className="w-3 h-3" /> Email Address
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="you@skullyforms.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background border-b border-border/85 focus:border-primary text-xs py-2 px-1 outline-none text-foreground transition-colors font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                              <Lock className="w-3 h-3" /> Password
                            </label>
                            <button
                              type="button"
                              onClick={() => setCurrentView("forgot")}
                              className="text-4xs font-black uppercase text-primary hover:opacity-90 tracking-widest cursor-pointer"
                            >
                              Forgot Password?
                            </button>
                          </div>
                          <input
                            type="password"
                            required
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-background border-b border-border/85 focus:border-primary text-xs py-2 px-1 outline-none text-foreground transition-colors font-semibold"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-3xs font-semibold text-muted-foreground select-none">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-border text-primary accent-primary focus:ring-0 cursor-pointer"
                          />
                          Remember me
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-primary hover:opacity-95 shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        Log In
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>

                      <div className="pt-2 text-center text-3xs font-semibold text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setCurrentView("signup")}
                          className="font-black text-primary hover:underline cursor-pointer"
                        >
                          Sign up
                        </button>
                      </div>
                    </form>
                  )}

                  {/* VIEW B: SIGN UP CARD */}
                  {currentView === "signup" && (
                    <form onSubmit={handleSignUpSubmit} className="space-y-6 animate-fade-in">
                      <div className="space-y-1.5">
                        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">Create account</h2>
                        <p className="text-2xs text-muted-foreground">Register your new dev registry context.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Jack O. Lantern"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-background border-b border-border/85 focus:border-primary text-xs py-2 px-1 outline-none text-foreground transition-colors font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                            <Mail className="w-3 h-3" /> Email Address
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="you@skullyforms.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background border-b border-border/85 focus:border-primary text-xs py-2 px-1 outline-none text-foreground transition-colors font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                            <Lock className="w-3 h-3" /> Password
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-background border-b border-border/85 focus:border-primary text-xs py-2 px-1 outline-none text-foreground transition-colors font-semibold"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-primary hover:opacity-95 shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        Create Account
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>

                      <div className="pt-2 text-center text-3xs font-semibold text-muted-foreground">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setCurrentView("login")}
                          className="font-black text-primary hover:underline cursor-pointer"
                        >
                          Log in
                        </button>
                      </div>
                    </form>
                  )}

                  {/* VIEW C: FORGOT PASSWORD */}
                  {currentView === "forgot" && (
                    <form onSubmit={handleForgotSubmit} className="space-y-6 animate-fade-in">
                      <div className="space-y-1.5">
                        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">Forgot password?</h2>
                        <p className="text-2xs text-muted-foreground">No worries! We will send you a reset ticket link.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-4xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                            <Mail className="w-3 h-3" /> Email Address
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="you@skullyforms.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background border-b border-border/85 focus:border-primary text-xs py-2 px-1 outline-none text-foreground transition-colors font-semibold"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-primary hover:opacity-95 shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        Send Reset Link
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentView("login")}
                        className="w-full inline-flex items-center justify-center gap-1.5 text-3xs font-extrabold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Login
                      </button>
                    </form>
                  )}

                  {/* VIEW D: CHECK EMAIL */}
                  {currentView === "check-email" && (
                    <div className="space-y-6 animate-fade-in text-center lg:text-left">
                      <div className="space-y-1.5">
                        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">Check your email</h2>
                        <p className="text-2xs text-muted-foreground">We have sent a password reset link to your email.</p>
                      </div>

                      <div className="bg-success-bg border border-success/20 p-4 rounded-2xl flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        <p className="text-3xs text-muted-foreground leading-normal">
                          Please verify your inbox at <span className="font-bold text-foreground">{email}</span> and click the secure reset credentials link.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          toast.success("Resent new reset ticket!");
                        }}
                        className="w-full py-3 px-4 rounded-xl text-xs font-black text-foreground border border-border hover:bg-muted transition-colors flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        Resend Reset Link
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentView("login")}
                        className="w-full inline-flex items-center justify-center gap-1.5 text-3xs font-extrabold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Login
                      </button>
                    </div>
                  )}

                  {/* Social Authentications */}
                  {(currentView === "login" || currentView === "signup") && (
                    <div className="space-y-4 pt-4 border-t border-border/50 select-none">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute inset-x-0 h-px bg-border/50" />
                        <span className="relative z-10 px-3 bg-card text-5xs font-black uppercase tracking-widest text-muted-foreground/80">
                          Or Continue With
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {/* Google button */}
                        <button
                          type="button"
                          onClick={() => handleSocialClick("Google")}
                          className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors cursor-pointer shadow-sm"
                          title="Continue with Google"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                        </button>
                        
                        {/* GitHub button */}
                        <button
                          type="button"
                          onClick={() => handleSocialClick("GitHub")}
                          className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors cursor-pointer shadow-sm text-foreground"
                          title="Continue with GitHub"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                          </svg>
                        </button>

                        {/* Microsoft button */}
                        <button
                          type="button"
                          onClick={() => handleSocialClick("Microsoft")}
                          className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors cursor-pointer shadow-sm"
                          title="Continue with Microsoft"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 23 23">
                            <path fill="#f35325" d="M0 0h11v11H0z"/>
                            <path fill="#81bc06" d="M12 0h11v11H12z"/>
                            <path fill="#05a6f0" d="M0 12h11v11H0z"/>
                            <path fill="#ffba08" d="M12 12h11v11H12z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* 2. RIGHT COLUMN: Skeleton Illustration Panel */}
            <div className="lg:col-span-6 relative flex flex-col justify-center items-center overflow-hidden bg-section-dark rounded-none lg:rounded-r-[32px]">
              {/* Soft glow blobs */}
              <div className="absolute top-[10%] left-[10%] w-72 h-72 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
              <div className="absolute bottom-[10%] right-[5%] w-60 h-60 rounded-full bg-accent-purple/10 blur-[70px] pointer-events-none" />

              {/* Skeleton illustration — dark bg illustration sits naturally */}
              <div className="relative w-full max-w-[320px] aspect-square select-none z-10 transition-all duration-500 hover:scale-[1.02]">
                {mounted ? (
                  <Image
                    src={
                      (currentView === "forgot" || currentView === "check-email")
                        ? ASSETS.skeletons.inBox
                        : ASSETS.skeletons.writingDiary
                    }
                    alt="Skully authentication skeleton"
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="w-full h-full rounded-3xl bg-white/5 animate-pulse" />
                )}
              </div>

              {/* Caption */}
              <div className="mt-6 text-center space-y-1.5 z-10 max-w-[260px] px-4 pb-8">
                <h4 className="text-sm font-black tracking-tight text-white">
                  {currentView === "login" && "Your forms, sealed in the crypt."}
                  {currentView === "signup" && "Join the skeleton crew."}
                  {currentView === "forgot" && "We'll find your bones."}
                  {currentView === "check-email" && "Check your inbox!"}
                </h4>
                <p className="text-3xs font-medium text-white/50 leading-relaxed">
                  Skully Forms — where every response is sealed in obsidian.
                </p>
              </div>
            </div>

          </div>
        </main>

        {/* ==================== C. AUTH FOOTER ==================== */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 text-5xs font-black uppercase tracking-widest text-muted-foreground/80 select-none">
          <p>© {new Date().getFullYear()} Skully Forms Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Catacomb Rules</a>
          </div>
        </footer>

      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { Skull, Check, ArrowRight, Zap } from "lucide-react";

export const metadata = {
  title: "Pricing — Skully Forms",
  description: "Simple, transparent pricing for every team. Start free, scale as you grow.",
};

const PLANS = [
  {
    id: "seed",
    name: "Spooky Seed",
    emoji: "💀",
    price: { monthly: 0, annual: 0 },
    description: "Perfect for getting started",
    highlight: false,
    features: [
      "3 active forms",
      "100 responses / month",
      "Basic analytics",
      "6 themes",
      "Public & unlisted forms",
      "Community support",
    ],
    cta: "Start free",
    ctaHref: "/login",
  },
  {
    id: "necromancer",
    name: "Necromancer",
    emoji: "🔮",
    price: { monthly: 29, annual: 23 },
    description: "For creators who mean business",
    highlight: true,
    badge: "Most popular",
    features: [
      "Unlimited forms",
      "10,000 responses / month",
      "Advanced analytics & charts",
      "All 10 themes",
      "Custom form slugs",
      "Webhook integrations",
      "CSV export",
      "Email notifications",
      "Priority support",
    ],
    cta: "Get started",
    ctaHref: "/login",
  },
  {
    id: "overlord",
    name: "Skull Overlord",
    emoji: "👑",
    price: { monthly: 149, annual: 119 },
    description: "Enterprise-grade power",
    highlight: false,
    features: [
      "Everything in Necromancer",
      "Unlimited responses",
      "Team collaboration",
      "Admin dashboard",
      "Password-protected forms",
      "Custom branding",
      "SLA & dedicated support",
      "SSO / SAML",
    ],
    cta: "Contact sales",
    ctaHref: "mailto:sales@skully.forms",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <div className="border-b border-border/40 bg-card/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Skull className="w-5 h-5 text-primary" />
            Skully Forms
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Explore
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link
              href="/login"
              className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          <Zap className="w-3 h-3" />
          Simple Pricing
        </div>
        <h1 className="text-5xl font-black tracking-tight mb-4">
          A plan for every <span className="text-primary">skeleton</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Start free. Upgrade when you're ready to haunt more people with your forms.
        </p>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-7 flex flex-col gap-6 ${
                plan.highlight
                  ? "bg-primary/5 border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                  : "bg-card border-border/50"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Header */}
              <div>
                <div className="text-3xl mb-2">{plan.emoji}</div>
                <h2 className="text-lg font-black">{plan.name}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
              </div>

              {/* Price */}
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">
                    {plan.price.monthly === 0 ? "Free" : `$${plan.price.monthly}`}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-muted-foreground text-sm">/month</span>
                  )}
                </div>
                {plan.price.annual > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ${plan.price.annual}/mo billed annually · save 20%
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-foreground hover:bg-muted/80 border border-border/60"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-10">
          All plans include SSL encryption, GDPR compliance, and 99.9% uptime SLA. No credit card required for free plan.
        </p>
      </div>
    </div>
  );
}

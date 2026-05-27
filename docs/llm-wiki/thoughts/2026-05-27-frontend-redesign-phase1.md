# Frontend Redesign — Phase 1 Complete

**Date:** 2026-05-27  
**Scope:** Full frontend visual redesign — globals.css, layout.tsx, landing, dashboard, login, responses, builder

---

## 1. Scope / Context

Complete light-theme redesign of all frontend pages to match the LightThemeDemo.png reference. Multi-color section backgrounds, new typography system, green success tokens, dark auth panel.

---

## 2. Design Rationale & Trade-offs

### Fonts
- **Plus Jakarta Sans** (headings via `--font-heading`) — modern, slightly rounded, good weight range (400–800). More distinctive than system sans.
- **DM Sans** (body via `--font-body`) — clean, readable, slightly rounded. Pairs well with Plus Jakarta Sans.
- Loaded via `next/font/google` in `layout.tsx` → injected as CSS vars on `<html>`. Referenced in globals.css via `--font-sans: var(--font-body)` and `.font-heading` utility class.

### Multi-Color Section Backgrounds
Reference image shows landing page with different bg per section. Implemented as OKLCH CSS variables:
- `--section-peach` `oklch(0.975 0.022 40)` — hero, sandbox sections
- `--section-lavender` `oklch(0.972 0.018 295)` — pricing section
- `--section-mint` `oklch(0.972 0.025 155)` — success/form states
- `--section-dark` `oklch(0.12 0.04 295)` — footer, auth right panel

Dark mode overrides added for all section vars (subtle dark tints, not light colors).

### Success Green System
Added `--success`, `--success-foreground`, `--success-bg` tokens. Used on:
- Analytics completion rate card (text + icon)
- Dashboard stats (Responses, Published counts)
- Pricing feature check icons (enterprise tier)
- Auth check-email success box (replaced hardcoded `#10b981`)

### Keyframes
Moved from inline `<style jsx global>` in landing.tsx to `globals.css`. Classes: `animate-float`, `animate-pulseGlow`, `animate-scale-in`, `animate-fade-in`, `animate-shimmer`, `animate-slide-up`.

### Feature Cards (Landing)
Changed from glassmorphic dark cards → clean solid `bg-card` cards with colored icon bg. Matches the reference image's clean light aesthetic.

### Template Palette
Added 6 template color tokens (`--template-1` through `--template-6`) for use in future template gallery.

---

## 3. Blockers & Workarounds

### Invalid Tailwind Classes Fixed
- `w-4.5 h-4.5` → `w-4 h-4` or `w-5 h-5` (Tailwind doesn't have 4.5 step)
- `p-4.5`, `p-5.5`, `p-6.5`, `px-4.5`, `py-4.5` → replaced with valid values
- `scale-103` → `scale-105`
- `text-2xs`, `text-3xs`, `text-4xs` → now defined in `@theme inline` in globals.css (0.65rem, 0.6rem, 0.55rem)

### `font-sans` Override in Tailwind v4
In `@theme inline`, set `--font-sans: var(--font-body)` to make DM Sans the default body font. Headings use `.font-heading` utility class defined in `@layer utilities`.

### Auth Panel
Login right panel kept as dark (`bg-section-dark`) matching the reference's split dark/light layout. Replaced hardcoded `bg-[#1a0a0f]` and `bg-[#ff2e8c]/10` with CSS var references.

---

## 4. Active State & Handover

### Completed
- [x] globals.css — new tokens (success, section-*, accent-purple, accent-cyan, templates, custom text sizes, keyframes)
- [x] layout.tsx — Plus Jakarta Sans + DM Sans fonts
- [x] landing/index.tsx — full redesign (multi-section, clean cards, no inline keyframes, tokenized colors)
- [x] dashboard/index.tsx — font-heading, success stats, proper sidebar bg, emoji → icon
- [x] login/index.tsx — font-heading, tokenized colors, section-dark panel
- [x] tab-analytics.tsx — success green completion card, font-heading stats
- [x] tab-gallery.tsx — fixed bg + scale-103 bug
- [x] tab-submissions.tsx — fixed hardcoded dark bg, py-4.5 → py-4
- [x] All invalid Tailwind classes fixed across: canvas.tsx, layout-scroll.tsx, sidebar-left.tsx, question-renderer.tsx, responses/index.tsx

### Remaining / Phase 2
- [x] form/index.tsx — success state uses `bg-section-mint` + `CheckCircle` icon in `text-success`, h2 uses `font-heading font-extrabold text-success`, button uses success tokens; loader/error states use `bg-background` instead of `bg-black`
- [ ] Form respondent view dark bg: `bg-[#0c0c0e]` hardcodes could use `section-dark`
- [ ] Template gallery section (when built) — use `--template-*` tokens for card colors
- [ ] Dark mode audit — check all section backgrounds render correctly in dark mode
- [ ] Run dev server and visual-verify all pages

### Key Token Reference
```css
--primary: oklch(0.72 0.11 12)          /* rose-pink */
--accent-purple: oklch(0.55 0.22 295)   /* purple secondary */
--accent-cyan: oklch(0.88 0.14 195)     /* cyan logic/tech */
--success: oklch(0.65 0.18 150)         /* emerald green */
--section-peach: oklch(0.975 0.022 40)
--section-lavender: oklch(0.972 0.018 295)
--section-dark: oklch(0.12 0.04 295)
```

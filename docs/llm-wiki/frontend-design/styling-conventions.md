---
title: Frontend Styling Conventions
version: 1.0.0
scope: frontend-design
last_updated: 2026-05-22
owner: frontend-team
tags: [tailwind, css-v4, theme, oklch]
chunk_id: ui-styling-conventions
---

# Frontend Styling Conventions

## Covers
- Tailwind CSS v4 configuration and parameters
- Dynamic theme definitions under `@theme inline` using OKLCH color spaces
- Custom variants for dark mode controls

## Excludes
- Specific Drizzle database migrations
- tRPC route validations

## 🎨 Tailwind CSS v4 Setup
Our frontend utilizes Tailwind CSS v4 to style components with absolute design consistency. It is loaded in `apps/web/app/globals.css`.

### Global CSS Settings
- **Core Imports**:
```css
@import "tailwindcss";
@import "tw-animate-css";
```
- **Dark Mode Variant**: Declared natively via:
```css
@custom-variant dark (&:is(.dark *));
```
Allows clean dark styling classes (e.g. `dark:bg-background`).
<!-- chunk-end -->

## 💎 The Color Palette & Tokens
Colors are defined inside `globals.css` using modern **OKLCH format**, ensuring uniform color rendering across screens:

### OKLCH Theme Tokens
- **`--background`**: Primary view background. OKLCH `oklch(1 0 0)` (pure white) in light mode, mapping to `oklch(0.145 0 0)` (slate black) in dark mode.
- **`--primary`**: Accent controls. OKLCH `oklch(0.205 0 0)` (light mode) and `oklch(0.922 0 0)` (dark mode).
- **`--border`**: Border separator strokes. OKLCH `oklch(0.922 0 0)` (light mode) and `oklch(1 0 0 / 10%)` (dark mode).
<!-- chunk-end -->

## ⚠️ Styling Rules & Guardrails

### CSS Principles
- **No Hardcoded Values**: Never write arbitrary colors or styles (such as `bg-[#ffffff]` or `text-red-500`) that bypass our OKLCH design variables. Use standard theme names (e.g. `bg-primary`, `text-muted-foreground`, `border-border`).
- **Layout Boundaries**: Utilize standard responsive modifiers (`sm:`, `md:`, `lg:`, `xl:`) for multi-screen fluid scaling.
- **LLM Styling Invariants**:
  ⚠️ LLM NOTE: Do not suggest class strings from Tailwind v3 that are deprecated or modified in Tailwind v4. Verify theme references match the custom attributes defined under `@theme inline`.
<!-- chunk-end -->

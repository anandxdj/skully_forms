---
title: Frontend Asset Registry & Integration Guidelines
version: 1.0.0
scope: frontend-design
last_updated: 2026-05-25
owner: design-team
tags: [assets, public, typescript, naming-convention, guidelines]
chunk_id: ui-asset-registry-guidelines
---

# Frontend Asset Registry & Integration Guidelines

## Covers
- Strict folder structures for all public static asset files
- Naming conventions for logos, illustrations, textures, and custom icons
- TypeScript compile-time asset mappings to eliminate hardcoded path errors
- AI-friendly asset catalog registry pattern

## Excludes
- General database schema definitions
- Local development server start commands

---

## 📂 Asset Folder Architecture

To ensure your AI developers can find and utilize assets without scanning the entire repo, all frontend assets must be organized under `apps/web/public/assets/` using category subdirectories:

### Directory Map
- **`/assets/logos/`**: Brand logo marks, wordmarks, favicon assets.
- **`/assets/illustrations/`**: Empty state vector drawings, onboarding visuals, success animations.
- **`/assets/textures/`**: Seamless noise overlays, grid backgrounds, design accents.
- **`/assets/icons/`**: Custom SVG shapes (note: use Lucide React for generic dashboard icons).
<!-- chunk-end -->

---

## 🏷️ AI-Friendly Naming Conventions

Filenames must follow a strict semantic syntax. This allows future AI agents to identify exactly what an asset contains, its color theme variant, and its layout purpose:

### Filename Pattern
Filenames must use lowercase kebab-case in format: `[category]-[name]-[variant/state].[extension]`

### Examples
- **Logos**: `logo-primary-dark.svg`, `logo-symbol-gradient.png`
- **Illustrations**: `illustration-empty-dashboard.svg`, `illustration-submission-success.svg`
- **Textures**: `texture-mesh-dark.webp`, `texture-grid-sunset.svg`
- **Icons**: `icon-custom-cyberpunk-skull.svg`
<!-- chunk-end -->

---

## ⚙️ TypeScript Asset Map Contract

To completely prevent AI developers from writing wrong hardcoded file paths (which causes broken images), we use a strongly-typed TypeScript mapping dictionary inside `apps/web/lib/assets.ts`.

### Mappings Implementation
AIs must import this map rather than writing inline strings:
```typescript
export const ASSETS = {
  logos: {
    symbol: "/assets/logos/logo-symbol.svg",
    wordmarkDark: "/assets/logos/logo-wordmark-dark.svg",
    wordmarkLight: "/assets/logos/logo-wordmark-light.svg",
  },
  illustrations: {
    emptyDashboard: "/assets/illustrations/illustration-empty-dashboard.svg",
    submissionSuccess: "/assets/illustrations/illustration-submission-success.svg",
  },
  textures: {
    gridOverlay: "/assets/textures/texture-grid-sunset.svg",
    darkMesh: "/assets/textures/texture-mesh-dark.webp",
  }
} as const;

export type AssetPath = typeof ASSETS;
```
This forces TypeScript autocomplete to guide the AI, ensuring 100% path accuracy during code generation!
<!-- chunk-end -->

---

## 📓 Static Assets Catalog

Future AI agents will read this catalog to instantly identify available assets and matching visual themes:

### Active Assets List
| Asset Path | Naming Prefix | Color Space / Visual Theme | Intended Usage |
| :--- | :--- | :--- | :--- |
| `/assets/logos/logo-symbol.svg` | `logo-symbol` | Cyberpunk Neon / Glow | Primary header brand identity icon. |
| `/assets/illustrations/illustration-empty-dashboard.svg` | `illustration-empty` | Slate / Flat Minimal | Displayed when a user has no forms. |
| `/assets/textures/texture-grid-sunset.svg` | `texture-grid` | Sunset Warm gradient | Backdrop grid layout for the public form views. |
<!-- chunk-end -->

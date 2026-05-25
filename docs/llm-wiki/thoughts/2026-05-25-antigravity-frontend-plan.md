---
title: Frontend Architectural Design and Planning
version: 1.0.1
scope: thoughts
last_updated: 2026-05-25
owner: antigravity
tags: [thoughts, plan, architecture, frontend, oklch]
chunk_id: thought-frontend-planning-2026-05-25
---

# Frontend Architectural Design and Planning

## Covers
- Strategic front-end design choices for modularity and high developer ergonomics
- Alignment on state management, Pages/Views Component Pattern, and dynamic CSS properties
- Integration details with Postgres using Dev Credentials credentials login

## Excludes
- Specific database migration instructions or Docker deployment code

---

## 🎨 Architectural Decoupling & Low-Context AI

### Pages/Views Component Pattern
We agreed on the Pages/Views Component Pattern. Instead of putting full page logic directly inside `app/`, the `app/` files serve as minimal routing shells that import the primary page view component from `components/pages/[page-name]/` (e.g. `components/pages/dashboard/index.tsx`). This completely isolates page-specific code, state hooks, and sub-components in single-responsibility, highly granular subfolders. It makes it incredibly clean and simple for future AI agents to find, edit, and understand specific pages.
<!-- chunk-end -->

### The 200-Line Code Invariant
Every component will be kept under 200 lines. Larger components will be recursively factored out into sub-components. This simplifies unit testing, improves readability, and limits token waste during editing iterations.
<!-- chunk-end -->

### Asset Registry and TypeScript Mappings
To prevent AI developers from hardcoding raw static image paths (which leads to broken links and visual inconsistencies), we have established a strict static asset integration policy.
1. **Asset Folder Hierarchy**: All assets are cataloged inside structured directories under `public/assets/` (e.g. `/assets/logos/`, `/assets/illustrations/`).
2. **Kebab-Case Naming**: Assets use lowercase kebab-case named semantically `[category]-[name]-[variant].[extension]`.
3. **The TypeScript Map (`lib/assets.ts`)**: We map these assets directly inside a strongly typed TypeScript dictionary constant (`ASSETS`). The AI imports and references this dictionary (e.g. `ASSETS.illustrations.emptyDashboard`), forcing TypeScript autocomplete to govern asset paths.
4. **Registry Documentation (`asset-registry.md`)**: A static markdown ledger records each asset's location, design tags, and theme compatibility so AI can immediately look up available files.
<!-- chunk-end -->

---

## ⚡ Theming and State Management Systems

### Infinite Custom Themes via CSS Custom Properties
Rather than hardcoding themes in JS arrays, the form settings dynamically inject custom properties like `--primary` directly inline onto the container style. Standard Tailwind v4 utility classes automatically read these variables, giving builders infinite custom theme capability with zero runtime CSS rebuild cost.
<!-- chunk-end -->

### Form Builder State Isolation
The complex Form Builder is designed with a hybrid state engine. `react-hook-form` drives schema-level forms and inputs, while a localized React Context/useReducer handles UI interactions (active tabs, drag-and-drop actions, selections). This decouples schema data logic from representation rendering.
<!-- chunk-end -->

---

## 🚦 Phase 2 Implementation & Next Steps

### Developer Login Bypass Setup
To support identity contexts in Phase 2 before real JWT and OAuth cookies are integrated in Phase 4, we are establishing a dev login page using real database user accounts. Successfully matching email credentials will write a dev user cookie which the tRPC client forwards via headers.
<!-- chunk-end -->

### Work plan Execution Track
Our immediate next steps will be to seek approval on the implementation plan, then create `task.md` and start building out page-by-page starting with the Landing page and Dev Login views.
<!-- chunk-end -->

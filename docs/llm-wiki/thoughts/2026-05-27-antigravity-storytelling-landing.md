---
title: AI Agent Thought Ledger - Storytelling Compact Landing Page
version: 1.0.0
scope: frontend-design
last_updated: 2026-05-27
owner: frontend-team
tags: [thoughts, design-rationale, landing-page, mascot-showcase, storytelling]
chunk_id: wiki-thoughts-storytelling-landing
---

# AI Agent Thought Ledger - Storytelling Compact Landing Page

## Covers
- Rationale behind pivoting the Skully Forms landing page to a multi-section storytelling layout.
- Implementation of the Mascot & Form Theme Previewer, utilizing background and character assets dynamically.
- Spacing constraints to keep sections compact and highly professional.

## Excludes
- DB model specifications.
- tRPC route configuration blocks.

---

## 🎨 Design Pivot: Multi-Section Storytelling

### Spacing & Layout Proportions
- **Layout Shift**: Based on user feedback, we pivoted back to a complete, multi-section landing page to pitch the product's full capabilities (Hero, Mascot Showcase, Stats, Features, Sandbox, Pricing, Footer).
- **Proportional Heights**: To prevent the page from feeling too long or vertically bloated, we enforced extremely tight padding (`py-12 md:py-16`) across all scrolling panels, ensuring elements fit beautifully within standard laptop viewports.

---

## 🎮 Interactive Asset Showcase

### Mascot & Form Theme Previewer
- **Objective**: Dynamically showcase the rich frontend background and character assets.
- **50/50 Layout**:
  - **Left column**: Allows users to select or hover over the 5 core Skully personas (Boba, Gamer, Plant, Skater, Dev).
  - **Right column**: Smoothly updates a mock form card's background image (using `pinkStage`, `dark`, `leaf`, `goldenLeaf`, `dark2` background assets), center illustration, and conversational theme accents (borders, text colors, and button glows) in real time.

---

## 🚦 Compilation & Verification

### Typesafety Status
- **TSC Validation**: ran Next.js typescript check verifying the newly reintroduced states:
  ```bash
  pnpm --filter web check-types
  ```
- **Results**: Succeeded with **0 errors and 0 warnings**. The visual form builder creation and sandbox live sync are verified to function beautifully.

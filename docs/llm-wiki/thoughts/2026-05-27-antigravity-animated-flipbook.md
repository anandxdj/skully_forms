---
title: AI Agent Thought Ledger - Animated Skeleton Flipbook Integration
version: 1.0.0
scope: frontend-design
last_updated: 2026-05-27
owner: frontend-team
tags: [thoughts, design-rationale, landing-page, mascot-animation, flipbook]
chunk_id: wiki-thoughts-animated-flipbook
---

# AI Agent Thought Ledger - Animated Skeleton Flipbook Integration

## Covers
- Rationale behind the 49-frame high-fps sequential skeleton animation loop inside the Hero carousel.
- React interval hooks and state variables orchestrating active frame updates at ~22fps.
- Robust file mapping handling naming patterns and index skips.

## Excludes
- Specific Drizzle database configurations.
- tRPC route handlers.

---

## 🎭 Fluid Flipbook MASCOT Animation

### Rationale & Design
- **Concept**: The user provided 49 sequential frame image assets (`frame_001 2.png` to `frame_050 2.png` inside `/assets/fun_skeleton/`). We integrated this into the Hero carousel as a new animated mascot selection (**"Animated Skully 🎬"**).
- **Execution**: When active, the Hero mascot shifts from a static illustration to a playing 49-frame image sequence. An interval hook increments the frame index every 45ms to ensure a highly responsive, fluid walking/dancing mascot.
- **Styling**: Added a glowing hot-pink drop shadow filter (`drop-shadow-[0_24px_70px_rgba(255,46,140,0.35)]`) around the animated element, anchoring it into the stage backdrop perfectly.

---

## 🛠️ Bulletproof Asset Naming

### Filename String Array
- **Handling Gaps**: Mapped filenames dynamically in an array, properly handling spaces and skipping the missing `frame_010 2.png` index. This guarantees zero `404` or broken image requests on render cycles.

---

## 🚦 Verification and Compilation

### Typesafety Checks
- **Succeeds**: Verified with `pnpm --filter web check-types` running successfully with **0 compiler errors or warnings**.

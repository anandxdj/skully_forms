# Frontend Skeleton Theme Redesign

**Date:** 2026-05-27  
**Agent:** Claude (impeccable + image-gen session)

---

## 1. Scope / Context

Full visual redesign of all 6 Skully Forms pages to match a Typeform-clone skeleton theme (cute, not horror). Pages covered: Landing, Dashboard, Login, Builder (canvas), Public Form, Responses (all 3 tabs).

---

## 2. Design Rationale & Trade-offs

- **Assets strategy**: User placed skeleton PNGs into `public/assets/skeletons/` and `public/assets/background/`. Most have black backgrounds — used in dark panels (login right side `bg-[#1a0a0f]`). `Skeleton Dancing.png` has white/near-transparent bg — used for success screens on light theme.
- **Dark theme placeholder**: All `*Dark` keys in `ASSETS` point to same light asset files temporarily. User confirmed this is intentional — dark assets to be added later.
- **`mounted` guard pattern**: All `Image` components with `ASSETS` paths are wrapped in `mounted` state + `useEffect` to prevent SSR hydration mismatches in Next.js App Router.
- **URL encoding**: All asset paths with spaces use `%20` encoding in `lib/assets.ts`.
- **Stats data**: Dashboard stats bar uses live tRPC data (`forms.length`, `submissionCount`, etc.) — not mocked.
- **ASSETS registry**: `lib/assets.ts` is the single source of truth for all asset paths. Never hardcode paths in components.

---

## 3. Files Changed

| File | Change |
|---|---|
| `PRODUCT.md` | Created from scratch |
| `DESIGN.md` | Created from scratch |
| `apps/web/lib/assets.ts` | Added `skeletons` + `backgrounds` groups; preserved legacy `illustrations` keys |
| `apps/web/components/pages/landing/index.tsx` | Added stats strip section (12,400+ forms, 1.2M+ responses, etc.) |
| `apps/web/components/pages/dashboard/index.tsx` | Added 4-metric stats bar; upgraded empty state with `skeleton_in_box.png` |
| `apps/web/components/pages/login/index.tsx` | Right panel replaced with dark bg + skeleton illustration (writing diary / in-box) |
| `apps/web/components/pages/builder/canvas.tsx` | Empty state replaced with `skeleton_in_box.png` illustration |
| `apps/web/components/pages/form/index.tsx` | Success screen replaced Skull icon with `Skeleton Dancing.png` |
| `apps/web/components/pages/responses/tab-analytics.tsx` | Empty state upgraded with skeleton illustration |
| `apps/web/components/pages/responses/tab-submissions.tsx` | Empty state upgraded with skeleton illustration |
| `apps/web/components/pages/responses/tab-gallery.tsx` | Both empty states upgraded with skeleton illustrations |

---

## 4. Blockers & Workarounds

- Edit tool requires exact whitespace match — used `Read` with offset to verify exact content before editing when stuck.
- `Skeleton Dancing.png` has white background — only safe on light cream backgrounds, not dark panels.
- `tab-gallery.tsx` imports `Image as ImageIcon` from lucide — renamed `next/image` import to `NextImage` to avoid collision.

---

## 5. Active State & Handover

**What's done:** All 6 pages have skeleton illustrations in empty states, success screens, and side panels. Light theme fully implemented.

**What's pending for next agent:**
- Dark theme asset swap: replace placeholder dark keys in `ASSETS` with actual dark-variant skeleton files when user provides them.
- `form/layout-scroll.tsx` and `form/layout-slide.tsx`: not yet polished for brand consistency (no skeleton branding added).
- `builder/field-editor.tsx`: not yet reviewed — may benefit from minor polish.
- Consider adding skeleton character to the builder left palette header area for brand presence.

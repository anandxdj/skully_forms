# Theme Skeleton Illustrations

**Date:** 2026-05-27  
**Scope:** Builder theme system — added per-theme skeleton PNG illustrations

## 1. Scope / Context

Extended the theme system so selecting a theme now renders:
- A skeleton character PNG in the bottom-right corner of the form viewer
- An optional background image overlay (opacity ~15-18%)
- Both in builder preview (`form-page-viewer.tsx`) and published form (`theme-wrapper.tsx`)
- Skeleton thumbnail visible in the design-sheet theme picker swatches

## 2. Design Rationale & Trade-offs

- Added `THEME_ILLUSTRATIONS` to `theme-variables.ts` as a `Partial<Record<Theme, ThemeIllustration>>` — partial so themes without illustrations gracefully show nothing
- Used URL-encoded paths (matching convention in `apps/web/lib/assets.ts`) — no new asset imports needed
- Used raw `<img>` tags (not `next/image`) since paths are dynamic strings and these are decorative elements — avoids next.config domain/size config overhead
- Background overlays use low opacity (0.15–0.18) so OKLCH color variables still drive the palette; backgrounds add texture, not replace color
- Skeleton in `theme-wrapper.tsx` (published form) uses `fixed` positioning so it stays visible as users scroll through multi-question forms

## 3. Blockers & Workarounds

- Asset filenames have spaces → used URL-encoded paths (same pattern as `assets.ts`)
- `eslint-disable-next-line @next/next/no-img-element` added to suppress Next.js lint rule for decorative images where `next/image` isn't needed

## 4. Files Modified

| File | Change |
|------|--------|
| `apps/web/components/pages/builder/components/theme-variables.ts` | Added `ThemeIllustration` type + `THEME_ILLUSTRATIONS` export |
| `apps/web/components/pages/builder/components/form-page-viewer.tsx` | Renders background + skeleton overlay in builder canvas preview |
| `apps/web/components/pages/builder/components/design-sheet.tsx` | Shows skeleton thumbnail inside each theme picker swatch |
| `apps/web/components/pages/form/theme-wrapper.tsx` | Renders background + skeleton (fixed position) on published forms |

## 5. Theme → Asset Mapping

| Theme | Skeleton | Background |
|-------|----------|-----------|
| skullyLight | Skeleton with jacket with cookie | pink background |
| skullyDark | Skeleton Gaming | dark background |
| skullyNeon | Skeleton Gaming | Dark Background 2 |
| skullyGold | skeleton_with_money | Golden Leaf |
| skullyGreen | Green-skeleton-with-plants | Leaf Background |
| skullyParty | Skeleton Dancing | pink stage |
| slate | Skeleton with laptop | — |
| cyberpunk | Skeleton Gaming | — |
| sunset | Skeleton with skateboard | — |
| forest | Green-skeleton-with-plants | Leaf Background |

## 7. Per-Field-Type Skeletons (fun_skeleton frames)

Added `FIELD_TYPE_SKELETONS` to `theme-variables.ts` mapping each form field type to a `fun_skeleton` frame:

| Field Type | Frame | Description |
|-----------|-------|-------------|
| TEXT | frame_005 | Boba tea, casual |
| EMAIL | frame_001 | Flowers/bouquet, sending |
| TEXTAREA | frame_008 | Laptop + headphones, writing |
| NUMBER | frame_018 | Flamingo float, counting |
| DATE | frame_045 | Birthday cake |
| SELECT | frame_012 | Detective, searching |
| RADIO | frame_002 | Skateboarder, decisive |
| CHECKBOX | frame_030 | Corgi hug, multiple |
| RATING | frame_015 | Guitar player |
| FILE | frame_040 | DJ, mixing/uploading |

`FormPageViewer` now accepts optional `fieldType?: string`. Field-type skeleton overrides theme skeleton in the bottom-right slot; theme background image still shows. `CanvasPanel` passes `selectedField.type` to `FormPageViewer`. Assets registered in `apps/web/lib/assets.ts` under `funSkeletons`.

## 8. Next Agent Handover

- If skeleton sizes need adjustment: `form-page-viewer.tsx` uses `w-40 h-52`, `theme-wrapper.tsx` uses `w-56 h-72`
- If background opacity feels too strong/weak: adjust `opacity-[0.18]` in form-page-viewer and `opacity-[0.15]` in theme-wrapper
- The `skullyNeon` theme reuses `Skeleton Gaming.png` — consider adding a dedicated neon-colored skeleton if one is created

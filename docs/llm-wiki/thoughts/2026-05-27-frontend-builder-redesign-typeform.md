# Builder Redesign — Typeform-Style 3-Panel Layout

**Date:** 2026-05-27  
**Agent:** frontend-builder-redesign

---

## Scope/Context

Full redesign of `apps/web/components/pages/builder/` from overlay-drawer architecture to persistent 3-panel layout matching Typeform's editor UX. Also added workflow/branching logic (conditional question jumps), in-place preview modal (no URL change), and shared field-type config.

Files created/modified:
- `apps/web/lib/field-type-config.ts` (new)
- `packages/trpc/server/schemas/form-field-schemas.ts` (LogicRule added)
- `apps/web/components/pages/builder/components/` — 13 new atom components
- `apps/web/components/pages/builder/panels/` — 5 new panel components
- `apps/web/components/pages/builder/index.tsx` (rewritten)
- `apps/web/components/pages/form/layout-slide.tsx` (branching added)

---

## Design Rationale & Trade-offs

**3-panel layout**: `LeftPanel (240px) | CanvasPanel (flex-1) | RightPanel (300px)` — always visible, no overlay. Selection-based editing: click question in left or canvas → inspector updates on right. `selectedFieldId` lives in `builder/index.tsx` as single source of truth.

**Atomic component architecture**: 13 atoms under `builder/components/`, 5 panels under `builder/panels/`. Each atom is independently testable. Zero duplication of `FIELD_TYPES` array — extracted to `apps/web/lib/field-type-config.ts`.

**Preview modal**: Uses existing `ThemeWrapper + LayoutSlide/LayoutScroll` unchanged. `onSubmit` is a no-op toast. No URL change — `Dialog` overlay. State resets on close.

**Workflow/branching**: `LogicRule` schema added to `baseFieldSchema` as `logic?: LogicRule[]`. No DB migration — fields column is JSONB. `evaluateCondition()` in `layout-slide.tsx` runs before index increment in `handleNext`. Branching only in SLIDE mode (consistent with Typeform behavior).

**Auto-save**: All existing tRPC hooks unchanged. `updateForm` now persists `logic` arrays automatically since they're in the fields JSONB blob.

---

## Blockers & Workarounds

- **Discriminated union + Partial updates**: `onUpdateField(id, { options })` fails TypeScript narrowing because `options` only exists on some variants. Cast `as any` at call site — acceptable since `{ ...f, ...updated }` is already cast to `FormField` in `handleUpdateField`.
- **Dialog full-screen**: Used `[&>button]:hidden` to suppress default shadcn close button. Class overrides `max-w-none w-screen h-[100dvh] rounded-none border-none` make it full-viewport.
- **Old sidebar files**: `sidebar-left.tsx`, `sidebar-right.tsx`, `canvas.tsx` remain — no longer imported by `index.tsx`. Safe to delete in follow-up cleanup.

---

## Active State & Handover

**What works now:**
- 3-panel persistent layout (left questions list, center canvas, right inspector)
- Left panel: question list with type badges, delete, add button, endings section
- Center canvas: phone-frame preview, question cards, hover insert zones
- Right inspector: full field editor (label, placeholder, type, required, options, type-specific)
- Top toolbar: Content/Workflow/Design tabs, Preview, Publish
- Preview modal: full-screen overlay with real form player, no URL change
- Workflow tab: per-question branching rules UI (IF equals/contains/not_equals → jump/end)
- Branching logic evaluated in SLIDE mode form player

**Next steps:**
1. Delete legacy `sidebar-left.tsx`, `sidebar-right.tsx`, `canvas.tsx`, `field-editor.tsx`
2. Add `dnd-kit` drag-drop reordering (hook point: `dragHandleProps` on `QuestionListItem`)
3. `EndingsPanel` — wire up real ending screens
4. Mobile: collapse left panel to drawer on small screens

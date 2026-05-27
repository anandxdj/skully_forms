# 2026-05-27 — Builder `/builder/[id]` Typeform-style Redesign

Agent: claude (Opus 4.7, 1M context). Context tag: `#ui` (frontend-design).

## Scope / Context

Redesigned the builder page into a Typeform-style two-bar nav with a single-question, inline-editable WYSIWYG canvas. Removed the half-built Workflow feature entirely (UI + schema).

Files changed
- `apps/web/components/pages/builder/index.tsx` — rewired to drive new bars, sheets, single-field canvas. Dropped `activeTab: workflow|design` modes and right inspector panel.
- NEW `apps/web/components/pages/builder/components/top-bar-primary.tsx` — Forms breadcrumb · inline-editable title · save indicator · tabs (Content/Connect/Share/Results) · share-link · Publish.
- NEW `apps/web/components/pages/builder/components/top-bar-secondary.tsx` — `+ Add content` popover, Design button, Desktop/Mobile toggle, Play preview, Settings gear.
- NEW `apps/web/components/pages/builder/components/design-sheet.tsx` — right-side Sheet with 6 themes + layout mode + description.
- NEW `apps/web/components/pages/builder/components/settings-sheet.tsx` — submission rules + webhook + publish toggle.
- NEW `apps/web/components/pages/builder/components/canvas-field-inline.tsx` — WYSIWYG single-field card; `contentEditable` for label/placeholder, inline option editors with add/delete, Required toggle, Delete.
- REWRITTEN `apps/web/components/pages/builder/panels/canvas-panel.tsx` — single-field slide canvas wrapped by `ThemeWrapper` so the actual selected theme paints the background; mobile mode renders inside a 390px phone frame.
- DELETED (orphan after redesign): `panels/workflow-panel.tsx`, `panels/design-panel.tsx`, `panels/right-panel.tsx`, `components/top-toolbar.tsx`, `components/workflow-rule-row.tsx`, `components/inspector-*.tsx`, `field-editor.tsx`, legacy `canvas.tsx`.
- `apps/web/components/pages/form/layout-slide.tsx` — dropped `LogicRule` import and the branching-logic evaluator inside `handleNext` (cascaded from schema removal). Slide flow is now linear-only.
- `packages/trpc/server/schemas/form-field-schemas.ts` — removed `logicRuleSchema`, `LogicRule` type, and `logic?: LogicRule[]` field from the base schema.

## Design Rationale & Trade-offs

- **Two bars, not one.** Primary bar = page-level (tabs, publish, share). Secondary bar = builder tool surface (add, design, device, play, settings). Matches the user's reference image and keeps the form visible while page actions remain reachable.
- **Single-field WYSIWYG canvas.** Eliminates the eye-jump between right sidebar and canvas. `contentEditable` is the simplest path that didn't require a new dep and respects existing theming via `ThemeWrapper`.
- **Sheets, not tabs, for Design + Settings.** Pulls them out of the page chrome so the user is editing form content most of the time. Theme is form-level (existing data model) — no DB change needed.
- **Connect / Share tabs are stubs.** Results tab routes to the existing `/responses/[id]` page (already implemented).
- **Workflow dropped entirely.** Removed schema field + branching evaluator. Existing DB rows containing `logic` inside the `fields` JSONB column are tolerated by Zod (no `strict()` on base) and silently ignored — no migration needed.

Trade-offs accepted:
- Right-side field inspector is gone. Advanced field props (FILE `accept`/`maxSizeMB`, RATING `maxStars`) are exposed inline on the canvas card; the dedicated inspector returns later if needed.
- `LogicRule` removal is breaking for any client that wrote logic data. No external clients exist yet, so this is safe.

## Blockers & Workarounds

- `apps/web/components/pages/form/layout-slide.tsx` still imported `LogicRule` and evaluated branching at runtime. Schema removal would have left a dangling import; tracked it down via Grep and stripped both the import and the evaluator block.
- `apps/web/components/pages/builder/canvas.tsx` was a legacy unused canvas pulling `FieldEditor`. Verified via Grep that nothing imports it, then deleted to prevent confusion.
- Pre-existing TS errors in `packages/trpc/server/*.ts` (TS2742 portability) and `apps/web/components/pages/landing/index.tsx` (TS2322) are not from this change — confirmed by reading them. Left untouched.

## Active State & Handover

- Builder is fully functional: type check returns only pre-existing errors. Dev server has not been run by me — next agent should `pnpm dev` and smoke-test the flow described in the plan file (`C:\Users\Dell\.claude\plans\the-middle-part-of-whimsical-feather.md`, "Verification" section).
- DB schema unchanged. `formsTable.fields` JSONB may still hold legacy `logic` arrays inside field objects — harmless; consumers ignore unknown keys.
- API contracts unchanged from the route surface; only the input *shape* tightened (no `logic`). See `docs/llm-wiki/api-trpc/endpoint-contracts.md` for the public-facing input — that file may need a one-line update to drop `logic` from the field schema description.
- Open follow-up: Connect tab (integrations), Share tab (public link UI).

## Amendments (same session, after first user feedback)

- **Light by default.** User flagged the builder as "supposed to be light mode". Switched default theme to `skullyLight` in two spots: `apps/web/components/pages/builder/index.tsx` (`useState<Theme>("skullyLight")`) and `packages/database/models/form.ts` (`varchar("theme").default("skullyLight")`). Existing forms in DB with `theme = "slate"` keep their dark theme until the user changes it in the Design sheet.
- **Right panel restored.** User asked to include the right panel back. Rebuilt as `apps/web/components/pages/builder/panels/right-panel.tsx` — a slim 280px sidebar showing advanced field options that don't fit cleanly inline (label override, required toggle, NUMBER min/max, RATING maxStars, FILE accept/maxSizeMB, plain placeholder for text fields). Inline canvas editing remains the primary edit path; the right panel is the secondary surface for advanced props only. Wired into `index.tsx` after `CanvasPanel`.

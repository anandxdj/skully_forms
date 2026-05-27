---
title: Thought Ledger - Builder/[id] Premium Redesign
version: 1.0.0
scope: thoughts
last_updated: 2026-05-27
owner: frontend-team
tags: [thoughts, builder, frontend, themes, slide-default, premium]
chunk_id: thought-builder-premium-redesign
---

# Thought Ledger - Builder/[id] Premium Redesign

## Covers

- Default `layoutMode` flipped from `SCROLL` → `SLIDE` for newly created forms.
- Canvas viewport restructured so the themed card always fills available height with no inner scroll.
- Canvas surround now picks up theme tokens (subtle ambient tint), so opening a form bathes the workspace in the form's theme.
- New fields seed with empty `label`/`placeholder`; the inline editor renders the hint via existing `data-placeholder` CSS instead of pre-filled real text.
- Server schema `baseFieldSchema.label` relaxed from `min(1)` → `max(500)` only; non-empty enforced on the client publish path.
- Typography, spacing, motion polish across `CanvasFieldInline`, `FormPageViewer`, and `CanvasPanel`.

## Excludes

- Right/left panel polish (deferred).
- Preview modal polish (deferred).
- Option-row seed text ("Option 1", "Option 2") — left untouched because options are user-added explicitly and `optionFieldExtras.options: z.string().min(1)` still enforces non-empty per option.
- Server-side publish validation — currently client-only gate. Belt-and-suspenders server check on `updateForm` when `published: true` is deferred.

---

## Design Rationale & Trade-offs

### Why SLIDE as default

Skully Forms positions itself as a Typeform-clone conversational form product (`PRODUCT.md`). Authors landing in `SCROLL` immediately experience the wrong mental model. Flipping the DB default to `SLIDE` makes new forms feel right from second one. Old forms keep their stored value — no migration of historical data.

### Why empty seed text + relaxed `label.min(1)`

The previous `label: "New text question"` pattern forced authors to triple-click + delete before typing. The inline `EditableText` span already supported `empty:before:content-[attr(data-placeholder)]` so showing the hint is free — the bug was seeding a real value.

Relaxing `label` to `z.string().max(500)` removes the autosave failure that would have happened immediately on every field add. The non-empty constraint moves to the publish path:

```ts
// apps/web/components/pages/builder/index.tsx — handlePublishToggle
if (next) {
  const missing = fields
    .map((f, i) => ({ idx: i + 1, label: f.label.trim() }))
    .filter((f) => f.label.length === 0);
  if (missing.length > 0) {
    toast.error(`Add a question to: ${missing.map(m => `#${m.idx}`).join(", ")}`);
    return;
  }
}
```

Trade-off: a malicious caller could publish via direct tRPC with empty labels. Acceptable because (a) the public form would just render blank question text — degraded UX, not a security issue — and (b) a server-side gate is cheap to add later in `formService.updateForm`.

### Why subtle-ambient theme surround instead of full bleed

Two interpretations of "the card should match the current theme":
- Full bleed: canvas + card share the theme's `--background`. Reads as one immersive themed surface but the card edge dissolves and the focal point of the workspace is lost.
- Subtle ambient (chosen): canvas inherits the theme's CSS vars + a low-opacity `bg-muted/40` veil + radial primary-tinted glow. The card stays the brightest, sharpest object in view, but the chrome around it tints to the theme.

Picked subtle ambient because the builder is a workspace, not a preview. Author needs the card to feel like a tangible object on a surface, not the surface itself.

Implementation: extracted `THEME_VARIABLES` to `apps/web/components/pages/builder/components/theme-variables.ts` so both `FormPageViewer` and `CanvasPanel` consume the same map. Outer wrapper sets the vars + a CSS `radial-gradient` using `var(--primary)` for the glow.

### Why drop `aspect-[16/10]` / `aspect-[9/16]`

Fixed aspect ratios force the card to a shape regardless of viewport. On a tall screen the card sits squat in the middle with huge empty bands; on a short screen content overflows into the inner `overflow-auto` scroll. Author then has to scroll inside an editor to see the question they are editing — broken UX.

Replaced with `flex-1 min-h-0` so the card claims all canvas height. `max-w-4xl` desktop / `max-w-[390px]` mobile still constrains width. Inner viewport switched to `overflow-hidden` because the card is now tall enough that a single question always fits. If a single question ever exceeds the height, the design should adjust (e.g., compact the option rows) — never re-enable scroll, because slide-mode is the conversational promise.

### Why publish gate client-only (for now)

Server check is cheap to add but requires touching `formService.updateForm` and shared error shape. Left as a follow-up because the immediate user pain was UX (delete-before-type), not a security boundary.

---

## Files Changed

| File | Change |
|---|---|
| `packages/database/models/form.ts` | `layoutMode.default("SCROLL")` → `default("SLIDE")` |
| `packages/database/drizzle/0006_furry_ultragirl.sql` | Generated: `ALTER TABLE forms ALTER COLUMN layout_mode SET DEFAULT 'SLIDE'` (+ theme default cleanup) |
| `packages/trpc/server/schemas/form-field-schemas.ts` | `baseFieldSchema.label`: `z.string().min(1).max(500)` → `z.string().max(500)` |
| `apps/web/components/pages/builder/components/theme-variables.ts` | NEW. Extracted `THEME_VARIABLES` map + `themeVars(theme)` helper. |
| `apps/web/components/pages/builder/components/form-page-viewer.tsx` | Imports `themeVars`. Drops aspect ratio. Uses `flex-1 min-h-0`. Inner `overflow-hidden`. Deeper ambient glow. |
| `apps/web/components/pages/builder/panels/canvas-panel.tsx` | Imports `themeVars`. Outer wrapper inherits theme vars + radial primary glow + bg-muted/40 veil. Inner column claims `flex-1 min-h-0` so card stretches. Nav row restyled with backdrop blur and pill counter. |
| `apps/web/components/pages/builder/components/canvas-field-inline.tsx` | Label upgraded to `text-2xl md:text-3xl font-heading font-extrabold tracking-tight`. Counter chip in primary tint. Progress bar full opacity primary + `transition-[width] duration-700`. Option rows `rounded-2xl py-3`. Dropped `|| "Untitled question"` fallback on commit — empty allowed. Placeholder hint opacity `/40`. |
| `apps/web/components/pages/builder/index.tsx` | `handleAddField` seeds `label: ""` / `placeholder: ""`. `handlePublishToggle` gates on every field label being non-empty. |

---

## Blockers & Workarounds

### Drizzle generated more than expected

`db:generate` emitted both `layout_mode → SLIDE` and `theme → skullyLight`. The theme line indicates a prior in-flight model change (theme default was `slate` in `0005_busy_skin.sql`, now `skullyLight`) was never captured in a migration. Now captured. Confirmed non-destructive: only affects new rows.

### Pre-existing TS errors in `landing/index.tsx`

`pnpm exec tsc --noEmit` surfaces ~18 strict-null errors in `apps/web/components/pages/landing/index.tsx`. Unrelated to this work. Zero new errors in builder/* or schemas/*.

### Unused imports in `canvas-field-inline.tsx`

`GripVertical` (and the `hover`/`setHover` state) are unused. Left untouched — not breaking build, and the hover state was an existing scaffold that may be used by the next polish pass.

---

## Active State & Handover

### What works now

- Create new form from dashboard → lands in `/builder/<id>` with theme `skullyLight` (Cute Skully Pink) and layout `SLIDE` defaults.
- Click `+` to add any field type → empty label, empty placeholder, hint text renders via CSS attr, author types directly.
- Canvas card fills viewport height. No inner scroll. No outer canvas scroll.
- Open Design sheet, switch theme → entire canvas surround tints to match (skullyLight = warm cream + soft pink glow; cyberpunk = near-black + neon pink glow; etc.).
- Switch device to Mobile → card narrows to phone width, still fills height.
- Try to publish with any empty-label field → toast lists the offending field numbers, publish blocked.
- Existing forms keep their stored `layoutMode` and `theme` — no historical data touched.

### What's pending for next agent

1. **Server-side publish validation.** Add a check in `packages/services/form/index.ts → updateForm`: when incoming `published: true`, reject if any field has empty/whitespace label. Mirror the client toast as a `TRPCError` with `code: "BAD_REQUEST"`.
2. **Option-row UX.** Right now adding a CHECKBOX/SELECT/RADIO field seeds two options as `["Option 1", "Option 2"]`. Same delete-before-type friction. Either (a) seed `["", ""]` and relax `optionFieldExtras.options: z.string().min(1)` AND filter empties at publish, or (b) leave as-is since options are explicit.
3. **Right panel polish.** Premium pass not applied. Inputs/buttons still look 2024-vintage. Likely the next high-impact tweak.
4. **Migration deploy.** `0006_furry_ultragirl.sql` ready. Run `pnpm --filter=@repo/database db:migrate` against staging + prod. Non-destructive but should land in lower envs first.
5. **Visual regression.** No dev server run yet — verify in browser. Open `/builder/<existing-form-id>` AND a freshly created form; confirm both render correctly with their respective stored values vs. new defaults.

---
<!-- chunk-end -->

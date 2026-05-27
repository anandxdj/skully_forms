---
title: Thought Ledger - Publish Dialog + ExpiresAt + Visibility
version: 1.0.0
scope: thoughts
last_updated: 2026-05-27
owner: frontend-team
tags: [thoughts, publish, dialog, expires-at, visibility, schema, builder]
chunk_id: thought-publish-dialog-expires-visibility
---

# Thought Ledger - Publish Dialog + ExpiresAt + Visibility

## Covers

- Replaced the bare publish toggle in the builder top bar with a proper publish dialog covering visibility, access mode, schedule (`expiresAt`), and webhook URL.
- Wired `expiresAt` end-to-end (Zod input + service + route + builder state + dialog UI). Column already existed in DB and was already enforced on `submitResponse`, but had no UI or update path.
- Wired `visibility` (PUBLIC | UNLISTED) into the service `updateForm` and the route, then surfaced it as the first section of the publish dialog. Schema, type, and column were added externally; this work completed the through-path.
- Confirmed analytics + responses page workflow is fully operational (no stubs, modal inspector exists, all three tabs hit real procedures).

## Excludes

- Drop-off or peak-activity analytics (deferred — separate ledgers per roadmap).
- The new explore page wiring (`apps/web/app/explore/page.tsx`) — TS error there is pre-existing and out of scope.

---

## Files Changed

| File | Change |
|---|---|
| `packages/trpc/server/schemas/form-schemas.ts` | Added `expiresAt` to `updateFormInputSchema` (accepts ISO string / Date / null). Added `expiresAt: z.date().nullable()` to `formOutputSchema`. Externally also gained `visibilitySchema`, `Visibility` type, plus expanded theme enum and `visibility` field on output. |
| `packages/services/form/model.ts` | `UpdateFormInput` now includes `expiresAt?: string \| Date \| null` and `visibility?: "PUBLIC" \| "UNLISTED"`. |
| `packages/services/form/index.ts` | `updateForm` passes through `visibility` and coerces `expiresAt` (string → Date, null → clear, invalid → 400). |
| `packages/trpc/server/routes/forms/route.ts` | `updateForm` mutation forwards `input.expiresAt` and `input.visibility`. |
| `packages/database/drizzle/0007_wealthy_hiroim.sql` | Generated: `ADD COLUMN visibility varchar(20) DEFAULT 'PUBLIC' NOT NULL`. |
| `apps/web/components/pages/builder/index.tsx` | New `expiresAt` + `visibility` state, hydrated from initial form, included in autosave dep array + mutation payload. Replaced `handlePublishToggle` with `openPublishFlow` (unpublish stays direct; publish opens dialog). Added `handlePublishConfirm` that applies dialog values + copies public link. Added `collectPublishIssues` validator. |
| `apps/web/components/pages/builder/components/publish-dialog.tsx` | NEW. Dialog with four sections: Discoverability (visibility), Who can respond (submission mode), Close date (toggle + quick durations + datetime-local), Webhook (URL). Public URL preview. Primary CTA disabled if expires-at is in the past or webhook is non-empty + non-http. |
| `apps/web/components/pages/builder/components/settings-sheet.tsx` | Renamed CTA "Publish Now" → "Open publish settings" so the user understands the button routes through the dialog. |

---

## Design Rationale & Trade-offs

### Why a dialog, not a sheet

Settings sheet is the place for ongoing config tweaks. The publish action is a one-shot ceremony — author commits to "this is live". A modal dialog forces attention on the publish-time decisions, then closes. Sheet stays available for later tuning.

### Why visibility AND submission mode

These look adjacent but solve different problems:
- **Visibility** = who *finds* the form (search/explore). PUBLIC = discoverable; UNLISTED = link-only.
- **Submission mode** = who can *submit* once they have the form (auth/anon/both).

A form can be UNLISTED + ANONYMOUS (private link survey) or PUBLIC + AUTHENTICATED (open gallery + login wall). Conflating them would break legitimate combinations.

### Why `expiresAt` accepts string-or-Date-or-null at the boundary

Client serializes Date → ISO string before sending; null is a deliberate clear signal; absent leaves DB row alone. Zod `z.union([z.string().datetime(), z.date(), z.null()])` covers all three without forcing the client to construct a Date instance through tRPC's JSON boundary. Service coerces to Date for Drizzle.

### Why unpublish stays direct (no dialog)

Unpublish is reversible by re-publishing. Adding a dialog there is friction without payoff. Empty-label and empty-fields gates only apply to going live.

### Why publish-time validation is client-only

Server should still reject empty-label fields when `published: true` for defense in depth. Marked as a follow-up. The Zod schema already permits empty labels because the placeholder UX depends on them (see `2026-05-27-builder-premium-redesign.md`); a server-side check on the publish branch would close the loop.

### Why visibility is just a string in `formOutputSchema`

The schema currently has `visibility: z.string()` (loose) rather than `visibilitySchema`. This was added externally — likely a deliberate choice to keep output decoded loosely while the input remains strict. Acceptable because the client only reads visibility through the `Visibility` cast on hydrate; server rejects invalid writes via `updateFormInputSchema`.

---

## Blockers & Workarounds

### External edits during the run

While building, the user (or a linter) added `visibility`, expanded the theme enum (`skullyNeon`, `skullyGold`, `skullyGreen`, `skullyParty`), introduced an `explore` route, and added `getPublicForms`. None of these conflicted with the publish work, but several Edit calls failed with "file modified since read" — retried after re-reading. No data lost.

### Pre-existing TS errors

`apps/web/components/pages/landing/index.tsx` (~18 strict-null errors) and `apps/web/app/explore/page.tsx` (missing component) — both unrelated. Files in this change-set type-check clean.

### Migration regen captured TWO things

`0006_furry_ultragirl.sql` (prior session): captured the `layoutMode → SLIDE` default flip AND an in-flight `theme → skullyLight` default that had been authored without a matching migration. `0007_wealthy_hiroim.sql`: just the `visibility` column addition. Both are non-destructive (defaults only / NOT NULL column with default for existing rows).

---

## Active State & Handover

### What works now

- Clicking **Publish** in the top bar opens the publish dialog. Required fields validated client-side (non-empty labels, at least one field) before the dialog opens.
- Dialog exposes: Discoverability (Public / Unlisted), Who can respond (Anonymous / Signed-in / Either), Close date (with +1 day, +1 week, +1 month quick presets and a datetime-local input), Webhook URL, and a copy of the public link.
- Confirming publishes the form, autosaves the new settings, and copies the public link to clipboard.
- **Unpublish** stays a direct one-click action with a toast.
- `expiresAt` is persisted; the server-side `submitResponse` gate already refuses submissions past the expiry. End-to-end works without further backend changes.
- **Analytics + Responses page**: confirmed fully functional. All three tabs (Analytics, Submissions, Gallery) hit live tRPC procedures. Submissions tab has a Q&A inspector modal. No stubs.

### What's pending for the next agent

1. **Server-side publish gate.** Add a check in `formService.updateForm` that rejects `published: true` if any field's `label` is empty. Currently client-only.
2. **Run pending migrations.** `0006_furry_ultragirl.sql` and `0007_wealthy_hiroim.sql` need to be applied in dev/staging.
3. **Surface `expiresAt` countdown on the public form.** When a published form is near expiry, show "Closes in 2 days" to respondents.
4. **Settings sheet de-duplication.** Submission rules + webhook still live in both the sheet AND the publish dialog. Decide: keep both (sheet = ongoing config; dialog = publish ceremony) or remove from sheet now that the dialog owns them. Recommend keep.
5. **Visibility-aware explore page.** A `getPublicForms` procedure was added; ensure it filters on `visibility = 'PUBLIC' AND published = true`. The `apps/web/app/explore/page.tsx` route is currently broken (missing component).
6. **`formListItemOutputSchema.extend` redundancy.** `formOutputSchema` already includes `submissionCount: z.number().optional()`. The extended list schema re-declares it as required — both work, but consider dropping the duplicate.

---
<!-- chunk-end -->

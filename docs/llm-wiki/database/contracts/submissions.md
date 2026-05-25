---
title: Database Contracts - Submissions
version: 1.0.0
scope: database
last_updated: 2026-05-24
owner: dev-platform-team
tags: [db, schema, submissions, contracts]
chunk_id: db-contracts-submissions
---

# Database Contracts - Submissions

## Covers
- Table schemas, constraints, and data definitions for the `submissions` table in PostgreSQL.
- Submission data validation and aggregated analytics procedures.

## Excludes
- Forms configuration table schema (managed in forms contract).
- File upload server API (managed in gateway configuration).

## 📊 Submissions Table Structure

### Columns Definition
The `submissions` table captures individual respondent inputs mapped to a parent form configuration.
- `id` (uuid, primary key): Defaults to `defaultRandom()`.
- `formId` (uuid, references `forms(id)`, cascade delete): Relates the submission to its parent form structure. If the form is hard deleted, all related submissions are automatically purged.
- `data` (jsonb): Raw payload of response keys and validated answer values, typed compile-time as `DbSubmissionData`. Defaults to `{}`.
- `respondentId` (uuid, references `users(id)`, nullable, set null on delete): Tracks respondent ID if the form was answered in authenticated mode.
- `deviceFingerprint` (varchar(64), nullable): SHA-256 hash of IP + User-Agent for anonymous submission deduplication.
- `isSpam` (boolean, default false, not null): Tracks if the submission has been marked as spam by moderation rules.
- `reviewedAt` (timestamp, nullable): Tracks when a submission's spam or content review status was updated.
- `startedAt` (timestamp, nullable): Timestamp when the form was opened by the respondent.
- `durationMs` (integer, nullable): Duration in milliseconds between starting and submitting the response.
- `createdAt` (timestamp): Record timestamp when the submission is captured. Defaults to `defaultNow()`.
<!-- chunk-end -->

### Indexing and Constraints
To support high performance dashboards, the table is indexed:
- `submissions_form_created_idx` (Compound Index): Indexes `formId` + `createdAt` to quickly retrieve all submissions for a given form sorted chronologically.
<!-- chunk-end -->

## 🛠️ Validation and Analytics Protocols

### Write Validation
Before executing an insert, the input is validated via `submitFormInputSchema`. Individual answers must pass `fieldAnswerSchema` which restricts inputs to strings, numbers, booleans, arrays of strings (for checkbox choices), or valid `fileAnswerSchema` objects containing URL, name, size, and mime-type.
<!-- chunk-end -->

### Analytics Processing
The service layer aggregates option-based fields (SELECT, RADIO, CHECKBOX) dynamically to generate distributions.
- Multi-select arrays (CHECKBOX) are expanded.
- Non-option field types (TEXT, NUMBER) are skipped during analytics calculation.
<!-- chunk-end -->

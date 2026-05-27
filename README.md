# Skully Forms 💀

A production-grade Typeform-clone SaaS with a skulls theme. Built with Turborepo, tRPC, Zod, Drizzle ORM, and Next.js.

## Features

- **Form Builder** — Drag-and-drop builder with 10 field types and 10 themes
- **Public & Unlisted Forms** — PUBLIC forms appear in the explore gallery; UNLISTED forms are link-only
- **Anonymous Submission** — No login required for respondents
- **Analytics** — Pre-computed submission counts and option distribution charts
- **Rate Limiting** — Protects public submission endpoints from abuse
- **Scalar API Docs** — Full OpenAPI documentation at `/docs`
- **Multi-theme Support** — skullyLight, skullyDark, skullyNeon, skullyGold, skullyGreen, skullyParty + 4 more

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Run database migrations
pnpm db:migrate

# Seed demo data (optional)
pnpm db:seed

# Start development servers
pnpm dev
```

Web app: http://localhost:3000  
API server: http://localhost:8000  
API docs: http://localhost:8000/docs

## Demo Credentials

```
Email:    demo@skully.forms
Password: Demo1234!
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/dev` |
| `PORT` | API server port | `8000` |
| `BASE_URL` | API base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_API_URL` | API URL for the web app | `http://localhost:8000` |
| `EXPOSE_DOCS` | Enable Scalar API docs at `/docs` | `true` |
| `GOOGLE_OAUTH_CLIENT_ID` | Google OAuth client ID | — |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google OAuth client secret | — |

## Monorepo Structure

```
apps/
  api/          Express + tRPC server
  web/          Next.js frontend (App Router)
packages/
  database/     Drizzle ORM schema + migrations
  trpc/         tRPC routers, Zod schemas, OpenAPI metadata
  services/     Business logic (FormService, AuthService)
  logger/       Centralized logging
```

## API Documentation

With `EXPOSE_DOCS=true`, the API exposes:

- `GET  /openapi.json` — OpenAPI spec
- `GET  /docs` — Scalar interactive docs UI

### Key Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/sign-up` | — | Register a new creator account |
| `POST` | `/auth/sign-in` | — | Sign in and receive session cookie |
| `POST` | `/forms` | ✓ | Create a new form |
| `GET`  | `/forms` | ✓ | List all your forms |
| `PATCH`| `/forms/{formId}` | ✓ | Update form (theme, fields, visibility, etc.) |
| `POST` | `/forms/{formId}/clone` | ✓ | Clone a form as a new draft |
| `GET`  | `/public/forms` | — | Browse public published forms |
| `GET`  | `/public/forms/{slug}` | — | Get form by slug (for respondents) |
| `POST` | `/public/forms/{slug}/submit` | — | Submit a form response |
| `GET`  | `/forms/{formId}/analytics` | ✓ | Get response analytics |
| `GET`  | `/forms/{formId}/submissions` | ✓ | List paginated submissions |

## Tech Stack

- **Turborepo** — Monorepo orchestration
- **Next.js 16** — React frontend (App Router)
- **Express 5** — API server
- **tRPC v11** — Type-safe RPC
- **Drizzle ORM** — SQL query builder + migrations
- **Zod v4** — Schema validation
- **Scalar** — API documentation
- **Tailwind CSS v4** — Utility-first styling
- **Radix UI** — Headless UI components
- **Recharts** — Analytics charts
- **PostgreSQL** — Primary database

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/pricing` | Pricing plans |
| `/explore` | Browse public forms |
| `/login` | Creator sign in / sign up |
| `/dashboard` | Creator dashboard |
| `/builder/[id]` | Form builder |
| `/form/[slug]` | Public form view (respondent) |
| `/responses/[id]` | Submissions & analytics |

---
title: Workflows - Local Development
version: 1.0.0
scope: workflows
last_updated: 2026-05-22
owner: dev-platform-team
tags: [pnpm, setup, local-dev, commands]
chunk_id: workflow-local-dev
---

# Workflows - Local Development

## Covers
- Step-by-step startup procedures for local development
- Initial package dependencies installation via pnpm
- Running Next.js and Express servers simultaneously
- Executing database synchronization and migration tasks

## Excludes
- Continuous Integration pipeline configurations
- Production dockerizing and Kubernetes deployment architectures
- Advanced troubleshooting guides for circular dependencies

## Setup and Installations

### Standard Package Ingestion
To launch the project, you must first verify that Node.js v18+ and pnpm v9+ are installed on your host system. Once verified, run the installation script:
```bash
pnpm install
```
This command installs all required monorepo packages across all workspaces and links them into the global node_modules directory structure. Do not use npm or yarn to install dependencies.
<!-- chunk-end -->

### Environment Variables Matching
Create `.env` files in the monorepo root to configure database coordinates and secret variables.
- Copy the template environment files or define the following variables:
  - `DATABASE_URL`: PostgreSQL connection string (e.g. `postgresql://postgres:postgres@localhost:5432/streamyst`)
  - `PORT`: Target port for the backend server (defaults to 8000)
  - `NODE_ENV`: Runs either in `development` or `prod`
<!-- chunk-end -->

## Development Lifecycle

### Starting the Dev Servers
Once dependency installation is verified and `.env` has been set up, execute the following command in the project root directory:
```bash
pnpm dev
```
This invokes `dotenv-cli` to load your environment configurations and fires up Turborepo to run development servers:
- **web** Next.js App: Runs at [http://localhost:3000](http://localhost:3000)
- **api** Express Server: Runs at [http://localhost:8000](http://localhost:8000)
<!-- chunk-end -->

### Local Port Definitions
- **Express Server**: Express runs on port 8000. Access health checks at `http://localhost:8000/health` or `/api/health`.
- **OpenAPI Schema**: Auto-generated schema is located at `http://localhost:8000/openapi.json`.
- **Interactive Docs**: Rendered via Scalar UI at `http://localhost:8000/docs`.
- **Next.js Web**: Next.js client renders UI pages and forwards type-safe tRPC client queries to `http://localhost:8000/trpc`.
<!-- chunk-end -->

### Database Initialization Operations
To sync migrations and generate ORM mappings, run the database schema generation scripts:
```bash
# Generate the Drizzle sql migrations
pnpm db:generate

# Execute the migrations onto the active target PostgreSQL database
pnpm db:migrate
```
These scripts use Turborepo internally to target the `@repo/database` workspace and apply changes seamlessly.
<!-- chunk-end -->

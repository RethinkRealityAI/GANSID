<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## GANSID project rules

- Public site pages live under `src/app/(site)/` (it owns the site root layout). The Payload admin lives under `src/app/(payload)/`; don't edit its generated files.
- Website content is Payload CMS 3 (`src/payload.config.ts`). After changing collections: `npm run generate`, then `npx payload migrate:create <name>` and commit the migration.
- Staff sign in with Supabase Auth via `src/auth/supabase-strategy.ts`; never add Payload passwords.
- Content rule: true facts only, sourced from the old site scrape. No invented statistics.
- Read `docs/cms.md` before touching the CMS, auth or data model.

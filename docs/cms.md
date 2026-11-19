# CMS, admin and sign-in

Architecture decision (approved 19 Nov 2026): one Next.js app holds the public site, the member
portal (`/portal`, coming) and the staff admin (`/admin`). Website content is managed with
**Payload CMS 3**, embedded in this app. Forms, surveys and dashboards are our own code, ported
from the SCAGO portal's patterns. Everything runs on GANSID's Supabase project (shared with the
Congress app), with website content in its own `payload` schema.

## Layout

| Path | What |
|---|---|
| `src/app/(site)/` | Public site. **All site pages go here** (it holds the site's root layout). |
| `src/app/(payload)/` | Payload admin UI and REST API. Generated-style files; avoid editing. |
| `src/payload.config.ts` | CMS config: collections, globals, languages, database. |
| `src/collections/`, `src/globals/`, `src/blocks/` | Content types and page-building blocks. |
| `src/auth/supabase-strategy.ts` | Lets Payload trust the shared Supabase session. |
| `src/components/admin/` | Admin branding, staff sign-in, sign-out. |
| `src/components/cms/` | Renderers for CMS content on the site (rich text, blocks, live preview). |
| `src/migrations/` | Database migrations for the `payload` schema. |

A hand-built route (e.g. `/about`) always wins over the CMS catch-all `[...slug]`, so the CMS can
never shadow a designed page.

## Sign-in model

- Everyone has one GANSID account (Supabase Auth). Staff sign in at `/admin/login` with it;
  there is no separate admin password (`disableLocalStrategy`).
- Being in **Settings → Staff** is what grants admin access. A portal member who signs in is
  refused with a clear message.
- First run: emails in `ADMIN_BOOTSTRAP_EMAILS` become super admins on first sign-in.
- Roles: super admin, admin, editor (website content), forms manager.

## Content workflow

Drafts autosave; **Publish changes** makes them live and refreshes the cached page immediately.
Live preview (eye icon) shows the real page beside the editor at phone/tablet/desktop sizes.
Scheduled publishing and version history with restore are on for Pages and News.
Languages: English (default) and French; untranslated fields fall back to English.

## Commands

```bash
npm run dev                 # site + admin at http://localhost:3002 (/admin)
npm run generate            # regenerate admin import map + src/payload-types.ts after config changes
npx payload migrate:create <name>   # after changing collections (commit the files)
npm run migrate             # apply migrations (production deploys run this)
```

`PAYLOAD_DB_PUSH=true` (dev only) lets Payload alter tables automatically. Production uses migrations.

Local sign-in without touching the live Supabase project: see `scripts/local-auth/README.md`.

## Not done yet (tracked in the PR)

- Media storage on Supabase Storage (S3 adapter). Local disk is dev-only; Netlify's disk is not persistent.
- Email adapter (staff invites, form notifications).
- Content import from the WordPress scrape, People/Events/Congress/Galleries collections.
- Forms engine (proposal in `docs/forms-design.md`), member portal.

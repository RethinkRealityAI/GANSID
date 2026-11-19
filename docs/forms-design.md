# GANSID forms and surveys: technical companion

Companion to the clickable prototype ("GANSID Forms & Surveys" artifact). Status: proposal for Dapo's review, 19 Nov 2026. No production code yet.

## 1. Recommendation in one paragraph

Keep **form definitions in Payload** and keep **everything respondents send in a Supabase `portal` schema with RLS**. Staff already edit, version, translate and permission content in Payload, and a form is content: it has drafts, a publish button, English and French, and it is placed on pages as a block. Submissions are different. They arrive from the public internet, carry personal data, files and payments, must be scoped row by row to regional coordinators, and will later be read by members in the portal ("my application status"). RLS gives one enforcement point for all of those readers, including ones that never pass through Payload. Payload's access control can filter rows too, but only for requests that go through Payload; RLS also covers the member portal, payment webhooks and any future reporting tool.

Both live in the same Postgres database (Payload already uses schema `payload`; staff already sign in through Supabase via `src/auth/supabase-strategy.ts`), so this is two schemas, not two systems to host.

## 2. Data model

| Table | Lives in | Purpose | Key columns |
|---|---|---|---|
| `forms` | Payload collection (versions + drafts on, localized EN/FR) | The editable form | `title`, `slug`, `template`, `status` (draft/live/closed), `fields` (array of field blocks), `confirmation` (message or redirect), `notifications` (main inbox, routing, respondent copy, email subject and body), `payment`, `opensAt`/`closesAt`, `embedDomains[]` |
| `form_versions` | `portal` (written by a Payload `afterChange` hook on publish) | Immutable snapshot that submissions point at | `id`, `form_id`, `version` (int), `schema` (jsonb: fields, logic, options per locale), `schema_hash`, `published_by`, `published_at` |
| `submissions` | `portal` | One per response | `id`, `form_id`, `form_version_id`, `reference` (GANSID-MEM-2026-0148), `locale`, `answers` (jsonb keyed by stable field `key`), `region` (resolved at submit), `status` (new / in_review / done / held), `submitter_user_id` (nullable, for portal members), `source` (site page or partner domain), `payment_status`, `spam_reasons[]`, `created_at` |
| `submission_events` | `portal` | Append-only history and notes | `submission_id`, `kind` (submitted, routed, email_sent, email_failed, status_changed, note, payment), `actor` (staff user id or `system`), `body` (jsonb), `created_at` |
| `submission_files` | `portal` + private Storage bucket | Uploads | `submission_id`, `field_key`, `path`, `mime`, `bytes`, `scan_status` |
| `payments` | `portal` | PayPal / Flutterwave transactions | `submission_id`, `provider`, `provider_ref`, `amount_minor`, `currency`, `status`, `raw` (jsonb webhook) |
| `regions` + `country_regions` | Payload global "Regional networks" (synced to `portal` for RLS) | 8 networks and the country map | region `code`, `name`; `country_code` → `region_code` |
| `staff_regions` | `portal` (synced from a `regions[]` field on Payload `users`) | Which coordinator covers which region | `supabase_user_id`, `region_code` |
| Notification templates | Inside each form (localized fields), plus a Payload global for the shared email layout | Respondent confirmation and staff alert | `subject`, `body` with `{Field name}` merge tags |

Routing rules are per-form data, not a table: `{ enabled, sourceFieldKey, alwaysNotifyMain, mainRecipients[] }`. Coordinators come from `staff_regions`, so assigning someone to a region in one place both emails them and scopes what they can read.

**RLS sketch.** No anon insert or select policies at all: the public submit route uses the service role after its own checks. Staff read through a server route that forwards the staff member's Supabase JWT, so policies apply:
- forms managers and admins: all rows (`portal.is_forms_staff()`, SECURITY DEFINER, same pattern as the LMS `is_admin()`).
- coordinators: `region in (select region_code from portal.staff_regions where supabase_user_id = auth.uid())` on forms that have routing on.
- members: `submitter_user_id = auth.uid()`, read only.
- `submission_events` and `submission_files` inherit through `submission_id`. Updates to `status` go through an RPC that also writes the event, so history cannot be skipped.

**Hardened public API** (`POST /api/forms/:slug/submit`, also used by the embed): resolve the live `form_version`, re-run visibility and validation server-side with the same shared module the browser uses, honeypot plus minimum fill time (hold for review, never discard), per-IP and per-form rate limits, Turnstile only when the signals fire, file uploads via short-lived signed URLs with type and size checks, embed `Origin` checked against `embedDomains`, payment confirmed only from the provider webhook, never from the browser.

## 3. Port from SCAGO, and what to drop

**Port (logic is good, keep the tests):**
- `field-conditions.ts`: one visibility function shared by renderer and validator; a deleted controlling question shows the field instead of hiding it forever. Extend to "is not" / "doesn't include".
- `region-routing.ts`: pure functions, fallback to the main inbox so nothing is dropped, `alwaysNotifyMain`, `visibleToViewer`. Swap city → region for country → region.
- `spam-signals.ts`: honeypot and minimum fill time, held for review.
- `submission-metrics.ts` idea: derive dashboard metrics from field types, never from hard-coded field ids.
- `src/app/embed/[surveyId]`: chrome-less route with iframe auto-height, wrapped in a one-line `embed.js` for partners.
- Signature pad, PayPal component, the email notification log and the "send test email" / "test submission" buttons.

**Drop:** Ontario hospital, city, department and province pickers; YEP; patient case management (replaced by a three-state New / In review / Done plus notes); SIN fields; AI analysis and chat; matrix, Likert, pain scale, colour picker and calculated fields (formulas exposed raw field ids); the per-survey dashboard widget editor; PDF report generator (CSV first).

**What was clunky and is designed out:** a 2,900-line editor with settings buried in accordions inside cards; conditions and formulas typed against nanoid field ids; field ids leaking into exports so columns changed when a question was reworded (fixed with a stable `key`); a 3,500-line dashboard with hospital-specific metrics.

## 4. Field types

Basics: Short answer, Long answer, Multiple choice (one), Checkboxes (many, optional "Other, please specify"), Dropdown, Yes / No.
About the person: Name (first, last), Email, Phone (with country code), Country (feeds region routing), Address, Website.
More: Date, Number, File upload (types, max size, private storage), Signature (type or draw), Rating scale (1–5 or 1–10), Consent, Payment (amount, PayPal and/or Flutterwave, optional pay-later invoice).
Layout: Section (a step when pacing is one section at a time), Text block.

That is 21 types, which covers all 20 current Gravity Forms. CAPTCHA disappears as a field; it becomes a form-level protection.

## 5. Open questions for Dapo

1. **Storage split.** Payload for definitions plus Supabase `portal` for submissions (recommended), or everything in Payload with access-control `where` filters (simpler, but no RLS for the portal and webhooks)?
2. **Membership dues.** Real amounts and tiers per membership type, waiver process, and whether a membership application without payment should count as submitted (prototype assumes yes, with "pay later by invoice").
3. **Coordinators.** Only AFR and SEAR have named leads today. Should the other six regions fall back to the main inbox (prototype) or to a named staff member? Do coordinators edit status, or only read and add notes?
4. **Approval actions.** When a membership application is marked Done, should it create the member record in the portal and send a welcome email automatically, or stay a manual step for now?
5. **French.** Must every live form be fully translated before publishing, or is English fallback acceptable (prototype warns but allows)? Is Spanish or Portuguese next?
6. **Data retention.** How long to keep submissions and uploaded CVs and certificates, and who may export them.

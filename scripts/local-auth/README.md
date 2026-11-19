# Local Supabase Auth for development

The admin signs staff in with Supabase Auth. To develop without touching the live GANSID
Supabase project, run the real Supabase Auth server (GoTrue) locally against a local Postgres.

```bash
# 1. Postgres 16 on port 5433 with a database called "gansid"
createdb -h localhost -p 5433 -U postgres gansid
psql -h localhost -p 5433 -U postgres -d gansid -c "create schema if not exists auth; create role anon nologin; create role authenticated nologin; create role service_role nologin;"

# 2. Supabase Auth (needs Docker)
docker run -d --name gotrue --network host \
  -e GOTRUE_DB_DRIVER=postgres \
  -e "DATABASE_URL=postgres://postgres@localhost:5433/gansid?search_path=auth&sslmode=disable" \
  -e GOTRUE_SITE_URL=http://localhost:3002 -e API_EXTERNAL_URL=http://localhost:54321/auth/v1 \
  -e GOTRUE_JWT_SECRET=local-dev-secret-at-least-32-characters-long -e GOTRUE_JWT_EXP=3600 \
  -e GOTRUE_JWT_AUD=authenticated -e GOTRUE_API_HOST=127.0.0.1 -e PORT=9999 \
  -e GOTRUE_MAILER_AUTOCONFIRM=true -e GOTRUE_EXTERNAL_EMAIL_ENABLED=true \
  supabase/gotrue:v2.177.0

# 3. Expose it where supabase-js expects it (http://localhost:54321/auth/v1)
node scripts/local-auth/proxy.mjs
```

Then in `.env.local` set `NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321` and an anon key signed
with the same JWT secret (any HS256 JWT with `{"role":"anon"}`), plus
`DATABASE_URI=postgres://postgres@localhost:5433/gansid`, `PAYLOAD_DB_PUSH=true` and
`ADMIN_BOOTSTRAP_EMAILS=<your test email>`. Create a test account with
`curl -X POST localhost:54321/auth/v1/signup -H "apikey: <anon>" -d '{"email":"…","password":"…"}'`.

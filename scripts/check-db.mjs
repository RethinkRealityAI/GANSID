// Runs before every Netlify build. Checks the CMS settings and that the database can be reached,
// and explains any problem in plain words, so a failed deploy says what to fix instead of
// printing a long driver error. Never prints the database password.
import pg from 'pg';

const fail = (msg) => {
  console.error(`\n✖ CMS database check failed\n  ${msg.split('\n').join('\n  ')}\n`);
  process.exit(1);
};

for (const name of ['DATABASE_URI', 'PAYLOAD_SECRET', 'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']) {
  if (!process.env[name]) fail(`${name} is not set for this deploy context.\nNetlify → Project configuration → Environment variables: make sure it applies to "All deploy contexts".`);
}

let url;
try {
  url = new URL(process.env.DATABASE_URI);
} catch {
  fail('DATABASE_URI is not a valid address. If the database password contains characters such as @ # / ? or %,\nreset it in Supabase to letters and numbers only, or URL-encode it, then update the variable.');
}

const raw = process.env.DATABASE_URI;
if (url.hash || (raw.match(/@/g) ?? []).length > 1) {
  fail('The database password in DATABASE_URI contains characters such as @ # / ? or %, which break the address.\nReset the password in Supabase to letters and numbers only (or URL-encode it), then update the variable.');
}

const where = `${url.hostname}:${url.port || 5432} as ${decodeURIComponent(url.username)}`;
if (/^db\.[a-z0-9]+\.supabase\.co$/.test(url.hostname)) {
  fail(`DATABASE_URI uses Supabase's direct connection (${url.hostname}), which Netlify cannot reach (it is IPv6 only).\nUse the pooler address instead: Supabase → Connect → "Session pooler" (port 5432) or "Transaction pooler" (port 6543).`);
}
if (/pooler\.supabase\.com$/.test(url.hostname) && !decodeURIComponent(url.username).includes('.')) {
  fail(`The Supabase pooler expects the user name "postgres.<project-ref>", but DATABASE_URI uses "${decodeURIComponent(url.username)}".\nCopy the full string from Supabase → Connect → Session pooler.`);
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  connectionTimeoutMillis: 15000,
  ssl: url.hostname === 'localhost' || url.hostname === '127.0.0.1' ? undefined : { rejectUnauthorized: false },
});
try {
  await client.connect();
  await client.query('select 1');
  console.log(`✔ CMS database reachable (${where})`);
} catch (err) {
  const code = err?.code ?? '';
  const hint =
    code === '28P01' || /password authentication/i.test(err?.message)
      ? 'The password in DATABASE_URI is wrong (or was reset). Copy it again from Supabase.'
      : code === 'ENOTFOUND'
        ? 'The database host name does not exist. Check the host part of DATABASE_URI.'
        : code === 'ENETUNREACH' || code === 'EHOSTUNREACH'
          ? 'The database host cannot be reached from Netlify. Use the Supabase pooler address.'
          : code === 'ETIMEDOUT' || /timeout/i.test(err?.message)
            ? 'The database did not answer in time. Check the host and port, and that the Supabase project is not paused.'
            : 'See the error below.';
  fail(`Could not connect to ${where}.\n${hint}\n(${code || 'error'}: ${err?.message})`);
} finally {
  await client.end().catch(() => {});
}

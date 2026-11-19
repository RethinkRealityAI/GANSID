import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env';

/**
 * Read-only Supabase client built from a request's Cookie header.
 * Used inside Payload's auth strategy, where we get raw headers rather than next/headers.
 * Token refresh is handled by src/proxy.ts, so this client never needs to write cookies.
 */
export const createSupabaseFromHeaders = (headers: Headers) =>
  createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () =>
        parseCookieHeader(headers.get('cookie') ?? '').map((c) => ({ name: c.name, value: c.value ?? '' })),
      setAll: () => {},
    },
  });

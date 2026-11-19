import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from '@/lib/supabase/env';

/**
 * Keeps the shared GANSID (Supabase) session fresh on signed-in areas.
 * Public pages are skipped entirely so they stay fully cacheable.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!supabaseConfigured) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  // Refreshes the access token if it has expired. Do not remove.
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*', '/api/:path*', '/preview/:path*', '/auth/:path*'],
};

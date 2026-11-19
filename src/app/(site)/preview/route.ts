import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';

/** Turn on draft mode for signed-in staff only, then open the page being edited. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get('path') ?? '/';
  // Only same-site paths: never redirect to another host.
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return new Response('Invalid path', { status: 400 });
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) return new Response('Sign in to preview drafts', { status: 401 });

  (await draftMode()).enable();
  redirect(path);
}

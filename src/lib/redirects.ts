import 'server-only';
import { unstable_cache } from 'next/cache';
import { permanentRedirect, redirect } from 'next/navigation';
import { REDIRECTS_CACHE_TAG } from '@/collections/Redirects';
import { normalizePath } from '@/lib/paths';
import { cms } from '@/lib/cms';

type Entry = { to: string; type: '301' | '302' };

/**
 * The whole redirect table, loaded once and cached (a few hundred rows). Editing a redirect
 * clears the cache tag, so changes apply on the next request.
 */
const loadRedirects = unstable_cache(
  async (): Promise<[string, Entry][]> => {
    const payload = await cms();
    const res = await payload.find({
      collection: 'redirects',
      pagination: false,
      depth: 0,
      select: { from: true, to: true, type: true },
    });
    return res.docs.map((d) => [d.from, { to: d.to, type: d.type }]);
  },
  ['cms-redirects'],
  { tags: [REDIRECTS_CACHE_TAG], revalidate: 3600 },
);

export async function findRedirect(path: string): Promise<Entry | null> {
  const key = normalizePath(path);
  const table = new Map(await loadRedirects());
  return table.get(key) ?? null;
}

/**
 * Call where a page would otherwise 404. Next.js sends 308 for permanent and 307 for
 * temporary redirects; search engines treat these exactly like 301 and 302.
 */
export async function redirectIfMoved(path: string) {
  const hit = await findRedirect(path);
  if (!hit || normalizePath(hit.to) === normalizePath(path)) return;
  if (hit.type === '302') redirect(hit.to);
  permanentRedirect(hit.to);
}

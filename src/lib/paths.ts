/**
 * Where each kind of content lives on the public site. One place, so the CMS revalidation
 * hooks, the redirect import and (later) the page routes all agree on the same addresses.
 */
export const SECTION_PATHS = {
  news: '/news',
  events: '/events',
  galleries: '/galleries',
  people: '/people',
  'congress-editions': '/congress',
  resources: '/resources',
  'member-organizations': '/members',
} as const;

export type SectionCollection = keyof typeof SECTION_PATHS;

export const sitePath = (collection: SectionCollection, slug?: string | number | null) =>
  slug === undefined || slug === null || slug === '' ? SECTION_PATHS[collection] : `${SECTION_PATHS[collection]}/${slug}`;

/**
 * Normalises a site-relative address for redirect matching: drops the host of an old
 * WordPress URL, the query string and the trailing slash, and lowercases it.
 * `https://inheritedblooddisorders.world/About-Us/?x=1` → `/about-us`.
 */
export const normalizePath = (input: string) => {
  let p = input.trim();
  try {
    if (/^https?:\/\//i.test(p)) p = new URL(p).pathname;
  } catch {
    // Not a URL; treat as a path.
  }
  p = p.split(/[?#]/)[0] ?? '';
  try {
    p = decodeURI(p);
  } catch {}
  if (!p.startsWith('/')) p = `/${p}`;
  p = p.replace(/\/{2,}/g, '/');
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return p.toLowerCase();
};

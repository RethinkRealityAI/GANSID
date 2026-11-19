import type { Media } from '@/payload-types';

/** Picks the best stored size for an upload field that may be an id or a populated doc. */
export function mediaSrc(m: number | string | Media | null | undefined, size: 'thumb' | 'card' | 'wide' = 'card') {
  if (!m || typeof m !== 'object') return null;
  return { src: m.sizes?.[size]?.url ?? m.url ?? '', alt: m.alt ?? '' };
}

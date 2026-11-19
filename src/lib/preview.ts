/** Where the live-preview pane and "Preview" button point for each collection. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3002';

export const pathForDoc = (collection: 'pages' | 'news', slug?: string) =>
  collection === 'news' ? `/news/${slug ?? ''}` : `/${slug ?? ''}`;

/**
 * /preview checks that the visitor is signed-in staff before turning on Next.js draft mode,
 * so no shared secret is needed in the URL.
 */
export const previewUrl = (collection: 'pages' | 'news', slug?: string) => {
  if (!slug) return null;
  return `${SITE_URL}/preview?path=${encodeURIComponent(pathForDoc(collection, slug))}`;
};

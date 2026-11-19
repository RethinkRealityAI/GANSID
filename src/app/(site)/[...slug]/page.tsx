import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug, isPreview } from '@/lib/cms';
import { Blocks } from '@/components/cms/blocks';
import { LiveRefresh } from '@/components/cms/live-refresh';
import { redirectIfMoved } from '@/lib/redirects';

/**
 * Any page an editor creates in the CMS. Hand-designed routes (/, /about, /disorders…)
 * always win over this catch-all, so the CMS can never shadow them. When no page exists,
 * the Redirects table is checked before showing "not found".
 */
export const revalidate = 3600;

type Props = { params: Promise<{ slug: string[] }> };

const toSlug = (parts: string[]) => parts.join('/');

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = await getPageBySlug(toSlug((await params).slug));
  if (!doc) return {};
  return { title: doc.seo?.title || doc.title, description: doc.seo?.description || undefined };
}

export default async function CmsPage({ params }: Props) {
  const slug = toSlug((await params).slug);
  const [doc, preview] = await Promise.all([getPageBySlug(slug), isPreview()]);
  if (!doc) {
    // Old WordPress addresses (and any moved page) land here: send them to their new home.
    await redirectIfMoved(`/${slug}`);
    notFound();
  }
  return (
    <>
      {preview && <LiveRefresh />}
      <Blocks blocks={doc.layout} />
    </>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug, isPreview } from '@/lib/cms';
import { Blocks } from '@/components/cms/blocks';
import { LiveRefresh } from '@/components/cms/live-refresh';

/**
 * Any page an editor creates in the CMS. Hand-designed routes (/, /about, /disorders…)
 * always win over this catch-all, so the CMS can never shadow them.
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
  if (!doc) notFound();
  return (
    <>
      {preview && <LiveRefresh />}
      <Blocks blocks={doc.layout} />
    </>
  );
}

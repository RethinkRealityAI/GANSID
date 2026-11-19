import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNewsBySlug, isPreview } from '@/lib/cms';
import { RichText } from '@/components/cms/rich-text';
import { LiveRefresh } from '@/components/cms/live-refresh';
import { mediaSrc } from '@/components/cms/media';

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = await getNewsBySlug((await params).slug);
  if (!doc) return {};
  return { title: doc.seo?.title || doc.title, description: doc.seo?.description || doc.excerpt || undefined };
}

export default async function NewsStory({ params }: Props) {
  const { slug } = await params;
  const [doc, preview] = await Promise.all([getNewsBySlug(slug), isPreview()]);
  if (!doc) notFound();
  const img = mediaSrc(doc.cover, 'wide');
  return (
    <article className="pt-[calc(var(--header-h)+3rem)] pb-24">
      {preview && <LiveRefresh />}
      <div className="container-x max-w-3xl">
        <Link href="/news/" className="text-sm text-ink-soft hover:text-ink">← All news</Link>
        <p className="mt-6 text-sm text-ink-soft">
          {doc.publishedAt && new Date(doc.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h1 className="display mt-3 text-4xl md:text-5xl">{doc.title}</h1>
        {doc.excerpt && <p className="mt-6 text-lg text-ink-soft">{doc.excerpt}</p>}
      </div>
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img.src} alt={img.alt} className="container-x mt-10 aspect-[16/9] w-full max-w-5xl rounded-[2rem] object-cover" />
      )}
      <div className="container-x mt-10 max-w-3xl">
        <RichText data={doc.body} />
      </div>
    </article>
  );
}

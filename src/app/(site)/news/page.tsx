import type { Metadata } from 'next';
import Link from 'next/link';
import { getNewsList, isPreview } from '@/lib/cms';
import { mediaSrc } from '@/components/cms/media';
import { NEWS_CATEGORIES } from '@/collections/News';

export const metadata: Metadata = { title: 'News', description: 'News, press releases and updates from GANSID.' };
export const revalidate = 3600;

const categoryLabel = (v?: string | null) => NEWS_CATEGORIES.find((c) => c.value === v)?.label ?? 'News';
const fmt = (d?: string | null) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

export default async function NewsIndex() {
  const [items, preview] = await Promise.all([getNewsList(), isPreview()]);
  return (
    <section className="bg-mist pt-[calc(var(--header-h)+3rem)] pb-24">
      <div className="container-x">
        <p className="eyebrow text-teal">News</p>
        <h1 className="display mt-4 text-5xl md:text-6xl">Latest from GANSID</h1>
        {preview && <p className="mt-4 text-sm font-semibold text-red">Preview: drafts are shown.</p>}
        {items.length === 0 ? (
          <p className="mt-12 text-ink-soft">No stories yet.</p>
        ) : (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((n) => {
              const img = mediaSrc(n.cover, 'card');
              return (
                <li key={n.id}>
                  <Link href={`/news/${n.slug}/`} className="group block h-full overflow-hidden rounded-[1.5rem] bg-white shadow-sm transition hover:-translate-y-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {img && <img src={img.src} alt={img.alt} className="aspect-[16/10] w-full object-cover" />}
                    <div className="p-6">
                      <p className="text-sm text-ink-soft">{categoryLabel(n.category)} · {fmt(n.publishedAt)}</p>
                      <h2 className="mt-2 text-xl font-bold group-hover:text-red">{n.title}</h2>
                      {n.excerpt && <p className="mt-3 text-ink-soft">{n.excerpt}</p>}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

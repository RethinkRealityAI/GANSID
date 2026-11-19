import Link from 'next/link';
import type { ServerProps } from 'payload';

/**
 * Friendly start screen above the standard dashboard: the few things editors do most,
 * plus what they were last working on. Plain language, no jargon.
 */
export async function Welcome({ payload, user }: ServerProps) {
  const firstName = (user as { name?: string } | null)?.name?.split(' ')[0];
  const [news, pages] = await Promise.all([
    payload.find({ collection: 'news', draft: true, limit: 4, sort: '-updatedAt', depth: 0, select: { title: true, _status: true, updatedAt: true } }),
    payload.find({ collection: 'pages', draft: true, limit: 4, sort: '-updatedAt', depth: 0, select: { title: true, _status: true, updatedAt: true } }),
  ]);
  const recent = [
    ...news.docs.map((d) => ({ ...d, href: `/admin/collections/news/${d.id}`, kind: 'News story' })),
    ...pages.docs.map((d) => ({ ...d, href: `/admin/collections/pages/${d.id}`, kind: 'Page' })),
  ]
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
    .slice(0, 5);

  const actions = [
    { label: 'Write a news story', href: '/admin/collections/news/create', hint: 'Updates, press releases, awareness days' },
    { label: 'Create a page', href: '/admin/collections/pages/create', hint: 'Build from ready-made sections' },
    { label: 'Upload photos or files', href: '/admin/collections/media/create', hint: 'Add to the media library' },
    { label: 'Edit the announcement bar', href: '/admin/globals/announcement', hint: 'One line across every page' },
  ];

  return (
    <section style={{ marginBottom: 40 }}>
      <h1 style={{ fontSize: 28, margin: '0 0 4px' }}>{firstName ? `Welcome back, ${firstName}` : 'Welcome'}</h1>
      <p style={{ margin: '0 0 20px', opacity: 0.7 }}>What would you like to do?</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {actions.map((a) => (
          <Link key={a.href} href={a.href} style={card}>
            <strong style={{ fontSize: 16 }}>{a.label} →</strong>
            <span style={{ opacity: 0.7, fontSize: 14 }}>{a.hint}</span>
          </Link>
        ))}
      </div>
      {recent.length > 0 && (
        <>
          <h2 style={{ fontSize: 18, margin: '32px 0 10px' }}>Pick up where you left off</h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
            {recent.map((r) => (
              <li key={`${r.kind}-${r.id}`}>
                <Link href={r.href} style={row}>
                  <span>{r.title || 'Untitled'}</span>
                  <span style={{ opacity: 0.65, fontSize: 13 }}>
                    {r.kind} · {r._status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

const card: React.CSSProperties = {
  display: 'grid', gap: 6, padding: '18px 20px', borderRadius: 14, textDecoration: 'none', color: 'inherit',
  background: 'var(--theme-elevation-0)', border: '1px solid var(--theme-elevation-150)', borderLeft: '4px solid #d7262e',
};
const row: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 14px', borderRadius: 10,
  textDecoration: 'none', color: 'inherit', border: '1px solid var(--theme-elevation-100)',
};

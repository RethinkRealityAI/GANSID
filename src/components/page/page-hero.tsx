import Link from 'next/link';
import type { ReactNode } from 'react';
import { SplitText } from '../motion/split-text';
import { LogoMark } from '../ui/logo-mark';

/**
 * Light inner-page hero: copy on the left, a large photo on the right with the
 * smoked liquid-glass place card from the homepage globe.
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  accentLine,
  lede,
  photo,
  photoAlt,
  card,
  children,
}: {
  crumbs: { label: string; href?: string }[];
  eyebrow: string;
  title: string[];
  /** Index of the title line drawn in red. */
  accentLine?: number;
  lede: string;
  photo: string;
  photoAlt: string;
  card?: { tag: string; name: string; note?: string };
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-mist pt-[calc(var(--header-h)+3rem)] pb-16 md:pb-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(40%_50%_at_85%_20%,rgb(0_137_182/0.14),transparent),radial-gradient(35%_45%_at_10%_90%,rgb(224_106_80/0.16),transparent)]"
      />
      <LogoMark className="pointer-events-none absolute -top-24 -left-24 -z-10 size-[28rem] opacity-[0.05]" />
      <div className="container-x grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
          <nav aria-label="Breadcrumb" className="fade-up">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {c.href ? (
                    <Link href={c.href} className="hover:text-ink">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-semibold text-ink">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <p className="eyebrow mt-8 text-teal">{eyebrow}</p>
          <SplitText
            as="h1"
            className="display-lg mt-4"
            lines={title.map((t, i) => ({ text: t, className: i === accentLine ? 'text-red' : undefined }))}
          />
          <p className="lede fade-up mt-6 max-w-xl text-ink-soft">{lede}</p>
          {children && <div className="fade-up mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgb(26_60_110/0.55)] lg:aspect-[5/4]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={photoAlt} className="absolute inset-0 size-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
          </div>
          {card && (
            <div className="glass-dark absolute -bottom-6 left-4 bg-ink/55 w-[min(20rem,85%)] rounded-3xl p-5 text-white sm:left-8">
              <p className="text-xs font-bold tracking-[0.14em] text-coral uppercase">{card.tag}</p>
              <p className="heading-lg mt-1">{card.name}</p>
              {card.note && <p className="mt-1 text-sm text-white/75">{card.note}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Small numbered section heading shared by inner pages. */
export function SectionHead({ eyebrow, title, intro, tone = 'red', light = false }: { eyebrow: string; title: string; intro?: string; tone?: 'red' | 'teal' | 'coral'; light?: boolean }) {
  const t = tone === 'teal' ? 'text-teal' : tone === 'coral' ? 'text-coral' : 'text-red';
  return (
    <div className="max-w-3xl">
      <p className={`eyebrow ${t}`}>{eyebrow}</p>
      <h2 className="display-md mt-3">{title}</h2>
      {intro && <p className={`lede mt-5 ${light ? 'text-white/75' : 'text-ink-soft'}`}>{intro}</p>}
    </div>
  );
}

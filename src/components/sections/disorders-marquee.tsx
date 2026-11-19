import Link from 'next/link';
import { disorders } from '@/content/site';
import { Drop } from '../ui/icons';

/** Running band naming every condition GANSID serves. Pauses on hover. */
export function DisordersMarquee() {
  const row = [...disorders, ...disorders];
  return (
    <section aria-label="Inherited blood disorders we serve" className="marquee overflow-hidden border-y border-ink/10 bg-ink py-5 text-white">
      <ul className="marquee-track flex w-max items-center">
        {row.map((d, i) => (
          <li key={`${d.href}-${i}`} aria-hidden={i >= disorders.length || undefined} className="flex items-center">
            <Link
              href={d.href}
              tabIndex={i >= disorders.length ? -1 : undefined}
              className="font-display px-8 text-3xl font-semibold tracking-wide uppercase transition-colors hover:text-coral md:text-4xl"
            >
              {d.name}
            </Link>
            <Drop className="size-4 text-red" />
          </li>
        ))}
      </ul>
    </section>
  );
}

import { highlights, LMS_URL } from '@/content/site';
import { SplitText } from '../motion/split-text';
import { ArrowUpRight } from '../ui/icons';

const look: Record<string, { bg: string; img?: string }> = {
  red: { bg: 'bg-ink', img: '/photos/d1-gansid2026.webp' },
  navy: { bg: 'bg-navy', img: '/photos/pf-women-backdrop.webp' },
  teal: { bg: 'bg-teal' },
  coral: { bg: 'bg-coral', img: '/courses/advocacy.webp' },
};

/** "Right now at GANSID": bento of real, current work. */
export function NowBento() {
  const [a, b, c, d] = highlights;
  return (
    <section aria-labelledby="now-h" className="bg-mist py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitText as="h2" lines={[{ text: 'Right now' }, { text: 'at GANSID', className: 'text-red' }]} className="display-lg" />
          <p className="max-w-md text-ink-soft">What the network is working on this season, from Hyderabad to the Learning Hub.</p>
        </div>
        <span id="now-h" className="sr-only">Right now at GANSID</span>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[21rem_21rem]">
          <Tile item={a} className="md:col-span-2 lg:col-span-6 lg:row-span-2" big />
          <Tile item={b} className="md:col-span-2 lg:col-span-6" />
          <Tile item={c} className="lg:col-span-3" small />
          <Tile item={d} className="lg:col-span-3" small />
        </div>
      </div>
    </section>
  );
}

function Tile({ item, className = '', big = false, small = false }: { item: (typeof highlights)[number]; className?: string; big?: boolean; small?: boolean }) {
  const l = look[item.tone];
  const ext = item.href === LMS_URL;
  return (
    <a
      href={item.href}
      {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`group reveal sheen relative isolate flex min-h-[20rem] flex-col justify-end overflow-hidden rounded-[var(--radius-panel)] p-6 text-white md:p-8 ${l.bg} ${className}`}
    >
      {l.img && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l.img} alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
          <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/95 via-ink/55 to-ink/10" />
        </>
      )}
      <span className="glass-dark absolute top-5 left-5 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide">{item.tag}</span>
      <span className="glass-dark absolute top-5 right-5 grid size-11 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45">
        <ArrowUpRight className="size-5" />
      </span>
      <h3 className={`${big ? 'heading-xl max-w-[16ch]' : small ? 'text-xl leading-tight font-semibold tracking-tight' : 'heading-lg'} mt-16`}>{item.title}</h3>
      {big ? <p className={`mt-3 max-w-lg text-white/80 ${big ? '' : 'line-clamp-3 text-[0.95rem]'}`}>{item.body}</p> : null}
      <span className="mt-5 text-sm font-bold underline decoration-white/40 underline-offset-4 group-hover:decoration-white">{item.cta}</span>
    </a>
  );
}

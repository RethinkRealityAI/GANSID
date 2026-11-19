import { involve } from '@/content/site';
import { SplitText } from '../motion/split-text';
import { ArrowUpRight } from '../ui/icons';

const IMG: Record<string, string> = { red: 'pf-women-backdrop', navy: 'd1-booth', coral: 'pf-audience' };

export function GetInvolved() {
  return (
    <section aria-labelledby="gi-h" className="bg-paper py-24 md:py-32">
      <div className="container-x">
        <SplitText as="h2" lines={[{ text: 'Join the' }, { text: 'network', className: 'text-red' }]} className="display-lg" />
        <span id="gi-h" className="sr-only">Get involved</span>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {involve.map((x, i) => (
            <li key={x.title} className="reveal" style={{ animationDelay: `${i * 90}ms` }}>
              <a href={x.href} className="group sheen relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[var(--radius-panel)] p-7 text-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/photos/${IMG[x.tone]}.webp`} alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-110" />
                <span className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
                <span className="glass-dark absolute top-6 right-6 grid size-12 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </span>
                <h3 className="font-display text-5xl leading-[0.9] font-bold uppercase">{x.title}</h3>
                <p className="mt-3 text-white/80">{x.body}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

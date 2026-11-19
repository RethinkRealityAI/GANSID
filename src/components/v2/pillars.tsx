'use client';

import { useEffect, useRef, useState } from 'react';
import { pillars, type Pillar } from '@/content/site';
import { useVariant } from '@/lib/variants';
import { SplitText } from '../motion/split-text';
import { Button } from '../ui/button';

const PHOTO: Record<Pillar['id'], string> = {
  advocacy: '/photos/d2-speakers.webp',
  capacity: '/photos/roundtable-freetown.webp',
  education: '/photos/pf-question.webp',
  research: '/photos/d2-stage.webp',
};
const BG: Record<Pillar['id'], string> = {
  advocacy: 'bg-red',
  capacity: 'bg-[#c2452f]',
  education: 'bg-navy',
  research: 'bg-teal',
};

export function Pillars() {
  const v = useVariant('pillars');
  return (
    <section id="work" aria-labelledby="work-h" className="scroll-mt-24 bg-paper pt-24 pb-24 md:pt-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-red">What we do</p>
            <SplitText as="h2" lines={[{ text: 'Four ways' }, { text: 'we move care forward', className: 'text-red' }]} className="display-lg mt-4" />
          </div>
          <p className="max-w-md text-ink-soft">
            Every program sits under one of four pillars, and each serves health care providers, patient organizations, or both.
          </p>
        </div>
        <span id="work-h" className="sr-only">What we do</span>
        {v === 'tabs' ? <Tabs /> : <Stack />}
      </div>
    </section>
  );
}

/** Full-width cards that pin and stack as you scroll; earlier cards recede. */
function Stack() {
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const els = refs.current;
      els.forEach((el, i) => {
        const next = els[i + 1];
        const inner = el?.firstElementChild as HTMLElement | null;
        if (!el || !inner) return;
        if (!next) return void (inner.style.transform = '');
        const a = el.getBoundingClientRect();
        const b = next.getBoundingClientRect();
        const k = Math.min(1, Math.max(0, 1 - (b.top - a.top) / a.height));
        inner.style.transform = `scale(${1 - k * 0.06})`;
        inner.style.filter = `brightness(${1 - k * 0.35})`;
      });
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => {
      removeEventListener('scroll', on);
      removeEventListener('resize', on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <ol className="mt-14 grid gap-6">
      {pillars.map((p, i) => (
        <li
          key={p.id}
          ref={(n) => {
            refs.current[i] = n;
          }}
          className="lg:sticky"
          style={{ top: `calc(var(--header-h) + 1.5rem + ${i * 1.25}rem)` }}
        >
          <article className={`grain relative grid origin-top overflow-hidden rounded-[var(--radius-panel)] text-white will-change-transform lg:min-h-[min(36rem,72svh)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] ${BG[p.id]}`}>
            <div className="relative flex flex-col p-7 md:p-12">
              <div className="flex items-center gap-4">
                <span className="font-display text-7xl leading-none font-bold text-white/25 md:text-8xl">0{i + 1}</span>
                <span className="glass-dark rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide">Pillar {i + 1} of 4</span>
              </div>
              <h3 className="display-lg mt-6">{p.name}</h3>
              <p className="lede mt-4 text-white/85">{p.summary}</p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {p.items.map((it) => (
                  <li key={it.label} className="glass-dark rounded-full px-4 py-2 text-sm font-semibold">
                    {it.label}
                    {it.audience && <span className="ml-2 text-white/60">· {it.audience}</span>}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-10">
                <Button href={p.href} variant="light">
                  Explore {p.name.toLowerCase()}
                </Button>
              </div>
            </div>
            <div className="relative min-h-64 lg:m-4 lg:ml-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PHOTO[p.id]} alt="" loading="lazy" className="absolute inset-0 size-full object-cover lg:rounded-[calc(var(--radius-panel)-0.75rem)]" />
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}

/** Pick a pillar; the glass panel takes on its colour. */
function Tabs() {
  const [a, setA] = useState(0);
  const p = pillars[a];
  return (
    <div className="mt-14 grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <div role="tablist" aria-label="Pillars" className="glass flex gap-2 overflow-x-auto rounded-[var(--radius-card)] p-2 lg:flex-col">
        {pillars.map((x, i) => (
          <button
            key={x.id}
            role="tab"
            id={`tab-${x.id}`}
            aria-selected={a === i}
            aria-controls="pillar-panel"
            onClick={() => setA(i)}
            className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3.5 text-left font-semibold transition-colors ${a === i ? `${BG[x.id]} text-white` : 'hover:bg-ink/5'}`}
          >
            <span className="font-display text-2xl opacity-60">0{i + 1}</span>
            {x.name}
          </button>
        ))}
      </div>
      <div
        id="pillar-panel"
        role="tabpanel"
        aria-labelledby={`tab-${p.id}`}
        className={`relative isolate grid min-h-[30rem] overflow-hidden rounded-[var(--radius-panel)] p-7 text-white transition-colors duration-700 md:p-12 ${BG[p.id]}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={p.id} src={PHOTO[p.id]} alt="" className="fade-up absolute inset-y-0 right-0 -z-10 h-full w-3/5 object-cover opacity-50 [mask-image:linear-gradient(90deg,transparent,black_60%)] max-md:w-full max-md:opacity-25" />
        <div key={`c-${p.id}`} className="fade-up max-w-xl">
          <h3 className="display-lg">{p.name}</h3>
          <p className="lede mt-4 text-white/85">{p.summary}</p>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {p.items.map((it) => (
              <li key={it.label} className="glass-dark rounded-2xl px-4 py-3 text-sm font-semibold">
                {it.label}
                {it.audience && <span className="block text-xs font-medium text-white/60">{it.audience}</span>}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href={p.href} variant="light">
              Explore {p.name.toLowerCase()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

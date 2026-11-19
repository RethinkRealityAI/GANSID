'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { pillars, type Pillar } from '@/content/site';
import { Eyebrow } from '../ui/eyebrow';
import { ArtFrame, type Tone } from '../ui/art-frame';
import { ArrowRight } from '../ui/icons';

const tone: Record<Pillar['id'], Tone> = {
  advocacy: 'red',
  capacity: 'coral',
  education: 'navy',
  research: 'teal',
};

/** The four programme pillars as tabs; each pillar keeps its colour site-wide. */
export function Pillars() {
  const [active, setActive] = useState<Pillar['id']>('advocacy');
  const uid = useId();
  const current = pillars.find((p) => p.id === active)!;
  const audiences = [...new Set(current.items.map((i) => i.audience).filter(Boolean))] as string[];

  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="container-x">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>What we do</Eyebrow>
            <h2 className="display-lg mt-5">
              Four pillars,
              <span className="block text-red">one network</span>
            </h2>
          </div>
          <p className="max-w-md text-ink-soft">
            Disease-specific and cross-disease work, built with the people closest to these conditions.
          </p>
        </div>

        <div className="reveal mt-12 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
          <div role="tablist" aria-label="Program pillars" aria-orientation="vertical" className="flex flex-col gap-2">
            {pillars.map((p, i) => {
              const on = p.id === active;
              return (
                <button
                  key={p.id}
                  role="tab"
                  id={`${uid}-tab-${p.id}`}
                  aria-selected={on}
                  aria-controls={`${uid}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(p.id)}
                  onKeyDown={(e) => {
                    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
                    e.preventDefault();
                    const next = pillars[(i + (e.key === 'ArrowDown' ? 1 : pillars.length - 1)) % pillars.length];
                    setActive(next.id);
                    document.getElementById(`${uid}-tab-${next.id}`)?.focus();
                  }}
                  className={`group flex items-center justify-between gap-4 rounded-[var(--radius-card)] px-6 py-5 text-left transition-all duration-500 ease-[var(--ease-out-expo)] ${
                    on ? 'bg-white shadow-[0_20px_50px_-30px_rgb(27_20_22/0.45)]' : 'hover:bg-white/60'
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span
                      className="size-3 rounded-full transition-transform duration-500"
                      style={{ background: `var(--pillar-${p.id})`, transform: on ? 'scale(1.4)' : undefined }}
                    />
                    <span className={`heading-lg transition-colors ${on ? 'text-ink' : 'text-ink/55 group-hover:text-ink'}`}>{p.name}</span>
                  </span>
                  <ArrowRight className={`size-5 shrink-0 transition-all duration-500 ${on ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                </button>
              );
            })}
          </div>

          <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`}>
            <ArtFrame
              key={active}
              tone={tone[active]}
              className="flex min-h-[28rem] flex-col justify-between rounded-[var(--radius-panel)] p-7 text-white sm:p-10"
              markClass="-right-[18%] -top-[28%] w-[62%]"
            >
              <div className="max-w-xl">
                <p className="eyebrow text-white/75">Pillar</p>
                <h3 className="display-lg mt-3">{current.name}</h3>
                <p className="mt-4 text-lg leading-relaxed text-white/90">{current.summary}</p>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {(audiences.length ? audiences : ['Programs']).map((aud) => (
                  <div key={aud}>
                    <p className="eyebrow mb-3 text-white/70">{aud === 'Programs' ? 'Programs' : `For ${aud.toLowerCase()}`}</p>
                    <ul className="divide-y divide-white/20 border-y border-white/20">
                      {current.items
                        .filter((it) => (aud === 'Programs' ? !it.audience : it.audience === aud))
                        .map((it) => (
                          <li key={it.label} className="py-2.5 font-medium">
                            {it.label}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>

              <Link
                href={current.href}
                className="mt-10 inline-flex h-12 w-fit items-center gap-3 rounded-full bg-white pr-2 pl-5 font-semibold text-ink transition hover:bg-blush"
              >
                Explore {current.name.toLowerCase()}
                <span className="grid size-8 place-items-center rounded-full bg-ink text-white">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </ArtFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

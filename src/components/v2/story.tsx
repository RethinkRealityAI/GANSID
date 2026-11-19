'use client';

import { useEffect, useRef, useState } from 'react';
import { founders, timeline } from '@/content/site';
import { useVariant } from '@/lib/variants';
import { useReducedMotion, useScrollProgress } from '@/lib/hooks';
import { LogoMark } from '../ui/logo-mark';

const NAME = (i: number) => (i === 0 ? 'SCDIMA' : i === 1 ? 'IBDIN' : 'GANSID');
const PHOTO: (string | null)[] = [null, null, null, null, null, '/photos/d1-gansid2026.webp'];
/** Each milestone takes a GANSID colour once reached; the corner mark takes its complement. */
const TONE = [
  { bg: '#1a3c6e', mark: '#e06a50', year: '#f4a28c' },
  { bg: '#0089b6', mark: '#1a3c6e', year: '#ffffff' },
  { bg: '#c9502f', mark: '#1a3c6e', year: '#ffffff' },
  { bg: '#10284c', mark: '#0089b6', year: '#e06a50' },
  { bg: '#d7262e', mark: '#e06a50', year: '#ffffff' },
  { bg: '#1a3c6e', mark: '#d7262e', year: '#e06a50' },
];

/** Flowing lines echoing the arcs of the logo. */
function Squiggles({ color, className = '' }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 600 300" preserveAspectRatio="none" aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      {[0, 1, 2, 3].map((k) => (
        <path
          key={k}
          d={`M-20 ${200 + k * 22} C 120 ${80 + k * 30}, 260 ${300 - k * 10}, 380 ${150 + k * 18} S 560 ${60 + k * 26}, 640 ${120 + k * 20}`}
          fill="none"
          stroke={color}
          strokeWidth={k === 0 ? 3 : 1.5}
          strokeOpacity={0.55 - k * 0.1}
        />
      ))}
    </svg>
  );
}

export function Story() {
  const v = useVariant('story');
  return v === 'orbit' ? <Orbit /> : <Horizontal />;
}

function Founders({ light = false }: { light?: boolean }) {
  return (
    <p className={`max-w-xl text-sm ${light ? 'text-white/70' : 'text-ink-soft'}`}>
      Envisioned and established by {founders[0]}, with co-founders {founders.slice(1).join(', ')}.
    </p>
  );
}

/** Pinned: vertical scroll drives a horizontal journey. The name morphs as the network grows. */
function Horizontal() {
  const [ref, p] = useScrollProgress<HTMLElement>();
  const track = useRef<HTMLOListElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const m = () => setW(Math.max(0, (track.current?.scrollWidth ?? 0) - innerWidth));
    m();
    addEventListener('resize', m);
    return () => removeEventListener('resize', m);
  }, []);
  const n = timeline.length;
  const idx = Math.min(n - 1, Math.floor(p * n * 0.999));
  return (
    <section id="story" ref={ref} aria-labelledby="story-h" className="relative scroll-mt-24 bg-mist" style={{ height: `${n * 70 + 60}svh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-[calc(var(--header-h)+2rem)] pb-10">
        <Squiggles color="#0089b6" className="inset-x-0 bottom-0 h-1/2 w-full opacity-40" />
        <div className="container-x flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-red">Our story</p>
            <h2 id="story-h" className="display-lg mt-3">
              From an idea to{' '}
              <span className="relative inline-block min-w-[5ch] text-red">
                <span key={NAME(idx)} className="fade-up inline-block">
                  {NAME(idx)}
                </span>
              </span>
            </h2>
          </div>
          <Founders />
        </div>
        <ol ref={track} className="mt-auto flex w-max gap-6 pr-[10vw] pl-[max(1.25rem,4vw)] will-change-transform" style={{ transform: `translateX(${-p * w}px)` }}>
          {timeline.map((t, i) => (
            <li
              key={t.date}
              className={`relative flex h-[min(26rem,48svh)] w-[min(34rem,82vw)] shrink-0 flex-col justify-end overflow-hidden rounded-[var(--radius-panel)] p-7 transition-colors duration-700 md:p-9 ${
                i <= idx ? 'text-white' : 'bg-white text-ink ring-1 ring-ink/10'
              }`}
              style={i <= idx ? { backgroundColor: TONE[i].bg } : undefined}
            >
              <Squiggles color={i <= idx ? TONE[i].mark : '#e06a50'} className="inset-x-0 top-0 h-2/3 w-full" />
              {PHOTO[i] && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PHOTO[i]!} alt="" className="absolute inset-0 size-full object-cover opacity-60" />
                  <span className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
                </>
              )}
              <LogoMark mono={i <= idx ? TONE[i].mark : 'rgb(26 60 110 / 0.12)'} title="" className="absolute -top-14 -right-14 w-56 opacity-80 transition-colors duration-700" />
              <span className="relative font-display text-[clamp(4rem,9vw,7.5rem)] leading-[0.8] font-bold transition-colors duration-700" style={{ color: i <= idx ? TONE[i].year : '#1a3c6e' }}>{t.date.split(' ').pop()}</span>
              <span className="relative mt-4 eyebrow opacity-60">{t.date}</span>
              <h3 className="relative heading-lg mt-2">{t.title}</h3>
              <p className="relative mt-2 opacity-75">{t.body}</p>
            </li>
          ))}
        </ol>
        <div className="container-x mt-8">
          <div className="relative h-1 rounded-full bg-ink/10">
            <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-navy via-teal to-coral" style={{ width: `${p * 100}%` }} />
          </div>
          <p className="mt-3 flex justify-between text-xs font-bold text-ink-soft">
            <span>2022</span>
            <span>Keep scrolling</span>
            <span>2026</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/** Milestones on an arc echoing the logo; autoplays until you pick one. */
function Orbit() {
  const n = timeline.length;
  const [a, setA] = useState(0);
  const [auto, setAuto] = useState(true);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!auto || reduced) return;
    const t = setInterval(() => setA((x) => (x + 1) % n), 4200);
    return () => clearInterval(t);
  }, [auto, reduced, n]);
  const pt = (i: number) => {
    const ang = Math.PI * (1 - i / (n - 1));
    return { x: 500 + Math.cos(ang) * 420, y: 470 - Math.sin(ang) * 400 };
  };
  const t = timeline[a];
  return (
    <section id="story" aria-labelledby="story-h" className="relative isolate scroll-mt-24 overflow-hidden bg-navy py-24 text-white md:py-32">
      <Squiggles color="#e06a50" className="inset-x-0 bottom-0 -z-10 h-2/3 w-full" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_80%,rgb(0_137_182/0.45),transparent)]" />
      <div className="container-x text-center">
        <p className="eyebrow text-coral">Our story</p>
        <h2 id="story-h" className="display-lg mt-3">
          From an idea to <span className="text-red">{NAME(a)}</span>
        </h2>
        <div className="relative mx-auto mt-10 max-w-5xl">
          <svg viewBox="0 0 1000 520" className="w-full" aria-hidden="true">
            <path d="M80 470 A420 400 0 0 1 920 470" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="2" />
            <path
              d="M80 470 A420 400 0 0 1 920 470"
              fill="none"
              stroke="url(#arc)"
              strokeWidth="4"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              style={{ strokeDashoffset: 1 - a / (n - 1), transition: 'stroke-dashoffset 1s var(--ease-out-expo)' }}
            />
            <defs>
              <linearGradient id="arc">
                <stop offset="0" stopColor="#9b1519" />
                <stop offset="1" stopColor="#e06a50" />
              </linearGradient>
            </defs>
          </svg>
          {timeline.map((m, i) => {
            const { x, y } = pt(i);
            return (
              <button
                key={m.date}
                type="button"
                onClick={() => (setAuto(false), setA(i))}
                aria-pressed={a === i}
                aria-label={`${m.date}: ${m.title}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-xs font-bold"
                style={{ left: `${x / 10}%`, top: `${(y / 520) * 100}%` }}
              >
                <span className={`mx-auto block rounded-full transition-all duration-500 ${i <= a ? 'size-5 bg-red ring-4 ring-red/30' : 'size-4 bg-white/30'} ${i === a ? 'scale-125' : ''}`} />
                <span className={`mt-2 block whitespace-nowrap ${i === a ? 'text-white' : 'text-white/50'}`}>{m.date.split(' ').pop()}</span>
              </button>
            );
          })}
          <div key={a} className="fade-up glass-dark absolute bottom-0 left-1/2 w-[min(30rem,88%)] -translate-x-1/2 rounded-[var(--radius-card)] p-6 text-left">
            <p className="eyebrow text-coral">{t.date}</p>
            <h3 className="heading-lg mt-2">{t.title}</h3>
            <p className="mt-2 text-white/75">{t.body}</p>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <Founders light />
        </div>
      </div>
    </section>
  );
}

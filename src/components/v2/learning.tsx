'use client';

import { useEffect, useRef, useState } from 'react';
import { LMS_URL } from '@/content/site';
import { courses } from '@/content/courses';
import { useVariant } from '@/lib/variants';
import { useReducedMotion, useViewProgress } from '@/lib/hooks';
import { SplitText } from '../motion/split-text';
import { Button } from '../ui/button';

export function Learning() {
  const v = useVariant('learning');
  return (
    <section id="learn" aria-labelledby="learn-h" className="relative isolate scroll-mt-24 overflow-hidden bg-mist py-24 text-ink md:py-32">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(45%_55%_at_80%_35%,rgb(0_137_182/0.16),transparent),radial-gradient(40%_50%_at_95%_95%,rgb(224_106_80/0.2),transparent),radial-gradient(35%_45%_at_5%_10%,rgb(215_38_46/0.08),transparent)]" />
      <div className="container-x grid items-center gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]">
        <div>
          <p className="eyebrow text-teal">GANSID Learning Hub</p>
          <SplitText as="h2" lines={[{ text: 'Learn at your' }, { text: 'own pace,', className: 'text-red' }, { text: 'for free' }]} className="display-lg mt-4" />
          <span id="learn-h" className="sr-only">GANSID Learning Hub</span>
          <p className="lede mt-6 text-ink-soft">
            Self-paced courses for patient organizations and health care providers: advocacy, fundraising, leadership, grant writing and the emergency
            care of sickle cell disease. Finish a course and earn a certificate.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2 text-sm font-semibold">
            {['11 courses', 'Self-paced', 'Certificate on completion', 'Free'].map((t) => (
              <li key={t} className="glass rounded-full px-4 py-2 text-ink">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button href={LMS_URL} size="lg">
              Start learning
            </Button>
          </div>
        </div>
        {v === 'fan' ? <Deck /> : <Device />}
      </div>
    </section>
  );
}

/** The real catalogue on a tilted browser that straightens as you scroll. */
function Device() {
  const [ref, p] = useViewProgress<HTMLDivElement>();
  const reduced = useReducedMotion();
  const k = reduced ? 0.6 : Math.min(1, Math.max(0, (p - 0.1) * 2.2));
  const rx = 22 - k * 16;
  const rz = -8 + k * 6;
  return (
    <div ref={ref} className="relative -mx-2 py-8 [perspective:2000px] lg:mx-0">
      <div className="relative transition-transform duration-200 ease-out" style={{ transform: `rotateX(${rx}deg) rotateY(${-14 + k * 8}deg) rotateZ(${rz}deg)`, transformStyle: 'preserve-3d' }}>
        <div className="overflow-hidden rounded-[1.25rem] bg-white text-ink shadow-[0_60px_120px_-40px_rgb(26_60_110/0.55)] ring-1 ring-ink/10">
          <div className="flex items-center gap-3 border-b border-ink/10 bg-mist px-4 py-3">
            <span className="flex gap-1.5">
              <i className="size-3 rounded-full bg-[#ff5f57]" />
              <i className="size-3 rounded-full bg-[#febc2e]" />
              <i className="size-3 rounded-full bg-[#28c840]" />
            </span>
            <span className="mx-auto truncate rounded-full bg-white px-4 py-1 text-xs text-ink-soft ring-1 ring-ink/10">org-lms.netlify.app/gansid</span>
          </div>
          <div className="flex items-center justify-between bg-navy px-5 py-3 text-white">
            <span className="font-display text-xl font-bold tracking-wide">GANSID Learning</span>
            <span className="rounded-full bg-red px-3 py-1 text-xs font-bold">Explore catalogue</span>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3">
            {courses.slice(0, 6).map((c, i) => (
              <div key={c.title} className="overflow-hidden rounded-xl ring-1 ring-ink/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/courses/${c.img}.webp`} alt="" loading="lazy" className="aspect-video w-full object-cover" />
                <div className="p-3">
                  <p className="text-[0.65rem] font-bold text-red uppercase">{c.n ? `Module ${c.n}` : 'Clinical'}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-snug font-bold">{c.title}</p>
                  <p className="mt-2 text-[0.65rem] text-ink-soft">{c.lessons} lessons</p>
                  <span className="mt-2 block h-1 overflow-hidden rounded-full bg-ink/10">
                    <span className="block h-full rounded-full bg-teal" style={{ width: `${[100, 64, 30, 0, 0, 0][i]}%` }} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <FloatCard className="-top-10 left-0 w-56 md:w-60 md:-left-14" z={140} delay={0} tilt={-6}>
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-teal text-lg text-white">✓</span>
            <div>
              <p className="text-xs font-bold text-teal uppercase">Certificate earned</p>
              <p className="text-sm font-bold">Fundamentals of Effective Advocacy</p>
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-dashed border-ink/15 bg-blush/60 p-3 text-center">
            <p className="font-display text-lg leading-none font-bold text-crimson uppercase">Certificate of completion</p>
            <p className="mt-1 text-[0.65rem] text-ink-soft">GANSID Learning Hub</p>
          </div>
        </FloatCard>
        <FloatCard className="top-[42%] right-2 w-52 md:-right-2" z={200} delay={700} tilt={7}>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 36 36" className="size-14 -rotate-90" aria-hidden="true">
              <circle cx="18" cy="18" r="15" fill="none" stroke="rgb(27 20 22 / 0.08)" strokeWidth="4" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="#e06a50" strokeWidth="4" strokeLinecap="round" pathLength={100} strokeDasharray="64 100" />
            </svg>
            <div>
              <p className="font-display text-3xl leading-none font-bold text-navy">64%</p>
              <p className="text-xs font-semibold text-ink-soft">Module 2 progress</p>
            </div>
          </div>
        </FloatCard>
        <FloatCard className="-bottom-12 left-[12%] w-72" z={170} delay={1300} tilt={-3}>
          <div className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/courses/emergency-scd.webp" alt="" className="size-16 shrink-0 rounded-xl object-cover" />
            <div>
              <p className="text-[0.65rem] font-bold text-red uppercase">For health care providers</p>
              <p className="text-sm leading-snug font-bold">Emergency care of acute sickle cell complications</p>
              <p className="mt-1 text-xs text-ink-soft">7 lessons</p>
            </div>
          </div>
        </FloatCard>
      </div>
    </div>
  );
}

/** A small white card floating in front of the browser on its own 3D plane. */
function FloatCard({ children, className, z, delay, tilt }: { children: React.ReactNode; className: string; z: number; delay: number; tilt: number }) {
  return (
    <div className={`absolute ${className}`} style={{ transform: `translateZ(${z}px) rotateZ(${tilt}deg)`, transformStyle: 'preserve-3d' }}>
      <div
        className="rounded-2xl bg-white/95 p-4 text-ink shadow-[0_30px_60px_-20px_rgb(26_60_110/0.45),0_0_0_1px_rgb(255_255_255/0.9)_inset] ring-1 ring-ink/5 backdrop-blur"
        style={{ animation: `float-y 7s ${delay}ms ease-in-out infinite` }}
      >
        {children}
      </div>
    </div>
  );
}

/** A 3D ring of the real courses: drag, swipe or use the arrows to turn it. */
function Deck() {
  const n = courses.length;
  const step = 360 / n;
  const [rot, setRot] = useState(0);
  const drag = useRef<{ x: number; r: number; moved: boolean } | null>(null);
  const reduced = useReducedMotion();
  const [idle, setIdle] = useState(true);
  useEffect(() => {
    if (!idle || reduced) return;
    const t = setInterval(() => setRot((r) => r - step), 3200);
    return () => clearInterval(t);
  }, [idle, reduced, step]);
  const active = (((Math.round(-rot / step) % n) + n) % n) as number;
  const snap = (r: number) => Math.round(r / step) * step;
  return (
    <div className="select-none">
      <div
        className="relative mx-auto h-[26rem] [perspective:1600px] [touch-action:pan-y]"
        role="group"
        aria-roledescription="carousel"
        aria-label="Learning Hub courses"
        onPointerDown={(e) => {
          setIdle(false);
          drag.current = { x: e.clientX, r: rot, moved: false };
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 4) drag.current.moved = true;
          setRot(drag.current.r + dx * 0.35);
        }}
        onPointerUp={() => {
          if (drag.current) setRot((r) => snap(r));
          drag.current = null;
        }}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-expo)] [transform-style:preserve-3d]" style={{ transform: `translateZ(-30rem) rotateY(${rot}deg)` }}>
          {courses.map((c, i) => (
            <a
              key={c.title}
              href={LMS_URL}
              target="_blank"
              rel="noreferrer"
              tabIndex={i === active ? 0 : -1}
              aria-hidden={i !== active}
              onClick={(e) => drag.current?.moved && e.preventDefault()}
              className="absolute top-1/2 left-1/2 -mt-[12rem] -ml-[9.5rem] w-[19rem] overflow-hidden rounded-[var(--radius-card)] bg-white text-ink shadow-[0_30px_60px_-25px_rgb(26_60_110/0.5)] ring-1 ring-ink/10 [backface-visibility:hidden]"
              style={{ transform: `rotateY(${i * step}deg) translateZ(30rem)`, opacity: i === active ? 1 : 0.7 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/courses/${c.img}.webp`} alt="" draggable={false} className="aspect-video w-full object-cover" />
              <div className="p-5">
                <p className="text-xs font-bold text-red uppercase">{c.n ? `Module ${c.n}` : 'Clinical'} · {c.audience}</p>
                <p className="mt-2 line-clamp-2 font-bold">{c.title}</p>
                <p className="mt-3 text-sm text-ink-soft">{c.lessons} lessons · certificate</p>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" aria-label="Previous course" onClick={() => (setIdle(false), setRot((r) => snap(r) + step))} className="glass grid size-12 place-items-center rounded-full text-xl text-ink">
          ←
        </button>
        <p aria-live="polite" className="w-64 truncate text-center text-sm font-semibold text-ink-soft">
          {courses[active].title}
        </p>
        <button type="button" aria-label="Next course" onClick={() => (setIdle(false), setRot((r) => snap(r) - step))} className="glass grid size-12 place-items-center rounded-full text-xl text-ink">
          →
        </button>
      </div>
    </div>
  );
}

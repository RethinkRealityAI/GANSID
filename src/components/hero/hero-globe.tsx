'use client';

import { useEffect, useRef, useState } from 'react';
import land from '@/content/globe-points.json';
import { places } from '@/content/places';
import { useReducedMotion } from '@/lib/hooks';
import { scrollToId } from '../motion/smooth-scroll';
import { HeroCopy } from './hero-copy';
import type { GlobeStage, PinScreen } from '../three/globe-stage';

export function HeroGlobe() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<GlobeStage | null>(null);
  const [pins, setPins] = useState<PinScreen[]>([]);
  const [active, setActive] = useState<string>('hyderabad');
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    let disposed = false;
    let io: IntersectionObserver | undefined;
    import('../three/globe-stage').then(({ GlobeStage }) => {
      if (disposed || !canvas.current) return;
      try {
        const s = new GlobeStage(canvas.current, land as number[], places.map((p) => ({ id: p.id, lat: p.lat, lng: p.lng })), 'dover', reduced);
        let lastSet = 0;
        s.onPins = (p) => {
          const now = performance.now();
          if (now - lastSet > 40) {
            lastSet = now;
            setPins(p);
          }
        };
        stage.current = s;
        s.start();
        setReady(true);
        setTimeout(() => s.focus('hyderabad'), 1600);
        io = new IntersectionObserver(([e]) => (e.isIntersecting ? s.start() : s.stop()));
        io.observe(canvas.current);
      } catch {
        /* no WebGL: the copy stands on its own */
      }
    });
    return () => {
      disposed = true;
      io?.disconnect();
      stage.current?.dispose();
    };
  }, [reduced]);

  const choose = (id: string) => {
    setActive(id);
    stage.current?.focus(id);
  };
  const place = places.find((p) => p.id === active)!;

  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#0d0809] pt-[calc(var(--header-h)+3rem)] pb-16 text-white lg:min-h-[100svh] lg:pb-0">
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(60% 70% at 72% 45%, rgb(155 21 25 / 0.42), transparent 70%), radial-gradient(40% 50% at 10% 100%, rgb(26 60 110 / 0.35), transparent 70%)' }} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(70% 70% at 50% 40%, black, transparent)' }} />

      <div className="container-x grid items-center gap-6 lg:min-h-[calc(100svh-var(--header-h)-3rem)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <HeroCopy />

        <div className="relative mx-auto aspect-square w-full max-w-[min(56rem,92vw)] lg:-mr-[6vw] lg:max-w-none">
          <canvas
            ref={canvas}
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full cursor-grab transition-opacity duration-[1.6s] active:cursor-grabbing ${ready ? 'opacity-100' : 'opacity-0'}`}
          />
          {pins.map((p) => {
            const pl = places.find((x) => x.id === p.id)!;
            const on = p.id === active;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => choose(p.id)}
                aria-label={`${pl.name}: ${pl.tag}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
                style={{ left: p.x, top: p.y, opacity: p.visible ? 1 : 0, pointerEvents: p.visible ? 'auto' : 'none' }}
                tabIndex={-1}
              >
                <span className="relative grid size-6 place-items-center">
                  <span className="absolute inset-0 rounded-full bg-red/60" style={{ animation: 'pulse-ring 2.2s ease-out infinite' }} />
                  <span className={`relative size-2.5 rounded-full ${on ? 'bg-white' : 'bg-coral'}`} />
                </span>
                {on && (
                  <span className="glass-dark absolute top-1/2 left-7 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap">
                    {pl.tag}
                  </span>
                )}
              </button>
            );
          })}

          {/* Place card */}
          <div className="glass-dark absolute right-2 bottom-2 left-2 rounded-3xl p-5 sm:right-auto sm:bottom-[8%] sm:left-[4%] sm:w-80" aria-live="polite">
            <p className="text-xs font-bold tracking-[0.14em] text-coral uppercase">{place.tag}</p>
            <p className="mt-1 text-lg font-bold">{place.name}</p>
            <p className="mt-1 text-sm text-white/75">{place.body}</p>
            <button type="button" onClick={() => scrollToId(place.section)} className="mt-3 text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
              {place.cta} →
            </button>
            <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Places in the network">
              {places.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => choose(p.id)}
                  aria-pressed={p.id === active}
                  className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold transition ${p.id === active ? 'bg-white text-ink' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                >
                  {p.name.split(',')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

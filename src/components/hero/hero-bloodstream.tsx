'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks';
import { HeroCopy } from './hero-copy';
import type { CellsStage } from '../three/cells-stage';

export function HeroBloodstream() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    let s: CellsStage | undefined;
    let io: IntersectionObserver | undefined;
    let off = false;
    import('../three/cells-stage').then(({ CellsStage }) => {
      if (off || !canvas.current) return;
      try {
        s = new CellsStage(canvas.current, reduced);
        s.start();
        setReady(true);
        io = new IntersectionObserver(([e]) => (e.isIntersecting ? s?.start() : s?.stop()));
        io.observe(canvas.current);
      } catch {}
    });
    return () => {
      off = true;
      io?.disconnect();
      s?.dispose();
    };
  }, [reduced]);

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-[#1a0507] pt-[calc(var(--header-h)+3rem)] pb-16 text-white md:items-center md:pb-0">
      <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 -z-20 h-full w-full transition-opacity duration-[2s] ${ready ? 'opacity-100' : 'opacity-0'}`} />
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgb(20 4 6 / 0.88) 0%, rgb(20 4 6 / 0.55) 42%, transparent 70%), linear-gradient(0deg, rgb(13 8 9) 0%, transparent 25%)' }} />
      <div className="container-x">
        <HeroCopy />
      </div>
      <p className="glass-dark absolute right-[max(1.25rem,4vw)] bottom-8 hidden max-w-xs rounded-2xl px-4 py-3 text-xs text-white/75 lg:block">
        <span className="font-bold text-white">Healthy and sickled red cells.</span> In sickle cell disease, cells stiffen into a crescent and block blood flow.
      </p>
    </section>
  );
}

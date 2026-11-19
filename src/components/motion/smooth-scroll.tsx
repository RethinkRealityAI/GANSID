'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/** Eased wheel scrolling so pinned scenes glide instead of stepping. */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (e: Element, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.6 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

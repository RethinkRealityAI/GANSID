'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

export function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)');
    setR(m.matches);
    const on = () => setR(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return r;
}

/** True once the element has come within `margin` of the viewport. */
export function useInView<T extends Element>(margin = '0px 0px -10% 0px', once = true): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, set] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          set(true);
          if (once) io.disconnect();
        } else if (!once) set(false);
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin, once]);
  return [ref, inView];
}

/** 0→1 progress of an element scrolling through the viewport (pinned sections). */
export function useScrollProgress<T extends HTMLElement>(): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - innerHeight;
      setP(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0);
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
  return [ref, p];
}

/** 0→1 as an element travels from entering the bottom of the viewport to leaving the top. */
export function useViewProgress<T extends HTMLElement>(): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setP(Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height))));
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
  return [ref, p];
}

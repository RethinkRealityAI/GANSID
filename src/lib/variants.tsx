'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/**
 * Review-mode design variants. Each homepage section can render more than one
 * treatment; the review dock switches between them so GANSID can compare and
 * mark what they like. Remove once directions are chosen.
 */
export const SECTIONS = {
  hero: {
    label: 'Hero',
    anchor: 'top',
    options: [
      { id: 'globe', name: 'Particle globe', note: 'Interactive network globe; pins jump to sections' },
      { id: 'bloodstream', name: 'Bloodstream', note: '3D red cells and sickle cells drifting in depth' },
      { id: 'mosaic', name: 'Congress mosaic', note: 'Real Hyderabad photos in moving tilted columns' },
    ],
  },
  pillars: {
    label: 'What we do',
    anchor: 'work',
    options: [
      { id: 'stack', name: 'Stacking cards', note: 'Full-width pillar cards stack as you scroll' },
      { id: 'tabs', name: 'Glass tabs', note: 'Pick a pillar, panel morphs in its colour' },
    ],
  },
  learning: {
    label: 'Learning Hub',
    anchor: 'learn',
    options: [
      { id: 'device', name: 'Tilted browser', note: 'The real LMS catalogue on a tilted screen' },
      { id: 'fan', name: 'Course deck', note: 'Draggable 3D deck of the real courses' },
    ],
  },
  story: {
    label: 'Our story',
    anchor: 'story',
    options: [
      { id: 'horizontal', name: 'Horizontal journey', note: 'Pinned; scroll moves through the years' },
      { id: 'orbit', name: 'Interactive arc', note: 'Click milestones on the logo arc; autoplays' },
    ],
  },
} as const;

export type SectionKey = keyof typeof SECTIONS;
export type Choice = Record<SectionKey, string>;

const DEFAULTS: Choice = { hero: 'globe', pillars: 'stack', learning: 'device', story: 'horizontal' };
const KEY = 'gansid-variants-v2';

const Ctx = createContext<{ choice: Choice; set: (k: SectionKey, v: string) => void }>({
  choice: DEFAULTS,
  set: () => {},
});

export function VariantProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<Choice>(DEFAULTS);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setChoice({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);
  const set = useCallback((k: SectionKey, v: string) => {
    setChoice((c) => {
      const next = { ...c, [k]: v };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);
  const value = useMemo(() => ({ choice, set }), [choice, set]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useVariants = () => useContext(Ctx);
export function useVariant(k: SectionKey) {
  return useContext(Ctx).choice[k];
}

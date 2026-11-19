'use client';

import { useVariant } from '@/lib/variants';
import { HeroGlobe } from '../hero/hero-globe';
import { HeroBloodstream } from '../hero/hero-bloodstream';
import { HeroMosaic } from '../hero/hero-mosaic';

export function Hero() {
  const v = useVariant('hero');
  if (v === 'bloodstream') return <HeroBloodstream />;
  if (v === 'mosaic') return <HeroMosaic />;
  return <HeroGlobe />;
}

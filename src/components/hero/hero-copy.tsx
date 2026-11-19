import Link from 'next/link';
import { SplitText } from '../motion/split-text';
import { Button } from '../ui/button';
import { LMS_URL } from '@/content/site';

/** Shared hero statement used by every hero variant. */
export function HeroCopy({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const dark = tone === 'dark';
  return (
    <div className="relative z-10 max-w-[44rem]">
      <p className={`fade-up inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-[0.14em] uppercase ${dark ? 'glass-dark text-white/90' : 'glass text-ink'}`}>
        <span className="relative flex size-2">
          <span className="absolute inset-0 rounded-full bg-red" style={{ animation: 'pulse-ring 2s ease-out infinite' }} />
          <span className="relative size-2 rounded-full bg-red" />
        </span>
        Global Action Network · since 2022
      </p>
      <SplitText
        as="h1"
        delay={150}
        className={`display-xl mt-7 ${dark ? 'text-white' : 'text-ink'}`}
        lines={[{ text: 'One network.' }, { text: 'Every inherited', className: 'text-red' }, { text: 'blood disorder.' }]}
      />
      <p className={`lede fade-up mt-7 ${dark ? 'text-white/75' : 'text-ink-soft'}`} style={{ ['--d' as string]: '700ms' }}>
        <strong className={`block font-semibold ${dark ? 'text-white' : 'text-ink'}`}>Mostly rare. Majorly neglected.</strong>
        Patient organizations, clinicians, researchers and partners working together on sickle cell disease and other
        inherited blood disorders, especially where resources are scarce.
      </p>
      <div className="fade-up mt-9 flex flex-wrap gap-3" style={{ ['--d' as string]: '850ms' }}>
        <Button href="/get-involved/membership" size="lg">
          Become a member
        </Button>
        <Button href="#work" size="lg" variant={dark ? 'ghost-light' : 'ghost'}>
          Explore our work
        </Button>
      </div>
      <ul className="fade-up mt-10 flex flex-wrap gap-2.5" style={{ ['--d' as string]: '1000ms' }}>
        {[
          { k: 'Oct 23–25, 2026', v: 'Congress · Hyderabad', href: '#congress' },
          { k: '6', v: 'disorders, one voice', href: '/disorders' },
          { k: '11', v: 'free online courses', href: LMS_URL },
        ].map((c) => (
          <li key={c.v}>
            <Link
              href={c.href}
              className={`sheen flex items-baseline gap-2 rounded-2xl px-4 py-2.5 text-sm transition hover:-translate-y-0.5 ${dark ? 'glass-dark text-white/80' : 'glass text-ink-soft'}`}
            >
              <span className={`font-display text-xl leading-none font-bold ${dark ? 'text-white' : 'text-ink'}`}>{c.k}</span>
              {c.v}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

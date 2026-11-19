import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Button, TextLink } from '@/components/ui/button';
import { LogoMark } from '@/components/ui/logo-mark';
import { ArrowRight, ArrowUpRight, Drop, Plus } from '@/components/ui/icons';
import { SplitText, CountUp } from '@/components/motion/split-text';

export const metadata: Metadata = { title: 'Design system', robots: { index: false } };

const COLORS: { group: string; note: string; items: [string, string, string, boolean?][] }[] = [
  {
    group: 'Brand reds',
    note: 'Sampled from the four arcs of the logo. Red leads; crimson for depth, coral for warmth.',
    items: [
      ['Crimson', 'crimson', '#9b1519'],
      ['Garnet', 'garnet', '#bf2f38'],
      ['Red', 'red', '#d7262e'],
      ['Coral', 'coral', '#e06a50'],
      ['Blush', 'blush', '#fbeae8', true],
    ],
  },
  {
    group: 'Heritage blues',
    note: 'The original GANSID navy and teal. Used for education, research and calm surfaces.',
    items: [
      ['Navy deep', 'navy-deep', '#10284c'],
      ['Navy', 'navy', '#1a3c6e'],
      ['Teal', 'teal', '#0089b6'],
      ['Teal soft', 'teal-soft', '#e3f3f9', true],
    ],
  },
  {
    group: 'Warm neutrals',
    note: 'Red-biased greys so text and surfaces sit comfortably next to the brand reds.',
    items: [
      ['Ink', 'ink', '#1b1416'],
      ['Ink soft', 'ink-soft', '#5a4d51'],
      ['Muted', 'muted', '#8a7c80'],
      ['Line', 'line', '#ecdfe1', true],
      ['Mist', 'mist', '#f8f3f3', true],
      ['Paper', 'paper', '#ffffff', true],
    ],
  },
];

const PILLARS = [
  ['Advocacy', '#d7262e'],
  ['Capacity building', '#e06a50'],
  ['Education', '#1a3c6e'],
  ['Clinical trials & research', '#0089b6'],
];

function Section({ id, n, title, intro, children }: { id: string; n: string; title: string; intro: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-line py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div>
          <p className="font-display text-6xl leading-none font-bold text-red/25">{n}</p>
          <h2 className="heading-lg mt-3">{title}</h2>
          <p className="mt-3 text-sm text-ink-soft">{intro}</p>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

function Spec({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-mist px-1.5 py-0.5 font-mono text-[0.75rem] text-ink-soft ring-1 ring-line">{children}</code>;
}

export default function DesignSystem() {
  return (
    <div className="bg-paper pt-[calc(var(--header-h)+2rem)]">
      {/* Cover */}
      <header className="container-x">
        <div className="grain relative isolate overflow-hidden rounded-[var(--radius-panel)] bg-navy p-8 text-white md:p-14">
          <LogoMark mono="rgb(224 106 80 / 0.35)" title="" className="absolute -top-24 -right-24 -z-10 w-[34rem] animate-[spin-slow_90s_linear_infinite]" />
          <p className="glass-dark inline-flex rounded-full px-4 py-2 text-xs font-bold tracking-[0.14em] uppercase">Version 0.2 · Draft</p>
          <SplitText as="h1" lines={[{ text: 'Living Network' }, { text: 'design system', className: 'text-coral' }]} className="display-xl mt-6" />
          <p className="lede mt-6 text-white/80">
            The colours, type, surfaces and components behind the new GANSID website. Built from the logo: four arcs and four droplets, one
            network.
          </p>
          <nav aria-label="Design system sections" className="mt-10 flex flex-wrap gap-2 text-sm font-semibold">
            {['Colour', 'Type', 'Glass', 'Buttons', 'Pills', 'Cards', 'Motion', 'Brand mark'].map((s, i) => (
              <a key={s} href={`#ds-${i}`} className="glass-dark rounded-full px-4 py-2 transition-colors hover:bg-white/20">
                {s}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className="container-x">
        <Section id="ds-0" n="01" title="Colour" intro="Tokens live in globals.css under @theme, so every Tailwind class (bg-red, text-navy…) reads from one place.">
          <div className="grid gap-10">
            {COLORS.map((g) => (
              <div key={g.group}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-bold">{g.group}</h3>
                  <p className="text-sm text-ink-soft">{g.note}</p>
                </div>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
                  {g.items.map(([name, token, hex, light]) => (
                    <li key={token} className="overflow-hidden rounded-[var(--radius-card)] ring-1 ring-line">
                      <div className={`h-24 ${light ? 'border-b border-line' : ''}`} style={{ background: hex }} />
                      <div className="p-3">
                        <p className="text-sm font-bold">{name}</p>
                        <p className="mt-1 flex flex-wrap gap-1 text-xs">
                          <Spec>{token}</Spec> <Spec>{hex}</Spec>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="font-bold">Pillar colour-coding</h3>
              <p className="mt-1 text-sm text-ink-soft">Each programme pillar owns one colour everywhere it appears: cards, tags, charts.</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {PILLARS.map(([n, c]) => (
                  <li key={n} className="flex items-center gap-3 rounded-full bg-mist p-1.5 pr-5 text-sm font-semibold">
                    <span className="size-9 rounded-full" style={{ background: c }} />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="ds-1" n="02" title="Type" intro="Barlow Condensed (display) echoes the condensed logo wordmark. Manrope (text) keeps long reading calm and clear.">
          <ul className="grid gap-8">
            {[
              ['display-xl', 'One network.', 'Barlow Condensed 700 · clamp 52→108px · uppercase'],
              ['display-lg', 'Four ways we move care forward', 'Barlow Condensed 700 · clamp 44→92px'],
              ['heading-xl', 'Thank you for joining the 4th GANSID Congress', 'Manrope 650 · clamp 32→52px'],
              ['heading-lg', 'Become a GANSID member organization', 'Manrope 650 · clamp 24→32px'],
              ['lede', 'Patient organizations, clinicians, researchers and partners working together on inherited blood disorders.', 'Manrope 400 · 17→20px · max 38rem'],
              ['eyebrow', 'Congress 2026 · Hyderabad', 'Manrope 700 · 12px · tracking 0.16em'],
            ].map(([cls, sample, spec]) => (
              <li key={cls} className="grid gap-2 border-b border-line pb-8 last:border-0">
                <p className="flex flex-wrap gap-2 text-xs">
                  <Spec>.{cls}</Spec>
                  <span className="text-ink-soft">{spec}</span>
                </p>
                <p className={`${cls} ${cls === 'eyebrow' ? 'text-red' : ''} ${cls === 'lede' ? 'text-ink-soft' : ''}`}>{sample}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="ds-2" n="03" title="Liquid glass" intro="Tinted, blurred and saturated surfaces with a bright top edge. Use on pills, the header, dock and floating cards over imagery. Solid fallback where blur is unsupported.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative isolate overflow-hidden rounded-[var(--radius-panel)] p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/d1-welcome.webp" alt="" className="absolute inset-0 -z-10 size-full object-cover" />
              <div className="glass bg-white/75 rounded-[var(--radius-card)] p-6">
                <p className="eyebrow text-red">.glass</p>
                <p className="heading-lg mt-2">Light glass</p>
                <p className="mt-2 text-sm text-ink-soft">Header, light pills, cards over pale or busy photos.</p>
              </div>
            </div>
            <div className="relative isolate overflow-hidden rounded-[var(--radius-panel)] bg-navy p-8 text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/d2-stage.webp" alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-70" />
              <div className="glass-dark bg-ink/60 rounded-[var(--radius-card)] p-6">
                <p className="eyebrow text-coral">.glass-dark</p>
                <p className="heading-lg mt-2">Smoked glass</p>
                <p className="mt-2 text-sm text-white/75">The hero place card, tags on photos, the design dock.</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            Add <Spec>.sheen</Spec> to any glass card for the light sweep on hover. Text on glass must still pass 4.5:1 contrast against the darkest
            area behind it.
          </p>
        </Section>

        <Section id="ds-3" n="04" title="Buttons" intro="Pill shaped with a round icon chip. One primary per view. External links get the diagonal arrow automatically.">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-card)] bg-mist p-6">
              <Button href="#">Primary</Button>
              <Button href="#" variant="dark">
                Dark
              </Button>
              <Button href="#" variant="ghost">
                Ghost
              </Button>
              <Button href="https://example.org" variant="primary">
                External
              </Button>
              <Button href="#" size="lg">
                Large
              </Button>
              <TextLink href="#">Text link</TextLink>
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-card)] bg-ink p-6">
              <Button href="#" variant="light">
                Light
              </Button>
              <Button href="#" variant="ghost-light">
                Ghost light
              </Button>
              <Button href="#">Primary on dark</Button>
            </div>
          </div>
        </Section>

        <Section id="ds-4" n="05" title="Pills & tags" intro="Status, facts and filters. Glass pills sit on imagery; solid pills on flat colour.">
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-2 rounded-[var(--radius-card)] bg-mist p-6 text-sm font-semibold">
              {['11 courses', 'Self-paced', 'Certificate on completion', 'Free'].map((t) => (
                <span key={t} className="glass rounded-full px-4 py-2">
                  {t}
                </span>
              ))}
              <span className="rounded-full bg-blush px-4 py-2 text-crimson">Membership</span>
              <span className="rounded-full bg-teal-soft px-4 py-2 text-teal">Research</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-line">
                <span className="size-2 rounded-full bg-red shadow-[0_0_0_4px_rgb(215_38_46/0.2)]" /> Live
              </span>
            </div>
            <div className="flex flex-wrap gap-2 rounded-[var(--radius-card)] bg-navy p-6 text-sm font-semibold text-white">
              {['Congress 2026 · Hyderabad', 'Pillar 2 of 4', 'Oct 23–25, 2026'].map((t) => (
                <span key={t} className="glass-dark rounded-full px-4 py-2">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Section>

        <Section id="ds-5" n="06" title="Cards" intro="Three families: photo tiles (stories and calls to action), colour panels (pillars, programmes) and floating cards (data and status over mockups).">
          <div className="grid gap-4 md:grid-cols-3">
            <a href="#" className="group sheen relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[var(--radius-panel)] p-6 text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/d1-booth.webp" alt="" className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-[1.4s] group-hover:scale-110" />
              <span className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
              <span className="glass-dark absolute top-5 right-5 grid size-11 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="size-5" />
              </span>
              <span className="font-display text-4xl leading-[0.9] font-bold uppercase">Photo tile</span>
              <span className="mt-2 text-sm text-white/80">Gradient scrim keeps text above 4.5:1.</span>
            </a>
            <div className="grain relative flex aspect-[4/5] flex-col overflow-hidden rounded-[var(--radius-panel)] bg-teal p-6 text-white">
              <span className="font-display text-7xl leading-none font-bold text-white/25">04</span>
              <span className="display-lg mt-auto text-[2.75rem]">Colour panel</span>
              <span className="mt-3 flex flex-wrap gap-2">
                <span className="glass-dark rounded-full px-3 py-1.5 text-xs font-bold">Current trials</span>
                <span className="glass-dark rounded-full px-3 py-1.5 text-xs font-bold">Resources</span>
              </span>
            </div>
            <div className="relative flex aspect-[4/5] items-center justify-center rounded-[var(--radius-panel)] bg-mist p-6">
              <div className="w-60 -rotate-3 rounded-2xl bg-white/95 p-4 shadow-[0_30px_60px_-20px_rgb(26_60_110/0.45)] ring-1 ring-ink/5 [animation:float-y_7s_ease-in-out_infinite]">
                <p className="text-xs font-bold text-teal uppercase">Floating card</p>
                <p className="mt-1 text-sm font-bold">Certificate earned</p>
                <div className="mt-3 h-1.5 rounded-full bg-ink/10">
                  <div className="h-full w-2/3 rounded-full bg-coral" />
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="ds-6" n="07" title="Motion" intro="Motion explains, never decorates for its own sake. Everything respects reduced-motion: it gets gentler, not removed.">
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              ['Word rise', 'Headlines rise word by word into a mask as they enter view.', 'SplitText'],
              ['Scroll light-up', 'Long statements light up word by word as you read.', 'ScrollWords'],
              ['Count up', 'True facts count up once, when first seen.', 'CountUp'],
              ['Stacking cards', 'Panels pin and stack; earlier ones recede and dim.', 'Pillars · stack'],
              ['Pinned journey', 'Vertical scroll drives a horizontal timeline.', 'Story · horizontal'],
              ['Sheen', 'A light sweep across glass on hover.', '.sheen'],
            ].map(([t, d, c]) => (
              <li key={t} className="rounded-[var(--radius-card)] bg-mist p-5">
                <p className="font-bold">{t}</p>
                <p className="mt-1 text-sm text-ink-soft">{d}</p>
                <p className="mt-3 text-xs">
                  <Spec>{c}</Spec>
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-end gap-6 rounded-[var(--radius-card)] bg-navy p-6 text-white">
            <CountUp value="2022" className="font-display text-6xl font-bold text-coral" />
            <p className="pb-2 text-sm text-white/75">
              Easing: <Spec>cubic-bezier(0.16, 1, 0.3, 1)</Spec>
            </p>
          </div>
        </Section>

        <Section id="ds-7" n="08" title="Brand mark & icons" intro="The mark is redrawn as SVG so it can animate, recolour and scale. Keep clear space of one droplet around it.">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid aspect-square place-items-center rounded-[var(--radius-card)] bg-mist">
              <LogoMark className="w-1/2" />
            </div>
            <div className="grid aspect-square place-items-center rounded-[var(--radius-card)] bg-navy">
              <LogoMark mono="#ffffff" className="w-1/2" />
            </div>
            <div className="grid aspect-square place-items-center rounded-[var(--radius-card)] bg-red">
              <LogoMark animated mono="#ffffff" className="w-1/2" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {[ArrowRight, ArrowUpRight, Plus, Drop].map((I, i) => (
              <span key={i} className="grid size-12 place-items-center rounded-full bg-mist text-ink">
                <I className="size-5" />
              </span>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

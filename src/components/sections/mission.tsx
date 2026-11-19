import { facts, mission, vision } from '@/content/site';
import { Eyebrow } from '../ui/eyebrow';
import { TextLink } from '../ui/button';

/** Vision statement over four flowing lines, one per programme pillar. */
export function Mission() {
  const lines = [
    { d: 'M-40 210 C 220 60 420 380 700 200 S 1180 40 1480 190', c: 'var(--pillar-advocacy)' },
    { d: 'M-40 300 C 260 420 520 120 780 260 S 1200 420 1480 280', c: 'var(--pillar-capacity)' },
    { d: 'M-40 120 C 300 250 560 20 860 150 S 1240 260 1480 90', c: 'var(--pillar-education)' },
    { d: 'M-40 380 C 240 300 480 470 760 360 S 1220 260 1480 400', c: 'var(--pillar-research)' },
  ];
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-36">
      <svg
        viewBox="0 0 1440 480"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 -bottom-6 h-[34%] w-full opacity-55"
        aria-hidden="true"
      >
        {lines.map((l, i) => (
          <path
            key={i}
            d={l.d}
            fill="none"
            stroke={l.c}
            strokeWidth="2.5"
            pathLength={1}
            strokeDasharray="1"
            style={{ animation: `draw-line 2.8s var(--ease-out-expo) ${0.2 + i * 0.25}s both` }}
          />
        ))}
      </svg>

      <div className="container-x relative">
        <div className="reveal mx-auto max-w-5xl text-center">
          <Eyebrow className="justify-center">Our vision</Eyebrow>
          <p className="heading-xl mx-auto mt-6 max-w-[26ch]">{vision}</p>
          <p className="lede mx-auto mt-8 text-ink-soft">{mission}</p>
          <TextLink href="/about/mission" className="mt-8 text-crimson">
            Our mission and objectives
          </TextLink>
        </div>

        <dl className="reveal relative mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] bg-line ring-1 ring-line md:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col gap-2 bg-white p-6 md:p-8">
              <dt className="order-2 text-sm leading-snug text-ink-soft">{f.label}</dt>
              <dd className="font-display text-5xl leading-none font-bold text-ink tabular-nums md:text-6xl">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

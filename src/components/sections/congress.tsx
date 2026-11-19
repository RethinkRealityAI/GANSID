import { congress } from '@/content/site';
import { Button } from '../ui/button';
import { Eyebrow } from '../ui/eyebrow';
import { ArtFrame } from '../ui/art-frame';

/** Event band: loud, condensed, red. Borrowed energy from event templates. */
export function Congress() {
  return (
    <section className="grain relative overflow-hidden bg-red text-white">
      <div className="container-x relative py-24 md:py-32">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Eyebrow tone="light">{congress.edition}</Eyebrow>
          <p className="eyebrow text-white/80">
            {congress.venue} · {congress.city}, {congress.country}
          </p>
        </div>

        <h2 className="mt-8 font-display leading-[0.8] font-bold uppercase">
          <span className="block text-[clamp(1.75rem,4vw,3.5rem)] text-white/85">Thank you for joining us in</span>
          <span className="reveal block text-[clamp(4.5rem,17vw,16rem)] tracking-[-0.01em]">{congress.city}</span>
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <p className="eyebrow text-white/70">Theme</p>
            <p className="heading-lg mt-3 max-w-[30ch]">{congress.theme}</p>
            <p className="mt-5 max-w-lg text-white/85">
              Our first in-person Congress brought together clinicians, researchers, laboratory scientists, patient
              organizations, industry, policymakers and global health agencies.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/congress/2026/photos" variant="light" size="lg">
                View Congress photos
              </Button>
              <Button href="/congress" variant="ghost-light" size="lg">
                Congress updates
              </Button>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {congress.focus.map((f, i) => (
              <li key={f} className="flex flex-col justify-between gap-8 rounded-[var(--radius-card)] bg-ink/90 p-6 ring-1 ring-white/10">
                <span className="font-display text-xl font-semibold text-coral tabular-nums">Track {i + 1}</span>
                <span className="text-[1.0625rem] leading-snug font-semibold">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Congress photo strip (placeholders)">
          {['Opening plenary', 'Exhibition hall', 'Panel, day 2', 'Delegates, day 3'].map((p, i) => (
            <ArtFrame
              key={p}
              tone={i % 2 ? 'crimson' : 'ink'}
              photo={p}
              className={`aspect-[4/5] rounded-2xl ${i % 2 ? 'md:translate-y-8' : ''}`}
              markClass="-right-[30%] -bottom-[25%] w-[110%]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

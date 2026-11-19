import { congress } from '@/content/site';
import { SplitText } from '../motion/split-text';
import { Button } from '../ui/button';

const ROW_A = ['d1-welcome', 'd2-stage', 'd1-gansid2026', 'pf-group-backdrop', 'congress-stage', 'pf-question', 'congress-welcome-arch', 'pf-stage-wide', 'congress-delegates-trio'];
const ROW_B = ['d1-booth', 'd2-question', 'd1-launch', 'd2-group', 'congress-keynote', 'pf-networking', 'congress-exhibition-tscs', 'pf-women-backdrop', 'congress-registration', 'pf-audience'];

/** Event band: giant city, dates as a ticket, two rows of real photos drifting in opposite directions. */
export function Congress() {
  return (
    <section id="congress" aria-labelledby="congress-h" className="grain relative isolate scroll-mt-24 overflow-hidden bg-crimson text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_80%_0%,rgb(224_106_80/0.55),transparent),radial-gradient(60%_60%_at_0%_100%,rgb(26_60_110/0.6),transparent)]" />
      <div className="container-x pt-24 md:pt-32">
        <div className="flex flex-wrap items-center gap-3">
          <span className="glass-dark rounded-full px-4 py-2 text-xs font-bold tracking-wide">{congress.edition}</span>
          <span className="glass-dark rounded-full px-4 py-2 text-xs font-bold tracking-wide">
            {congress.venue} · {congress.city}, {congress.country}
          </span>
        </div>
        <div className="mt-8 grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p className="font-display text-[clamp(1.5rem,3vw,2.75rem)] leading-none font-semibold text-white/80 uppercase">Thank you for joining us in</p>
            <SplitText as="h2" lines={[{ text: congress.city }]} className="font-display text-[clamp(4.5rem,15vw,15rem)] leading-[0.82] font-bold tracking-[-0.01em] uppercase" />
            <span id="congress-h" className="sr-only">{congress.edition}</span>
          </div>
          <div className="glass-dark reveal flex rounded-[var(--radius-card)] p-2">
            {[
              ['Oct', '23'],
              ['Oct', '24'],
              ['Oct', '25'],
            ].map(([m, d], i) => (
              <div key={d} className={`px-5 py-3 text-center ${i ? 'border-l border-dashed border-white/25' : ''}`}>
                <span className="eyebrow block text-white/60">{m}</span>
                <span className="font-display block text-5xl leading-none font-bold">{d}</span>
                <span className="mt-1 block text-[0.7rem] font-semibold text-white/60">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div className="reveal">
            <p className="eyebrow text-white/60">Theme</p>
            <p className="heading-lg mt-3 max-w-[30ch]">{congress.theme}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/congress/2026/photos" variant="light" size="lg">
                Relive the photos
              </Button>
              <Button href="/congress" variant="ghost-light" size="lg">
                Congress updates
              </Button>
            </div>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {congress.focus.map((f, i) => (
              <li key={f} className="reveal glass-dark sheen flex flex-col justify-between gap-6 rounded-[var(--radius-card)] p-5">
                <span className="font-display text-lg font-semibold text-coral">Track 0{i + 1}</span>
                <span className="leading-snug font-semibold">{f}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="mt-20 grid gap-4 pb-24 md:pb-32" aria-label="Photos from the 4th GANSID Congress">
        <PhotoRow list={ROW_A} />
        <PhotoRow list={ROW_B} reverse />
      </div>
    </section>
  );
}

function PhotoRow({ list, reverse = false }: { list: string[]; reverse?: boolean }) {
  return (
    <div className="marquee overflow-hidden">
      <ul className="marquee-track flex w-max gap-4" style={{ animationDuration: '70s', animationDirection: reverse ? 'reverse' : 'normal' }}>
        {[...list, ...list].map((s, i) => (
          <li key={i} aria-hidden={i >= list.length || undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/photos/${s}.webp`} alt={i < list.length ? 'Delegates at the 4th GANSID Congress, Hyderabad' : ''} loading="lazy" className="h-48 w-72 rounded-2xl object-cover ring-1 ring-white/15 md:h-64 md:w-96" />
          </li>
        ))}
      </ul>
    </div>
  );
}

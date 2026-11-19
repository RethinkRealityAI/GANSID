import { LMS_URL, learning } from '@/content/site';
import { Button } from '../ui/button';
import { Eyebrow } from '../ui/eyebrow';

/** Education, framed as a product: the GANSID Learning Hub (the LMS). */
export function LearningHub() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
      <div
        className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[42rem] w-[80rem] -translate-x-1/2 rounded-[50%] opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, rgb(26 60 110 / 0.9), rgb(155 21 25 / 0.35), transparent)' }}
        aria-hidden="true"
      />
      <div className="container-x relative grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="reveal">
          <Eyebrow tone="light">Education</Eyebrow>
          <h2 className="display-lg mt-5">
            Learn with the
            <span className="block text-coral">GANSID Learning Hub</span>
          </h2>
          <p className="lede mt-6 text-white/75">
            Free, self-paced courses and live sessions for the people who care for and advocate with families living
            with inherited blood disorders. Finish a course, earn a certificate.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={LMS_URL} size="lg">
              Open the Learning Hub
            </Button>
            <Button href="/programs/education" variant="ghost-light" size="lg">
              All education programs
            </Button>
          </div>
        </div>

        <div className="reveal grid gap-4 sm:grid-cols-2">
          {[
            { aud: 'For health care providers', items: learning.providers, color: 'var(--color-teal)' },
            { aud: 'For patient organizations', items: learning.organizations, color: 'var(--color-coral)' },
          ].map((col) => (
            <div key={col.aud} className="rounded-[var(--radius-panel)] bg-white/[0.06] p-7 ring-1 ring-white/10 backdrop-blur-xl">
              <p className="eyebrow" style={{ color: col.color }}>
                {col.aud}
              </p>
              <ul className="mt-6 space-y-4">
                {col.items.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-[1.0625rem] font-semibold">
                    <span className="mt-2.5 size-2 shrink-0 rounded-full" style={{ background: col.color }} />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="rounded-[var(--radius-panel)] bg-white p-7 text-ink sm:col-span-2">
            <p className="eyebrow text-ink-soft">Mentorship program</p>
            <p className="mt-3 text-lg leading-snug font-semibold">
              Six months, one hour a month, one mentor. Pairs clinicians to keep skills sharp, closing with a regional
              in-person lecture and assessment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

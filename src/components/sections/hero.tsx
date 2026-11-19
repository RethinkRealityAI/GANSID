import { highlights, regions } from '@/content/site';
import { Button } from '../ui/button';
import { Eyebrow } from '../ui/eyebrow';
import { LogoMark } from '../ui/logo-mark';
import { ArrowRight, ArrowUpRight } from '../ui/icons';
import { ArtFrame, toneBg, type Tone } from '../ui/art-frame';

/**
 * Hero: statement on the left stays pinned while "right now at GANSID"
 * cards stack over each other on the right (desktop). On phones the cards
 * become a simple vertical list under the statement.
 */
export function Hero() {
  return (
    <section className="relative overflow-clip bg-mist pt-[calc(var(--header-h)+2.5rem)] pb-16 lg:pb-24">
      {/* ambient brand mark */}
      <LogoMark
        animated
        className="pointer-events-none absolute -top-40 -left-48 w-[44rem] opacity-[0.07]"
        title=""
      />

      <div className="container-x relative grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
        {/* Statement */}
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)] lg:self-start">
          <Eyebrow>Global Action Network · est. 2022</Eyebrow>
          <h1 className="display-xl mt-6">
            One network.
            <span className="block text-red">Every inherited</span>
            blood disorder.
          </h1>
          <p className="lede mt-7 text-ink-soft">
            GANSID unites patient organizations, health care providers, researchers and partners to advance advocacy,
            training and care for sickle cell disease and other inherited blood disorders, especially where resources
            are scarce.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/get-involved/membership" size="lg">
              Become a member
            </Button>
            <Button href="/programs" size="lg" variant="ghost">
              Explore our work
            </Button>
          </div>

          <dl className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-soft">
            <dt className="eyebrow text-muted">Regional networks</dt>
            {regions.map((r) => (
              <dd key={r.code}>
                <a href={r.href} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-semibold text-ink ring-1 ring-line transition hover:ring-red">
                  <span className="font-display text-base leading-none font-bold text-red">{r.code}</span>
                  {r.name}
                </a>
              </dd>
            ))}
          </dl>
        </div>

        {/* Stacking highlight cards */}
        <div aria-label="Right now at GANSID" role="region">
          <p className="eyebrow mb-4 text-muted lg:hidden">Right now at GANSID</p>
          <ol className="grid gap-5 lg:gap-0">
            {highlights.map((h, i) => (
              <li
                key={h.title}
                className="lg:sticky lg:mb-[14vh] lg:last:mb-0"
                style={{ top: `calc(var(--header-h) + 2.5rem + ${i * 1.25}rem)` }}
              >
                <HighlightCard index={i} total={highlights.length} {...h} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function HighlightCard({
  tag,
  title,
  body,
  cta,
  href,
  tone,
  index,
  total,
}: (typeof highlights)[number] & { index: number; total: number }) {
  const external = href.startsWith('http');
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <article
      className={`grain group relative flex min-h-[30rem] flex-col overflow-hidden rounded-[var(--radius-panel)] p-6 text-white shadow-[0_30px_80px_-40px_rgb(27_20_22/0.6)] sm:p-8 lg:min-h-[34rem] ${toneBg[tone as Tone]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="eyebrow text-white/85">{tag}</p>
        <p className="font-display text-lg font-semibold tabular-nums text-white/70" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </p>
      </div>

      <ArtFrame
        tone={tone as Tone}
        className="mt-6 aspect-[16/9] w-full rounded-2xl ring-1 ring-white/15 brightness-[0.92]"
        photo={index === 0 ? 'Congress 2026 plenary hall' : undefined}
        markClass="-right-[12%] -bottom-[45%] w-[70%]"
      />

      <div className="mt-auto pt-8">
        <h2 className="heading-lg max-w-[22ch]">{title}</h2>
        <p className="mt-3 max-w-[46ch] text-[0.975rem] leading-relaxed text-white/85">{body}</p>
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="mt-6 inline-flex h-12 items-center gap-3 rounded-full bg-white pr-2 pl-5 font-semibold text-ink transition hover:bg-blush"
        >
          {cta}
          <span className="grid size-8 place-items-center rounded-full bg-ink text-white transition-transform group-hover:translate-x-0.5">
            <Icon className="size-4" />
          </span>
        </a>
      </div>
    </article>
  );
}

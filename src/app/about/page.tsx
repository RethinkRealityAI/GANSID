import type { Metadata } from 'next';
import { PageHero, SectionHead } from '@/components/page/page-hero';
import { PersonPhoto } from '@/components/page/person-photo';
import { ScrollWords } from '@/components/motion/split-text';
import { StoryOrbit } from '@/components/v2/story';
import { Button } from '@/components/ui/button';
import { LogoMark } from '@/components/ui/logo-mark';
import { aboutIntro, founderPeople, gap, mission, objectives, opportunity, regions, regionsIntro, vision, whoWeAre } from '@/content/about';

export const metadata: Metadata = {
  title: 'About GANSID',
  description: aboutIntro.lede,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
        eyebrow={aboutIntro.eyebrow}
        title={aboutIntro.title}
        accentLine={1}
        lede={aboutIntro.lede}
        photo="/photos/d1-gansid2026.webp"
        photoAlt="GANSID members gathered behind the GANSID 2026 letters at the Congress in Hyderabad"
        card={aboutIntro.place}
      >
        <Button href="/get-involved/membership">Become a member</Button>
        <Button href="#mission" variant="ghost">
          Vision & mission
        </Button>
      </PageHero>

      {/* The gap → the opportunity */}
      <section aria-labelledby="why-h" className="bg-paper py-24 md:py-32">
        <div className="container-x">
          <SectionHead eyebrow="Why GANSID exists" title="From passion to a network" />
          <h2 id="why-h" className="sr-only">
            The gap and the opportunity
          </h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <article className="rounded-[var(--radius-card)] bg-mist p-8 ring-1 ring-ink/5 md:p-10">
              <p className="eyebrow text-ink-soft">01 · {gap.title}</p>
              <p className="mt-5 text-lg leading-relaxed text-ink">{gap.body}</p>
            </article>
            <article className="relative isolate overflow-hidden rounded-[var(--radius-card)] bg-red p-8 text-white md:p-10">
              <LogoMark mono="#ffffff" className="absolute -right-16 -bottom-16 -z-10 size-72 opacity-15" />
              <p className="eyebrow text-white/80">02 · {opportunity.title}</p>
              {opportunity.body.map((b) => (
                <p key={b.slice(0, 20)} className="mt-5 text-lg leading-relaxed">
                  {b}
                </p>
              ))}
            </article>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section aria-labelledby="who-h" className="relative isolate overflow-hidden bg-navy py-24 text-white md:py-32">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(45%_60%_at_90%_10%,rgb(0_137_182/0.45),transparent),radial-gradient(40%_50%_at_0%_100%,rgb(224_106_80/0.3),transparent)]" />
        <div className="container-x">
          <p className="eyebrow text-coral">Who we are</p>
          <h2 id="who-h" className="sr-only">
            Who we are
          </h2>
          <ScrollWords text={whoWeAre.statement} className="heading-xl mt-6 max-w-5xl" />
          <ul className="mt-12 flex flex-wrap gap-3">
            {whoWeAre.members.map((m) => (
              <li key={m} className="glass-dark rounded-full px-5 py-2.5 text-sm font-semibold">
                {m}
              </li>
            ))}
          </ul>
          <p className="lede mt-10 text-white/75">{whoWeAre.how}</p>
        </div>
      </section>

      {/* Vision & mission */}
      <section id="mission" aria-labelledby="mission-h" className="scroll-mt-24 bg-mist py-24 md:py-32">
        <div className="container-x">
          <SectionHead eyebrow="Vision, mission & objectives" title="What we're working toward" tone="teal" />
          <h2 id="mission-h" className="sr-only">
            Vision and mission
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <figure className="rounded-[var(--radius-card)] bg-white p-8 shadow-[0_30px_60px_-40px_rgb(26_60_110/0.45)] ring-1 ring-ink/5 md:p-10">
              <p className="eyebrow text-teal">Vision</p>
              <blockquote className="heading-lg mt-5 text-ink">{vision}</blockquote>
            </figure>
            <figure className="rounded-[var(--radius-card)] bg-teal p-8 text-white md:p-10">
              <p className="eyebrow text-white/80">Mission</p>
              <blockquote className="heading-lg mt-5">{mission}</blockquote>
            </figure>
          </div>
          <h3 className="heading-lg mt-20">Our objectives</h3>
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {objectives.map((o, i) => (
              <li key={o.slice(0, 24)} className={`glass sheen flex gap-4 rounded-3xl p-6 ${i === objectives.length - 1 ? 'md:col-span-2 lg:col-span-3 lg:items-center' : ''}`}>
                <span className="text-4xl leading-none font-bold text-coral [font-family:var(--font-display)]">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[0.9375rem] leading-relaxed text-ink">{o}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* History: the Orbit timeline saved from the homepage review */}
      <StoryOrbit />

      {/* Founders */}
      <section aria-labelledby="founders-h" className="bg-paper py-24 md:py-32">
        <div className="container-x">
          <SectionHead
            eyebrow="Founders"
            title="The founding team"
            intro="GANSID was envisioned and established by Mrs. Lanre Tunji-Ajayi, M.S.M. Other founding members are Dr. Adlette Inati, Mr. Riyad Elbard, Dr. Marimilia Pita, and Dr. Eydith Ortiz."
          />
          <h2 id="founders-h" className="sr-only">
            Founders
          </h2>
          <ul className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {founderPeople.map((p, i) => (
              <li key={p.name} className={i === 0 ? 'col-span-2 md:col-span-1' : ''}>
                <PersonPhoto name={p.name} src={p.photo} className="aspect-[4/5] w-full rounded-3xl" />
                <p className="mt-4 font-semibold text-ink">{p.name}</p>
                <p className="text-sm text-ink-soft">{p.role}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap gap-3">
            <Button href="/about/board" variant="dark">
              Board of Directors
            </Button>
            <Button href="/about/team" variant="ghost">
              The Team
            </Button>
          </div>
        </div>
      </section>

      {/* Regional networks */}
      <section id="regions" aria-labelledby="regions-h" className="relative isolate scroll-mt-24 overflow-hidden bg-mist py-24 md:py-32">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(40%_50%_at_100%_0%,rgb(224_106_80/0.16),transparent)]" />
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end">
            <SectionHead eyebrow="Regional networks" title="Eight regions, one network" intro={regionsIntro.body} tone="coral" />
            <div className="rounded-3xl bg-white p-6 ring-1 ring-ink/5">
              <p className="text-sm font-bold text-ink">Each region is led by a regional lead responsible for:</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                {regionsIntro.leadDuties.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-coral" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <h2 id="regions-h" className="sr-only">
            Regions of the GANSID
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {regions.map((r, i) => (
              <li
                key={r.name}
                className={`relative flex min-h-44 flex-col justify-between overflow-hidden rounded-3xl p-6 ${
                  r.leads ? 'bg-navy text-white' : 'bg-white text-ink ring-1 ring-ink/5'
                }`}
              >
                <div>
                  <p className={`text-5xl leading-none font-bold [font-family:var(--font-display)] ${r.leads ? 'text-coral' : 'text-teal/70'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="heading-lg mt-4">{r.name}</p>
                  {r.code && <p className={`mt-1 text-xs font-bold tracking-[0.14em] ${r.leads ? 'text-white/60' : 'text-ink-soft'}`}>{r.code}</p>}
                </div>
                {r.leads && (
                  <ul className="mt-8 space-y-3">
                    {r.leads.map((l) => (
                      <li key={l.name} className="glass-dark flex items-center gap-3 rounded-2xl p-2 pr-4">
                        <PersonPhoto name={l.name} src={l.photo} className="size-12 shrink-0 rounded-xl" />
                        <span>
                          <span className="block text-sm font-semibold">{l.name}</span>
                          <span className="block text-xs text-white/70">{l.title}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-soft">{regionsIntro.note}</p>
        </div>
      </section>

      {/* Join */}
      <section aria-labelledby="join-h" className="bg-paper py-20">
        <div className="container-x">
          <div className="relative isolate flex flex-col gap-8 overflow-hidden rounded-[2rem] bg-crimson p-8 text-white md:flex-row md:items-center md:justify-between md:p-14">
            <LogoMark mono="#ffffff" className="absolute -top-20 -right-10 -z-10 size-80 opacity-15" />
            <div>
              <h2 id="join-h" className="display-md">
                Join the network
              </h2>
              <p className="lede mt-4 text-white/80">
                Connect with advocates, organizations, and experts at national, regional, and global levels to amplify the voices of millions affected by inherited blood disorders.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/get-involved/membership" variant="light">
                Apply for membership
              </Button>
              <Button href="/get-involved/affiliate" variant="ghost-light">
                Be an affiliate
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

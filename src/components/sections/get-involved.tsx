import Link from 'next/link';
import { involve } from '@/content/site';
import { Eyebrow } from '../ui/eyebrow';
import { ArtFrame, type Tone } from '../ui/art-frame';
import { ArrowRight, ArrowUpRight } from '../ui/icons';

const more = [
  { label: 'Be an affiliate', href: '/get-involved/affiliate' },
  { label: 'Join the global WhatsApp forum', href: '/get-involved/whatsapp' },
  { label: 'Strategic partners', href: '/get-involved/partners' },
  { label: 'Job postings', href: '/get-involved/jobs' },
  { label: 'Read our blog', href: '/blog' },
];

export function GetInvolved() {
  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="container-x">
        <div className="reveal max-w-3xl">
          <Eyebrow>Get involved</Eyebrow>
          <h2 className="display-lg mt-5">
            Be part of the
            <span className="block text-red">network</span>
          </h2>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {involve.map((c, i) => (
            <li key={c.title} className="reveal">
              <Link href={c.href} className="group block h-full">
                <ArtFrame
                  tone={c.tone as Tone}
                  photo={['Member organization meeting', 'Volunteers at an awareness event', 'Families supported by GANSID'][i]}
                  className="flex aspect-[4/5] flex-col justify-end rounded-[var(--radius-panel)] p-7 text-white transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-1.5"
                  markClass="-right-[35%] -top-[20%] w-[110%] transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:rotate-45"
                >
                  <h3 className="font-display text-5xl leading-[0.9] font-bold uppercase">{c.title}</h3>
                  <p className="mt-4 max-w-[34ch] text-white/85">{c.body}</p>
                  <span className="mt-6 grid size-12 place-items-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-1">
                    <ArrowRight className="size-5" />
                  </span>
                </ArtFrame>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex flex-wrap gap-2">
          {more.map((m) => (
            <li key={m.href}>
              <Link href={m.href} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[0.9375rem] font-semibold ring-1 ring-line transition hover:text-crimson hover:ring-red">
                {m.label}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

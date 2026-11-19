import { founders, timeline } from '@/content/site';
import { Eyebrow } from '../ui/eyebrow';

/** Our story as a real, dated sequence (numbered order is information here). */
export function Journey() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-x">
        <div className="reveal grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="display-lg mt-5">
              From a mentorship idea
              <span className="block text-red">to a global network</span>
            </h2>
          </div>
          <p className="text-ink-soft lg:justify-self-end lg:text-right">
            Envisioned and established by Mrs. Lanre Tunji-Ajayi, M.S.M., with co-founders {founders.slice(1).join(', ')}.
          </p>
        </div>

        <ol className="reveal relative mt-16 grid gap-10 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          <span aria-hidden="true" className="absolute top-[0.6rem] left-0 hidden h-0.5 w-full bg-gradient-to-r from-crimson via-red to-coral lg:block" />
          {timeline.map((t, i) => (
            <li key={t.date} className="relative pl-8 lg:pt-10 lg:pl-0">
              <span
                aria-hidden="true"
                className={`absolute top-1 left-0 size-[1.3rem] rounded-full border-4 border-white ring-2 lg:top-0 ${
                  i === timeline.length - 1 ? 'bg-red ring-red' : 'bg-white ring-red/60'
                }`}
              />
              <p className="font-display text-xl font-semibold text-red uppercase tabular-nums">{t.date}</p>
              <h3 className="mt-2 text-lg leading-snug font-bold">{t.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{t.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

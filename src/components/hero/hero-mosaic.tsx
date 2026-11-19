import { HeroCopy } from './hero-copy';

const COLS = [
  ['d1-welcome', 'pf-group-backdrop', 'd2-question', 'pf-stage-wide', 'd1-gansid2026'],
  ['d2-stage', 'd1-booth', 'pf-women-backdrop', 'congress-keynote', 'pf-networking'],
  ['d2-speakers', 'd1-launch', 'pf-question', 'd2-group', 'pf-audience'],
];

/** Real Congress 2026 photography in slow, tilted, opposing columns. */
export function HeroMosaic() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#140a0c] pt-[calc(var(--header-h)+3rem)] pb-20 text-white lg:min-h-[100svh]">
      <div aria-hidden="true" className="absolute inset-y-0 right-[-12%] -z-20 w-[min(78rem,95%)] opacity-90 [perspective:1600px] max-lg:opacity-40">
        <div className="flex h-[140%] -translate-y-[12%] gap-4 [transform:rotateX(14deg)_rotateZ(-12deg)_rotateY(-10deg)]">
          {COLS.map((col, ci) => (
            <div key={ci} className="flex-1 overflow-hidden">
              <div className="flex flex-col gap-4" style={{ animation: `scroll-y ${46 + ci * 8}s linear infinite`, animationDirection: ci % 2 ? 'reverse' : 'normal' }}>
                {[...col, ...col].map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={`/photos/${src}.webp`} alt="" loading={i < 4 ? 'eager' : 'lazy'} className="aspect-[3/4] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-white/10" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, #140a0c 0%, rgb(20 10 12 / 0.92) 34%, rgb(20 10 12 / 0.25) 62%, rgb(155 21 25 / 0.25) 100%), linear-gradient(0deg, #140a0c 0%, transparent 30%)' }} />
      <div className="container-x flex items-center lg:min-h-[calc(100svh-var(--header-h)-3rem)]">
        <HeroCopy />
      </div>
      <p className="glass-dark absolute right-[max(1.25rem,4vw)] bottom-8 hidden rounded-full px-4 py-2 text-xs font-semibold text-white/85 lg:block">
        4th GANSID Congress · HICC Hyderabad · Oct 23–25, 2026
      </p>
    </section>
  );
}

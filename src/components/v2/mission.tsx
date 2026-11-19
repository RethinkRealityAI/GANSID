import { facts, mission, vision } from '@/content/site';
import { CountUp, ScrollWords } from '../motion/split-text';
import { LogoMark } from '../ui/logo-mark';

/** Vision lights up word by word; true facts count up in glass. */
export function Mission() {
  return (
    <section aria-label="Vision and mission" className="relative isolate overflow-hidden bg-paper py-24 md:py-36">
      <LogoMark mono="rgb(215 38 46 / 0.06)" title="" className="pointer-events-none absolute -top-40 -right-40 -z-10 w-[46rem] animate-[spin-slow_120s_linear_infinite]" />
      <div className="container-x">
        <p className="eyebrow text-red">Our vision</p>
        <ScrollWords text={vision} className="mt-6 max-w-[24ch] font-sans text-[clamp(2rem,4.4vw,4.5rem)] leading-[1.05] font-semibold tracking-[-0.035em]" />
        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-end">
          <div className="reveal">
            <p className="eyebrow text-ink-soft">Our mission</p>
            <p className="lede mt-4 text-ink-soft">{mission}</p>
          </div>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {facts.map((f, i) => (
              <li
                key={f.label}
                className="reveal glass rounded-[var(--radius-card)] p-5 [background:linear-gradient(135deg,rgb(251_234_232/0.9),rgb(255_255_255/0.5))]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CountUp value={f.value} className="font-display block text-5xl leading-none font-bold text-crimson md:text-6xl" />
                <span className="mt-3 block text-sm font-semibold text-ink-soft">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import type { ReactNode } from 'react';
import { LogoMark } from './logo-mark';

export type Tone = 'red' | 'crimson' | 'navy' | 'teal' | 'coral' | 'ink';

export const toneBg: Record<Tone, string> = {
  red: 'bg-red',
  crimson: 'bg-crimson',
  navy: 'bg-navy',
  teal: 'bg-teal',
  coral: 'bg-coral',
  ink: 'bg-ink',
};

/**
 * Art-directed stand-in for photography. Renders a brand-coloured field with
 * an oversized fragment of the logo mark. Pass `photo` (a short description)
 * to label which real image belongs here once GANSID supplies the library.
 */
export function ArtFrame({
  tone = 'red',
  photo,
  className = '',
  children,
  markClass = '-right-[22%] -bottom-[30%] w-[85%]',
}: {
  tone?: Tone;
  photo?: string;
  className?: string;
  children?: ReactNode;
  markClass?: string;
}) {
  return (
    <div className={`grain relative overflow-hidden ${toneBg[tone]} ${className}`}>
      <LogoMark mono="rgb(255 255 255 / 0.13)" className={`pointer-events-none absolute ${markClass}`} title="" />
      {photo && (
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-[0.6875rem] font-semibold tracking-wide text-white/90 backdrop-blur-sm">
          <svg viewBox="0 0 16 16" className="size-3" aria-hidden="true">
            <path d="M2 4.5h2.5l1-1.5h5l1 1.5H14v8H2z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            <circle cx="8" cy="8.3" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          Photo: {photo}
        </span>
      )}
      {children}
    </div>
  );
}

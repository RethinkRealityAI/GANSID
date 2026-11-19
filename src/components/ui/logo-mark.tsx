import type { CSSProperties } from 'react';

/**
 * Vector re-drawing of the GANSID mark: four arcs (the network, holding hands)
 * around four droplets. Used decoratively at large sizes and animated in the hero.
 * For the official lock-up use /brand/gansid-logo-landscape.png.
 */
const ARCS = [
  { rot: 0, color: 'var(--color-crimson)' },
  { rot: 90, color: 'var(--color-garnet)' },
  { rot: 180, color: 'var(--color-red)' },
  { rot: 270, color: 'var(--color-coral)' },
];

const DROP = 'M0 -15 C 5 -6 10 0 10 6 A 10 10 0 1 1 -10 6 C -10 0 -5 -6 0 -15 Z';

export function LogoMark({
  className,
  animated = false,
  mono,
  style,
  title = 'GANSID',
}: {
  className?: string;
  animated?: boolean;
  /** Render every part in one colour (e.g. white on a red panel) */
  mono?: string;
  style?: CSSProperties;
  title?: string;
}) {
  return (
    <svg viewBox="-110 -110 220 220" className={className} style={style} role="img" aria-label={title}>
      <g
        style={
          animated
            ? { animation: 'spin-slow 60s linear infinite', transformOrigin: 'center', transformBox: 'fill-box' }
            : undefined
        }
      >
        {ARCS.map((a) => (
          <path
            key={a.rot}
            d="M -46 -88 Q -24 -36 40 -40"
            fill="none"
            stroke={mono ?? a.color}
            strokeWidth={15}
            strokeLinecap="butt"
            transform={`rotate(${a.rot})`}
          />
        ))}
      </g>
      {ARCS.map((a, i) => (
        <g key={`d${a.rot}`} transform={`rotate(${a.rot}) translate(6 -70)`}>
          <path
            d={DROP}
            fill={mono ?? 'var(--color-red)'}
            transform={`rotate(${-a.rot})`}
            style={
              animated
                ? {
                    animation: `drop-pulse 3.6s var(--ease-out-expo) ${i * 0.45}s infinite`,
                    transformOrigin: 'center',
                    transformBox: 'fill-box',
                  }
                : undefined
            }
          />
        </g>
      ))}
    </svg>
  );
}

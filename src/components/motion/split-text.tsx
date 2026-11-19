'use client';

import { Fragment, useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { useInView } from '@/lib/hooks';

/**
 * Headline that rises in word by word (masked per line) when it enters view.
 * `lines` lets callers colour individual lines. Text is real DOM text.
 */
export function SplitText({
  lines,
  as: Tag = 'h2',
  className = '',
  delay = 0,
}: {
  lines: { text: string; className?: string }[];
  as?: ElementType;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView<HTMLElement>('0px 0px -8% 0px');
  let i = 0;
  return (
    <Tag ref={ref} className={`${className} ${inView ? 'split-anim' : ''}`} aria-label={lines.map((l) => l.text).join(' ')}>
      {lines.map((l, li) => (
        <span key={li} className={`split-line ${l.className ?? ''}`} aria-hidden="true">
          {l.text.split(' ').map((w, wi) => (
            <Fragment key={wi}>
              <span className="split-word" style={{ ['--i' as string]: i++, ['--d' as string]: `${delay}ms` }}>
                {w}
              </span>{' '}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}

/** Paragraph whose words light up as the reader scrolls through it. */
export function ScrollWords({ text, className = '' }: { text: string; className?: string }) {
  return <ScrollWordsInner text={text} className={className} />;
}

function ScrollWordsInner({ text, className }: { text: string; className: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = [...el.querySelectorAll<HTMLSpanElement>('[data-w]')];
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const start = innerHeight * 0.85;
      const end = innerHeight * 0.35;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height * 0.6)));
      const lit = p * words.length;
      words.forEach((w, i) => {
        const v = Math.min(1, Math.max(0, lit - i));
        w.style.opacity = String(0.16 + v * 0.84);
      });
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    addEventListener('scroll', on, { passive: true });
    return () => {
      removeEventListener('scroll', on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          <span data-w style={{ transition: 'opacity .25s linear' }}>
            {w}
          </span>{' '}
        </Fragment>
      ))}
    </p>
  );
}

/** Number that counts up once visible. Non-numeric values render as-is. */
export function CountUp({ value, className = '' }: { value: string; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const m = value.match(/^(\d+)(.*)$/);
  const target = m ? parseInt(m[1], 10) : null;
  const elRef = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (!inView || target === null || !elRef.current) return;
    const el = elRef.current;
    const from = target > 1000 ? target - 30 : 0;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 1400);
      const e = 1 - Math.pow(1 - k, 4);
      el.textContent = String(Math.round(from + (target - from) * e)) + (m?.[2] ?? '');
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, m]);
  return (
    <span
      ref={(n) => {
        ref.current = n;
        elRef.current = n;
      }}
      className={`tabular-nums ${className}`}
    >
      {value}
    </span>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

import type { ReactNode } from 'react';
import { Drop } from './icons';

/** Section label. The droplet is the brand's bullet, used only here. */
export function Eyebrow({ children, tone = 'red', className = '' }: { children: ReactNode; tone?: 'red' | 'light'; className?: string }) {
  return (
    <p className={`eyebrow inline-flex items-center gap-2 ${tone === 'light' ? 'text-white/80' : 'text-ink-soft'} ${className}`}>
      <Drop className={`size-3 ${tone === 'light' ? 'text-white' : 'text-red'}`} />
      {children}
    </p>
  );
}

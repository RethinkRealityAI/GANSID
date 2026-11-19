'use client';

import { useState } from 'react';

/** Portrait with an initials fallback when the image can't load. */
export function PersonPhoto({ name, src, className = '' }: { name: string; src?: string; className?: string }) {
  const [failed, setFailed] = useState(!src);
  const initials = name
    .replace(/^(Mrs?\.|Ms\.|Dr\.?|Prof\.)\s*/i, '')
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
  return (
    <span className={`relative grid place-items-center overflow-hidden bg-navy text-white ${className}`}>
      {failed ? (
        <span aria-hidden="true" className="text-2xl font-bold [font-family:var(--font-display)]">
          {initials}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover object-top" />
      )}
    </span>
  );
}

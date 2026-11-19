'use client';

import { useState } from 'react';
import { LogoMark } from '../ui/logo-mark';

/** Newsletter capture. Submission wiring (Mailchimp/Resend) is TODO. */
export function Newsletter() {
  const [state, setState] = useState<'idle' | 'done'>('idle');
  return (
    <section className="grain relative overflow-hidden bg-navy text-white">
      <LogoMark mono="rgb(255 255 255 / 0.08)" className="pointer-events-none absolute -top-24 -right-24 w-[30rem]" title="" />
      <div className="container-x relative grid gap-8 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:py-20">
        <div>
          <h2 className="heading-xl max-w-[18ch]">Stay close to the network</h2>
          <p className="mt-4 max-w-md text-white/80">
            Congress news, new courses, clinical trial updates and stories from member organizations. Monthly, never spam.
          </p>
        </div>
        {state === 'done' ? (
          <p role="status" className="rounded-full bg-white/10 px-6 py-4 font-semibold">
            Thanks. Check your inbox to confirm your subscription.
          </p>
        ) : (
          <form
            className="flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:rounded-full sm:bg-white sm:p-1.5 md:justify-self-end"
            onSubmit={(e) => {
              e.preventDefault();
              setState('done');
            }}
          >
            <label htmlFor="nl-email" className="sr-only">
              Email address
            </label>
            <input
              id="nl-email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@organization.org"
              className="h-14 min-w-0 shrink-0 rounded-full bg-white px-6 sm:shrink sm:flex-1 text-ink placeholder:text-muted focus:outline-none sm:h-12"
            />
            <button type="submit" className="h-14 rounded-full bg-red px-7 font-semibold transition hover:bg-crimson sm:h-12">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

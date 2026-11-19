'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { nav } from '@/content/site';
import { Button } from './ui/button';
import { LogoMark } from './ui/logo-mark';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setMenu(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
      <div className="container-x">
        <div
          className={`flex h-16 items-center justify-between gap-4 rounded-full pr-2 pl-5 transition-all duration-500 ease-[var(--ease-out-expo)] ${
            scrolled || open
              ? 'glass bg-white/80'
              : 'glass'
          }`}
        >
          <Link href="/" className="flex shrink-0 items-center" aria-label="GANSID home">
            <Image
              src="/brand/gansid-logo-landscape.png"
              alt="Global Action Network for Sickle Cell and Other Inherited Blood Disorders"
              width={4920}
              height={1320}
              priority
              className="hidden h-12 w-auto sm:block"
            />
            <span className="flex items-center gap-2 sm:hidden">
              <LogoMark className="size-9" />
              <span className="font-display text-2xl leading-none font-bold tracking-wide">GANSID</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block" onMouseLeave={() => setMenu(null)}>
            <ul className="flex items-center gap-1">
              {nav.map((g) => (
                <li key={g.label} className="relative" onMouseEnter={() => setMenu(g.children ? g.label : null)}>
                  {g.children ? (
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.9375rem] font-semibold text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink"
                      aria-expanded={menu === g.label}
                      onClick={() => setMenu(menu === g.label ? null : g.label)}
                    >
                      {g.label}
                      <svg viewBox="0 0 12 12" className={`size-3 transition-transform ${menu === g.label ? 'rotate-180' : ''}`} aria-hidden="true">
                        <path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ) : (
                    <Link href={g.href} className="block rounded-full px-3.5 py-2 text-[0.9375rem] font-semibold text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink">
                      {g.label}
                    </Link>
                  )}
                  {g.children && menu === g.label && (
                    <div className="absolute top-full left-1/2 w-72 -translate-x-1/2 pt-3">
                      <ul className="glass rounded-3xl p-2">
                        {g.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="block rounded-2xl px-4 py-2.5 text-[0.9375rem] font-medium text-ink/80 transition-colors hover:bg-blush hover:text-crimson">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <Button href="/donate">Donate</Button>
            </span>
            <button
              type="button"
              className="grid size-12 place-items-center rounded-full bg-ink text-white lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-0 bottom-0 -z-10 overflow-y-auto bg-white pt-28 pb-[max(2rem,env(safe-area-inset-bottom,0px))] lg:hidden">
          <nav aria-label="Mobile" className="container-x">
            <ul className="divide-y divide-line">
              {nav.map((g) => (
                <li key={g.label} className="py-4">
                  <Link href={g.href} onClick={() => setOpen(false)} className="font-display text-4xl font-bold uppercase">
                    {g.label}
                  </Link>
                  {g.children && (
                    <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                      {g.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} onClick={() => setOpen(false)} className="text-ink-soft hover:text-crimson">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <Button href="/donate" size="lg" className="mt-8">
              Donate today
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

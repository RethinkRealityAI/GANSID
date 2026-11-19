import Image from 'next/image';
import Link from 'next/link';
import { contact, nav } from '@/content/site';
import { Button } from './ui/button';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="container-x pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
          <div>
            <div className="inline-block rounded-2xl bg-white px-4 py-3">
              <Image src="/brand/gansid-logo-landscape.png" alt="GANSID" width={4920} height={1320} className="h-10 w-auto" />
            </div>
            <p className="mt-6 max-w-sm text-white/70">
              Global Action Network for Sickle Cell &amp; Other Inherited Blood Disorders. A U.S. <span className="[font-variant-ligatures:none]">501(c)(3)</span> charity,
              registered in Canada.
            </p>
            <Button href="/donate" size="lg" className="mt-8">
              Donate today
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {nav
              .filter((g) => g.children)
              .map((g) => (
                <div key={g.label}>
                  <p className="eyebrow text-white/50">{g.label}</p>
                  <ul className="mt-4 space-y-2.5">
                    {g.children!.slice(0, 5).map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="text-[0.9375rem] text-white/80 transition-colors hover:text-coral">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <address className="not-italic">
            {contact.address}
            <br />
            <span className="select-all">{contact.email}</span>
          </address>
          <ul className="flex flex-wrap gap-2">
            {contact.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full px-3 py-1.5 ring-1 ring-white/15 transition hover:text-white hover:ring-white/50">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p>
            © {year} GANSID · <Link href="/policies" className="hover:text-white">Policies</Link> ·{' '}
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
          </p>
        </div>
      </div>
      <p aria-hidden="true" className="text-outline pointer-events-none -mb-[0.18em] text-center font-display text-[24vw] leading-[0.8] font-bold uppercase select-none">
        GANSID
      </p>
    </footer>
  );
}

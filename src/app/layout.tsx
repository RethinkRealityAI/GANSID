import type { Metadata, Viewport } from 'next';
import '@fontsource/barlow-condensed/500.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource-variable/manrope';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { VariantProvider } from '@/lib/variants';
import { SmoothScroll } from '@/components/motion/smooth-scroll';

export const metadata: Metadata = {
  title: {
    default: 'GANSID · Global Action Network for Sickle Cell & Other Inherited Blood Disorders',
    template: '%s · GANSID',
  },
  description:
    'GANSID unites patient organizations, health care providers, researchers and partners to advance advocacy, training and care for sickle cell disease and other inherited blood disorders.',
  icons: { icon: '/brand/gansid-logo-stacked.png' },
};

export const viewport: Viewport = {
  themeColor: '#d7262e',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white">
          Skip to content
        </a>
        <VariantProvider>
          <SmoothScroll />
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </VariantProvider>
      </body>
    </html>
  );
}

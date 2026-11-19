import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export keeps the marketing site fast, cheap to host and CDN-friendly.
  // Switch off if we later need server features (forms API, ISR from a CMS).
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;

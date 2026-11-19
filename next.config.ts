import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  // No static export any more: the CMS, previews and form APIs need a server.
  // Public pages are still cached and refreshed on publish (see src/hooks/revalidate.ts).
  images: { unoptimized: true },
  trailingSlash: true,
};

export default withPayload(nextConfig, { devBundleServerPackages: false });

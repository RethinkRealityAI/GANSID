'use client';
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';

/** In draft preview, re-render the page each time the editor's changes autosave. */
export function LiveRefresh() {
  const router = useRouter();
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={process.env.NEXT_PUBLIC_SITE_URL ?? ''} />;
}

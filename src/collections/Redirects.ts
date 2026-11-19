import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload';
import { revalidatePath, revalidateTag } from 'next/cache';
import { canEditContent, isStaff } from '@/access/roles';
import { normalizePath } from '@/lib/paths';

export const REDIRECTS_CACHE_TAG = 'redirects';

/** Clear the cached redirect table and the old address, so a change works immediately. */
const refresh = (paths: (string | null | undefined)[]) => {
  try {
    revalidateTag(REDIRECTS_CACHE_TAG, { expire: 0 });
    for (const p of paths) if (p) revalidatePath(p);
  } catch {
    // Outside a Next.js request (import scripts) there is nothing to refresh.
  }
};

const afterChange: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (!req.context?.disableRevalidate) refresh([doc.from, previousDoc?.from]);
  return doc;
};
const afterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  refresh([doc.from]);
  return doc;
};

/**
 * Old addresses (mostly from the WordPress site) and where they now live. Checked only when
 * no page exists at the address, so a real page always wins over a redirect.
 */
export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: { singular: 'Redirect', plural: 'Redirects' },
  admin: {
    hideAPIURL: true,
    group: 'Settings',
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'type'],
    listSearchableFields: ['from', 'to'],
    description: 'Sends visitors from an old address to the new one, so old links and search results keep working.',
  },
  defaultSort: 'from',
  access: { read: isStaff, create: canEditContent, update: canEditContent, delete: canEditContent },
  hooks: { afterChange: [afterChange], afterDelete: [afterDelete] },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Old address',
      admin: { description: 'e.g. /board-of-directors. You can paste a full old URL; it is trimmed to the path.' },
      hooks: { beforeValidate: [({ value }) => (typeof value === 'string' && value.trim() ? normalizePath(value) : value)] },
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      label: 'New address',
      admin: { description: 'A path on this site (e.g. /about) or a full URL to another website.' },
      validate: (value: unknown) =>
        typeof value === 'string' && (value.startsWith('/') || /^https?:\/\//.test(value))
          ? true
          : 'Start with / for a page on this site, or https:// for another website.',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: '301',
      label: 'Kind of redirect',
      options: [
        { label: 'Permanent (moved for good)', value: '301' },
        { label: 'Temporary', value: '302' },
      ],
      admin: { description: 'Use Permanent unless the old address will come back.' },
    },
  ],
};

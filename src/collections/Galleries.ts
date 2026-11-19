import type { CollectionConfig } from 'payload';
import { canEditContent, publishedOrStaff } from '@/access/roles';
import { slugField } from '@/fields/slug';
import { revalidateDelete, revalidateDoc } from '@/hooks/revalidate';
import { sitePath } from '@/lib/paths';

const pathFor = (doc: { slug?: string | null }) => sitePath('galleries', doc.slug);

/** Photo albums. Either upload the photos here, or link to the full album on Picflow (or both). */
export const Galleries: CollectionConfig = {
  slug: 'galleries',
  labels: { singular: 'Photo gallery', plural: 'Photo galleries' },
  admin: {
    hideAPIURL: true,
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'event', 'congress', '_status'],
    description: 'Photo albums from events and the Congress.',
  },
  defaultSort: '-date',
  access: { read: publishedOrStaff, create: canEditContent, update: canEditContent, delete: canEditContent },
  versions: { drafts: { autosave: { interval: 800 } }, maxPerDoc: 25 },
  hooks: { afterChange: [revalidateDoc(pathFor, '/galleries')], afterDelete: [revalidateDelete(pathFor, '/galleries')] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'date', type: 'date', admin: { width: '34%', date: { pickerAppearance: 'dayOnly' }, description: 'When the photos were taken.' } },
        {
          name: 'event',
          type: 'relationship',
          relationTo: 'events',
          admin: { width: '33%', description: 'Optional: the event these photos are from.' },
        },
        {
          name: 'congress',
          type: 'relationship',
          relationTo: 'congress-editions',
          admin: { width: '33%', description: 'Optional: the Congress these photos are from.' },
        },
      ],
    },
    {
      name: 'externalAlbumUrl',
      type: 'text',
      label: 'Link to the full album',
      admin: { description: 'Optional, e.g. the Picflow album. Shown as a "See all photos" button.' },
    },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Cover image', admin: { description: 'Shown on gallery cards. Defaults to the first photo.' } },
    {
      name: 'images',
      type: 'array',
      label: 'Photos',
      labels: { singular: 'Photo', plural: 'Photos' },
      admin: { description: 'Drag to reorder.', initCollapsed: true },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text', localized: true },
      ],
    },
    slugField(),
    {
      type: 'collapsible',
      label: 'Old website (imported)',
      admin: { initCollapsed: true, description: 'Filled in by the import from the old WordPress site. You can ignore this.' },
      fields: [
        {
          name: 'legacyUrls',
          type: 'array',
          label: 'Old web addresses',
          admin: { readOnly: true },
          fields: [{ name: 'url', type: 'text', required: true }],
        },
        {
          name: 'legacyCoverUrl',
          type: 'text',
          label: 'Old cover image address',
          admin: { description: 'Upload it as the cover above, then clear this.' },
        },
        {
          name: 'legacyImages',
          type: 'array',
          label: 'Photos not uploaded yet',
          admin: { description: 'Photos on the old site that still need uploading. Delete each row once uploaded above.' },
          fields: [
            { name: 'url', type: 'text', required: true },
            { name: 'alt', type: 'text' },
          ],
        },
      ],
    },
  ],
};

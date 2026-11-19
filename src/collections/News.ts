import type { CollectionConfig } from 'payload';
import { canEditContent, publishedOrStaff } from '@/access/roles';
import { seoField, slugField } from '@/fields/slug';
import { revalidateDelete, revalidateDoc } from '@/hooks/revalidate';
import { previewUrl } from '@/lib/preview';

const pathFor = (doc: { slug?: string | null }) => `/news/${doc.slug ?? ''}`;

export const NEWS_CATEGORIES = [
  { label: 'News', value: 'news' },
  { label: 'Press release', value: 'press-release' },
  { label: 'Advocacy', value: 'advocacy' },
  { label: 'Research & treatment', value: 'research' },
  { label: 'Congress', value: 'congress' },
  { label: 'Awareness day', value: 'awareness' },
];

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News story', plural: 'News' },
  admin: {
    hideAPIURL: true,
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    livePreview: { url: ({ data }) => previewUrl('news', data?.slug as string | undefined) },
    preview: (doc) => previewUrl('news', doc?.slug as string | undefined),
  },
  defaultSort: '-publishedAt',
  access: { read: publishedOrStaff, create: canEditContent, update: canEditContent, delete: canEditContent },
  versions: { drafts: { autosave: { interval: 800 }, schedulePublish: true }, maxPerDoc: 50 },
  hooks: { afterChange: [revalidateDoc(pathFor, '/news')], afterDelete: [revalidateDelete(pathFor, '/news')] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      label: 'Summary',
      maxLength: 280,
      admin: { description: 'Shown on news cards and in search results. One or two sentences.' },
    },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Cover image' },
    { name: 'body', type: 'richText', required: true, localized: true, label: 'Story' },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'category', type: 'select', options: NEWS_CATEGORIES, defaultValue: 'news', admin: { position: 'sidebar' } },
    {
      name: 'legacyUrl',
      type: 'text',
      label: 'Old website address',
      admin: { position: 'sidebar', readOnly: true, description: 'Address on the old WordPress site (for redirects).' },
    },
    slugField(),
    seoField,
  ],
};

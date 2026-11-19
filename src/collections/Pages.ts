import type { CollectionConfig } from 'payload';
import { canEditContent, publishedOrStaff } from '@/access/roles';
import { pageBlocks } from '@/blocks';
import { seoField, slugField } from '@/fields/slug';
import { revalidateDelete, revalidateDoc } from '@/hooks/revalidate';
import { previewUrl } from '@/lib/preview';

const pathFor = (doc: { slug?: string | null }) => `/${doc.slug ?? ''}`;

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    hideAPIURL: true,
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description: 'General pages built from blocks. Pages with a custom design (Home, About, Disorders) are edited in their own sections.',
    livePreview: { url: ({ data }) => previewUrl('pages', data?.slug as string | undefined) },
    preview: (doc) => previewUrl('pages', doc?.slug as string | undefined),
  },
  access: { read: publishedOrStaff, create: canEditContent, update: canEditContent, delete: canEditContent },
  versions: { drafts: { autosave: { interval: 800 }, schedulePublish: true }, maxPerDoc: 50 },
  hooks: { afterChange: [revalidateDoc(pathFor)], afterDelete: [revalidateDelete(pathFor)] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'layout', type: 'blocks', label: 'Page content', blocks: pageBlocks, required: true, minRows: 1 },
    slugField(),
    seoField,
  ],
};

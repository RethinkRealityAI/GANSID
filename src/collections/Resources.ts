import type { CollectionConfig } from 'payload';
import { canEditContent, publishedOrStaff } from '@/access/roles';
import { slugField } from '@/fields/slug';
import { legacyFields } from '@/fields/legacy';
import { revalidateDelete, revalidateDoc } from '@/hooks/revalidate';
import { sitePath } from '@/lib/paths';

const pathFor = (doc: { slug?: string | null }) => sitePath('resources', doc.slug);

export const RESOURCE_TYPES = [
  { label: 'Toolkit', value: 'toolkit' },
  { label: 'Guide', value: 'guide' },
  { label: 'PDF document', value: 'pdf' },
  { label: 'Video', value: 'video' },
  { label: 'Webcast', value: 'webcast' },
  { label: 'E-book', value: 'ebook' },
  { label: 'Presentation', value: 'presentation' },
  { label: 'Podcast', value: 'podcast' },
];

/** Topics match the disorder groups used on the old Resources section. */
export const RESOURCE_TOPICS = [
  { label: 'Sickle cell disease', value: 'sickle-cell' },
  { label: 'Thalassemia', value: 'thalassemia' },
  { label: 'Bleeding disorders (incl. hemophilia)', value: 'bleeding-disorders' },
  { label: 'Bone marrow failure (aplastic & Fanconi anemia)', value: 'bone-marrow-failure' },
  { label: 'Red cell enzyme disorders (PKD, G6PD)', value: 'enzymopathies' },
  { label: 'Hereditary spherocytosis', value: 'hereditary-spherocytosis' },
  { label: 'Clinical trials & research', value: 'clinical-trials' },
  { label: 'Advocacy', value: 'advocacy' },
  { label: 'Congress', value: 'congress' },
];

export const Resources: CollectionConfig = {
  slug: 'resources',
  labels: { singular: 'Resource', plural: 'Resources' },
  admin: {
    hideAPIURL: true,
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'topics', '_status'],
    description: 'Toolkits, guides, PDFs, videos and webcasts for the Resources section.',
  },
  defaultSort: '-publishedAt',
  access: { read: publishedOrStaff, create: canEditContent, update: canEditContent, delete: canEditContent },
  versions: { drafts: { autosave: { interval: 800 } }, maxPerDoc: 25 },
  hooks: { afterChange: [revalidateDoc(pathFor, '/resources')], afterDelete: [revalidateDelete(pathFor, '/resources')] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'type', type: 'select', options: RESOURCE_TYPES, required: true, admin: { width: '50%' } },
        {
          name: 'topics',
          type: 'select',
          hasMany: true,
          options: RESOURCE_TOPICS,
          admin: { width: '50%', description: 'Used for the filters on the Resources page.' },
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      maxLength: 400,
      admin: { description: 'What it is and who it is for, in a sentence or two.' },
    },
    {
      name: 'source',
      type: 'radio',
      label: 'Where is it?',
      defaultValue: 'link',
      options: [
        { label: 'A link (YouTube, Google Drive, another website…)', value: 'link' },
        { label: 'A file uploaded here', value: 'file' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      label: 'Link',
      admin: { condition: (d) => d?.source !== 'file' },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (d) => d?.source === 'file', description: 'PDFs and images only. Put videos on YouTube or Vimeo and link them.' },
    },
    { name: 'thumbnail', type: 'upload', relationTo: 'media', admin: { description: 'Optional preview image.' } },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    slugField(),
    legacyFields(),
  ],
};

import type { CollectionConfig } from 'payload';
import { canEditContent } from '@/access/roles';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image or file', plural: 'Media library' },
  admin: {
    hideAPIURL: true, group: 'Website', description: 'Photos, logos and documents used across the site.' },
  access: { read: () => true, create: canEditContent, update: canEditContent, delete: canEditContent },
  upload: {
    // Local disk in development. Production must use the Supabase Storage (S3) adapter:
    // Netlify's filesystem is not persistent.
    staticDir: 'media',
    focalPoint: true,
    crop: true,
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumb', width: 480 },
      { name: 'card', width: 960 },
      { name: 'wide', width: 1920 },
    ],
    adminThumbnail: 'thumb',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      label: 'Describe the image',
      admin: { description: 'One sentence for people using screen readers, e.g. "Delegates at the 2026 Congress in Hyderabad".' },
    },
    { name: 'credit', type: 'text', label: 'Photo credit (optional)' },
  ],
};

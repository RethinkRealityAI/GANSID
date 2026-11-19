import type { CollectionConfig } from 'payload';
import { canEditContent } from '@/access/roles';
import { slugField } from '@/fields/slug';
import { legacyFields } from '@/fields/legacy';

/** GANSID's regional networks (based on the WHO regions, with the Americas split in three). */
export const Regions: CollectionConfig = {
  slug: 'regions',
  labels: { singular: 'Region', plural: 'Regions' },
  admin: {
    hideAPIURL: true,
    group: 'Network',
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'order'],
    description: 'The GANSID regional networks. Board members, member organizations and people can be linked to a region.',
  },
  defaultSort: 'order',
  access: { read: () => true, create: canEditContent, update: canEditContent, delete: canEditContent },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true, admin: { description: 'e.g. "African Region".' } },
    {
      type: 'row',
      fields: [
        {
          name: 'code',
          type: 'text',
          unique: true,
          label: 'Short code',
          admin: { width: '50%', description: 'e.g. AFR, SEAR. Leave empty if the region has none.' },
        },
        {
          name: 'order',
          type: 'number',
          label: 'Order in lists',
          admin: { width: '50%', description: 'Lower numbers come first.' },
        },
      ],
    },
    { name: 'description', type: 'richText', localized: true, admin: { description: 'Optional. Shown on the region page.' } },
    slugField('name'),
    legacyFields(),
  ],
};

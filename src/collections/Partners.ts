import type { CollectionConfig } from 'payload';
import { canEditContent } from '@/access/roles';
import { legacyFields } from '@/fields/legacy';

export const PARTNER_TYPES = [
  { label: 'Strategic partner', value: 'strategic' },
  { label: 'Collaborator', value: 'collaborator' },
  { label: 'Industry sponsor', value: 'sponsor' },
];

/**
 * Partners and sponsors. Which Congress each one sponsored, and at which tier, is set on the
 * Congress edition (tiers change year to year); it is shown here read-only.
 */
export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Partner or sponsor', plural: 'Partners & sponsors' },
  admin: {
    hideAPIURL: true,
    group: 'Network',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'tier', 'website'],
    description: 'Organizations that partner with or sponsor GANSID.',
  },
  defaultSort: 'name',
  access: { read: () => true, create: canEditContent, update: canEditContent, delete: canEditContent },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    {
      type: 'row',
      fields: [
        { name: 'type', type: 'select', hasMany: true, options: PARTNER_TYPES, admin: { width: '50%' } },
        {
          name: 'tier',
          type: 'select',
          label: 'Partnership tier',
          options: [
            { label: 'Platinum', value: 'platinum' },
            { label: 'Gold', value: 'gold' },
            { label: 'Silver', value: 'silver' },
            { label: 'Bronze', value: 'bronze' },
            { label: 'Supporter', value: 'supporter' },
          ],
          admin: {
            width: '50%',
            description: 'Overall partnership level (optional). Congress sponsorship tiers are set per year on the Congress edition.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'logo', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
        { name: 'website', type: 'text', admin: { width: '50%', placeholder: 'https://' } },
      ],
    },
    {
      name: 'congressSponsorships',
      type: 'join',
      collection: 'congress-editions',
      on: 'sponsors.partner',
      label: 'Congress years sponsored',
      admin: { defaultColumns: ['title', 'year'], description: 'Set on each Congress edition, under Sponsors.' },
    },
    legacyFields({ imageLabel: 'Old logo address' }),
  ],
};

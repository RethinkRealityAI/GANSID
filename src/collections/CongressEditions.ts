import type { CollectionConfig } from 'payload';
import { canEditContent, publishedOrStaff } from '@/access/roles';
import { seoField } from '@/fields/slug';
import { legacyFields } from '@/fields/legacy';
import { revalidateDelete, revalidateDoc } from '@/hooks/revalidate';
import { sitePath } from '@/lib/paths';

const pathFor = (doc: { slug?: string | null }) => sitePath('congress-editions', doc.slug);

export const SPONSOR_TIERS = [
  { label: 'Platinum', value: 'platinum' },
  { label: 'Gold', value: 'gold' },
  { label: 'Silver', value: 'silver' },
  { label: 'Bronze', value: 'bronze' },
  { label: 'Supporter (other)', value: 'supporter' },
];

const peopleList = (name: string, label: string, description: string) => ({
  name,
  label,
  type: 'relationship' as const,
  relationTo: 'people' as const,
  hasMany: true,
  admin: { description: `${description} Drag to change the order shown on the site.` },
});

/** One record per year of the GANSID Congress. Its page lives at /congress/<year>. */
export const CongressEditions: CollectionConfig = {
  slug: 'congress-editions',
  labels: { singular: 'Congress edition', plural: 'Congress editions' },
  admin: {
    hideAPIURL: true,
    group: 'Congress',
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'startDate', '_status'],
    description: 'Each year of the GANSID Congress: dates, venue, speakers, sponsors and photos.',
  },
  defaultSort: '-year',
  access: { read: publishedOrStaff, create: canEditContent, update: canEditContent, delete: canEditContent },
  versions: { drafts: { autosave: { interval: 800 }, schedulePublish: true }, maxPerDoc: 50 },
  hooks: { afterChange: [revalidateDoc(pathFor, '/congress')], afterDelete: [revalidateDelete(pathFor, '/congress')] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true, admin: { description: 'e.g. "GANSID Congress 2026".' } },
            {
              type: 'row',
              fields: [
                { name: 'year', type: 'number', required: true, unique: true, index: true, admin: { width: '33%' } },
                {
                  name: 'number',
                  type: 'number',
                  label: 'Edition number',
                  min: 1,
                  admin: { width: '33%', description: '1 for the 1st (inaugural) Congress, 4 for the 4th…' },
                },
                {
                  name: 'format',
                  type: 'select',
                  options: [
                    { label: 'In person', value: 'in-person' },
                    { label: 'Virtual', value: 'virtual' },
                    { label: 'Hybrid', value: 'hybrid' },
                  ],
                  admin: { width: '34%' },
                },
              ],
            },
            { name: 'theme', type: 'text', localized: true, admin: { description: 'The Congress theme, word for word.' } },
            {
              type: 'row',
              fields: [
                { name: 'startDate', type: 'date', label: 'First day', admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
                { name: 'endDate', type: 'date', label: 'Last day', admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'venue', type: 'text', admin: { width: '40%', description: 'Leave empty for a virtual Congress.' } },
                { name: 'city', type: 'text', admin: { width: '30%' } },
                { name: 'country', type: 'text', admin: { width: '30%' } },
              ],
            },
            { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Banner image' },
            { name: 'about', type: 'richText', localized: true, label: 'About this Congress' },
            {
              type: 'row',
              fields: [
                {
                  name: 'registrationUrl',
                  type: 'text',
                  label: 'Registration link',
                  admin: { width: '50%', description: 'Leave empty once registration has closed.' },
                },
                { name: 'programUrl', type: 'text', label: 'Program link', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'People',
          fields: [
            peopleList('speakers', 'Speakers', 'Everyone who spoke or presented.'),
            peopleList('moderators', 'Moderators', 'Session moderators and chairs.'),
            peopleList('scientificCommittee', 'Scientific program committee', 'Committee members for this year.'),
            peopleList('planningTeam', 'Planning team', 'The Congress planning team (including the local planning team).'),
          ],
        },
        {
          label: 'Sponsors',
          fields: [
            {
              name: 'sponsors',
              type: 'array',
              labels: { singular: 'Sponsor', plural: 'Sponsors' },
              admin: { description: 'Sponsors of this year, in the order shown. Add the organization under Partners & sponsors first.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'partner', type: 'relationship', relationTo: 'partners', required: true, admin: { width: '60%' } },
                    { name: 'tier', type: 'select', options: SPONSOR_TIERS, admin: { width: '40%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Photos',
          fields: [
            {
              name: 'galleries',
              type: 'join',
              collection: 'galleries',
              on: 'congress',
              label: 'Photo galleries',
              admin: { description: 'Galleries linked to this Congress. Link a gallery from the gallery itself.' },
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      label: 'Web address',
      admin: { position: 'sidebar', readOnly: true, description: 'Set from the year: /congress/<year>.' },
      hooks: { beforeValidate: [({ data, value }) => (data?.year ? String(data.year) : value)] },
    },
    seoField,
    legacyFields(),
  ],
};

import type { CollectionConfig } from 'payload';
import { canEditContent, publishedOrStaff } from '@/access/roles';
import { slugField } from '@/fields/slug';
import { legacyFields } from '@/fields/legacy';
import { revalidateDelete, revalidateDoc } from '@/hooks/revalidate';
import { sitePath } from '@/lib/paths';

const pathFor = (doc: { slug?: string | null }) => sitePath('people', doc.slug);

export const HONORIFICS = [
  { label: 'Dr', value: 'dr' },
  { label: 'Prof.', value: 'prof' },
  { label: 'Mr', value: 'mr' },
  { label: 'Mrs', value: 'mrs' },
  { label: 'Ms', value: 'ms' },
];

export const PERSON_ROLES = [
  { label: 'Board of Directors', value: 'board' },
  { label: 'GANSID team (staff)', value: 'team' },
  { label: 'Congress speaker', value: 'speaker' },
  { label: 'Scientific committee', value: 'scientific-committee' },
  { label: 'Congress planning team', value: 'planning-team' },
  { label: 'E-course author', value: 'ecourse-author' },
  { label: 'Moderator', value: 'moderator' },
];

/**
 * One record per person, however many pages or congresses they appear on.
 * Which congress someone spoke at is set on the Congress edition (so its speaker order is
 * editable there); this screen shows it read-only under "Congress appearances".
 */
export const People: CollectionConfig = {
  slug: 'people',
  labels: { singular: 'Person', plural: 'People' },
  admin: {
    hideAPIURL: true,
    group: 'Network',
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'roles', '_status'],
    listSearchableFields: ['name', 'organization', 'position'],
    description: 'Board, team, speakers, committee members and e-course authors. One record per person.',
  },
  defaultSort: 'name',
  access: { read: publishedOrStaff, create: canEditContent, update: canEditContent, delete: canEditContent },
  versions: { drafts: { autosave: { interval: 800 } }, maxPerDoc: 25 },
  hooks: { afterChange: [revalidateDoc(pathFor)], afterDelete: [revalidateDelete(pathFor)] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'honorific',
                  type: 'select',
                  options: HONORIFICS,
                  admin: { width: '20%', description: 'Shown before the name.' },
                },
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Full name',
                  admin: { width: '50%', description: 'Without "Dr" or "Prof." (pick that on the left).' },
                },
                {
                  name: 'credentials',
                  type: 'text',
                  admin: { width: '30%', description: 'Optional, e.g. "MD, PhD".' },
                },
              ],
            },
            {
              name: 'position',
              type: 'text',
              localized: true,
              label: 'Title or position',
              admin: { description: 'e.g. "Professor of Haematology" or "Chair, Board of Directors".' },
            },
            {
              type: 'row',
              fields: [
                { name: 'organization', type: 'text', admin: { width: '50%', description: 'Where they work.' } },
                { name: 'country', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              name: 'region',
              type: 'relationship',
              relationTo: 'regions',
              label: 'GANSID region',
              admin: { description: 'For board members and regional leads: the region they represent.' },
            },
            { name: 'photo', type: 'upload', relationTo: 'media', admin: { description: 'A square head-and-shoulders photo works best.' } },
            { name: 'bio', type: 'richText', localized: true, label: 'Biography' },
          ],
        },
        {
          label: 'Roles',
          description: 'Which lists this person appears in.',
          fields: [
            {
              name: 'roles',
              type: 'select',
              hasMany: true,
              options: PERSON_ROLES,
              admin: { description: 'Pick every role that applies. Board and team members appear on the About pages.' },
            },
            {
              name: 'sortOrder',
              type: 'number',
              label: 'Order in lists',
              admin: { description: 'Optional. Lower numbers come first (e.g. Board chair first). Otherwise A to Z.' },
            },
          ],
        },
        {
          label: 'Congress appearances',
          description: 'Set on each Congress edition. Shown here so you can see everything about this person in one place.',
          fields: [
            {
              name: 'speakerAt',
              type: 'join',
              collection: 'congress-editions',
              on: 'speakers',
              label: 'Speaker at',
              admin: { defaultColumns: ['title', 'year'] },
            },
            {
              name: 'moderatorAt',
              type: 'join',
              collection: 'congress-editions',
              on: 'moderators',
              label: 'Moderator at',
              admin: { defaultColumns: ['title', 'year'] },
            },
            {
              name: 'committeeAt',
              type: 'join',
              collection: 'congress-editions',
              on: 'scientificCommittee',
              label: 'Scientific committee for',
              admin: { defaultColumns: ['title', 'year'] },
            },
            {
              name: 'planningTeamAt',
              type: 'join',
              collection: 'congress-editions',
              on: 'planningTeam',
              label: 'Planning team for',
              admin: { defaultColumns: ['title', 'year'] },
            },
          ],
        },
      ],
    },
    slugField('name'),
    {
      name: 'nameOnOldSite',
      type: 'text',
      label: 'Name as written on the old site',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Kept so you can check the import split the name correctly.',
      },
    },
    legacyFields({ imageLabel: 'Old photo address' }),
  ],
};

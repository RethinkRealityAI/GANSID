import type { CollectionConfig } from 'payload';
import { canEditContent, publishedOrStaff } from '@/access/roles';
import { slugField } from '@/fields/slug';
import { legacyFields } from '@/fields/legacy';
import { revalidateDelete, revalidateDoc } from '@/hooks/revalidate';
import { sitePath } from '@/lib/paths';

const pathFor = (doc: { slug?: string | null }) => sitePath('member-organizations', doc.slug);

/** Patient organizations (members) and stakeholder organizations (affiliates) in the network. */
export const MemberOrganizations: CollectionConfig = {
  slug: 'member-organizations',
  labels: { singular: 'Member organization', plural: 'Member organizations' },
  admin: {
    hideAPIURL: true,
    group: 'Network',
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'membershipType', '_status'],
    description: 'Primary members (patient organizations) and affiliates.',
  },
  defaultSort: 'name',
  access: { read: publishedOrStaff, create: canEditContent, update: canEditContent, delete: canEditContent },
  versions: { drafts: { autosave: { interval: 800 } }, maxPerDoc: 25 },
  hooks: { afterChange: [revalidateDoc(pathFor, '/members')], afterDelete: [revalidateDelete(pathFor, '/members')] },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'membershipType',
      type: 'radio',
      label: 'Membership',
      required: true,
      defaultValue: 'member',
      options: [
        { label: 'Primary member (patient organization)', value: 'member' },
        { label: 'Affiliate (society, institute, company…)', value: 'affiliate' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'country', type: 'text', admin: { width: '50%' } },
        { name: 'region', type: 'relationship', relationTo: 'regions', label: 'GANSID region', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'logo', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
        { name: 'website', type: 'text', admin: { width: '50%', placeholder: 'https://' } },
      ],
    },
    { name: 'description', type: 'richText', localized: true, admin: { description: 'What the organization does. A short paragraph.' } },
    slugField('name'),
    legacyFields(),
  ],
};

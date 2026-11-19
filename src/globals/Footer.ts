import type { GlobalConfig } from 'payload';
import { canEditContent } from '@/access/roles';
import { revalidateLayout } from './MainMenu';

const rowLabel = '/components/admin/row-label#LabelRowLabel';

export const SOCIAL_PLATFORMS = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'X (Twitter)', value: 'x' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'WhatsApp', value: 'whatsapp' },
];

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: { group: 'Website', description: 'The links, contact details and small print at the bottom of every page.' },
  access: { read: () => true, update: canEditContent },
  versions: { drafts: true, max: 25 },
  hooks: { afterChange: [revalidateLayout] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Link columns',
          fields: [
            {
              name: 'columns',
              type: 'array',
              maxRows: 4,
              labels: { singular: 'Column', plural: 'Columns' },
              fields: [
                { name: 'heading', type: 'text', localized: true, required: true },
                {
                  name: 'links',
                  type: 'array',
                  labels: { singular: 'Link', plural: 'Links' },
                  admin: { components: { RowLabel: rowLabel } },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', required: true, localized: true, admin: { width: '50%' } },
                        { name: 'url', type: 'text', required: true, label: 'Link', admin: { width: '50%' } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Contact & social',
          fields: [
            { name: 'email', type: 'email', label: 'Contact email' },
            { name: 'address', type: 'textarea', label: 'Postal address' },
            {
              name: 'social',
              type: 'array',
              label: 'Social media',
              labels: { singular: 'Account', plural: 'Accounts' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'platform', type: 'select', options: SOCIAL_PLATFORMS, required: true, admin: { width: '30%' } },
                    { name: 'url', type: 'text', required: true, label: 'Link', admin: { width: '70%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Small print',
          fields: [
            {
              name: 'legalLinks',
              type: 'array',
              label: 'Legal links',
              labels: { singular: 'Link', plural: 'Links' },
              admin: { description: 'e.g. Privacy policy, Terms of use.', components: { RowLabel: rowLabel } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, localized: true, admin: { width: '50%' } },
                    { name: 'url', type: 'text', required: true, label: 'Link', admin: { width: '50%' } },
                  ],
                },
              ],
            },
            {
              name: 'copyright',
              type: 'text',
              localized: true,
              label: 'Copyright line',
              admin: { description: 'e.g. "Global Action Network for Sickle Cell & Other Inherited Blood Disorders. All rights reserved."' },
            },
            {
              name: 'charityNumber',
              type: 'text',
              label: 'Registered charity number',
              admin: { description: 'Optional.' },
            },
          ],
        },
      ],
    },
  ],
};

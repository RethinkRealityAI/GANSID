import type { CollectionConfig } from 'payload';
import { canEditContent, publishedOrStaff } from '@/access/roles';
import { seoField, slugField } from '@/fields/slug';
import { legacyFields } from '@/fields/legacy';
import { revalidateDelete, revalidateDoc } from '@/hooks/revalidate';
import { sitePath } from '@/lib/paths';

const pathFor = (doc: { slug?: string | null }) => sitePath('events', doc.slug);

export const EVENT_TYPES = [
  { label: 'Roundtable', value: 'roundtable' },
  { label: 'Awareness day', value: 'awareness-day' },
  { label: 'Launch', value: 'launch' },
  { label: 'Webinar', value: 'webinar' },
  { label: 'Meeting or consultation', value: 'meeting' },
  { label: 'Seminar or workshop', value: 'seminar' },
  { label: 'Other', value: 'other' },
];

/** GANSID events other than the Congress (which has its own section). */
export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: {
    hideAPIURL: true,
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'startDate', '_status'],
    description: 'Roundtables, awareness days, launches and webinars. The annual Congress is under Congress.',
  },
  defaultSort: '-startDate',
  access: { read: publishedOrStaff, create: canEditContent, update: canEditContent, delete: canEditContent },
  versions: { drafts: { autosave: { interval: 800 }, schedulePublish: true }, maxPerDoc: 50 },
  hooks: { afterChange: [revalidateDoc(pathFor, '/events')], afterDelete: [revalidateDelete(pathFor, '/events')] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            {
              type: 'row',
              fields: [
                { name: 'type', type: 'select', options: EVENT_TYPES, required: true, defaultValue: 'other', admin: { width: '34%' } },
                {
                  name: 'startDate',
                  type: 'date',
                  label: 'Date (or first day)',
                  required: true,
                  admin: { width: '33%', date: { pickerAppearance: 'dayOnly' } },
                },
                {
                  name: 'endDate',
                  type: 'date',
                  label: 'Last day',
                  admin: { width: '33%', date: { pickerAppearance: 'dayOnly' }, description: 'Only for events over several days.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'location',
                  type: 'text',
                  localized: true,
                  admin: { width: '60%', description: 'e.g. "National Sickle Cell Centre, Lagos, Nigeria" or "Online".' },
                },
                {
                  name: 'format',
                  type: 'select',
                  options: [
                    { label: 'In person', value: 'in-person' },
                    { label: 'Online', value: 'online' },
                    { label: 'In person and online', value: 'hybrid' },
                  ],
                  admin: { width: '40%' },
                },
              ],
            },
            {
              name: 'summary',
              type: 'textarea',
              localized: true,
              maxLength: 280,
              admin: { description: 'Shown on event cards. One or two sentences.' },
            },
            { name: 'cover', type: 'upload', relationTo: 'media', label: 'Cover image' },
            { name: 'body', type: 'richText', localized: true, label: 'Full description' },
          ],
        },
        {
          label: 'Registration & photos',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'registrationUrl', type: 'text', label: 'Registration link', admin: { width: '60%' } },
                {
                  name: 'registrationLabel',
                  type: 'text',
                  localized: true,
                  label: 'Button text',
                  admin: { width: '40%', placeholder: 'Register', description: 'Defaults to "Register".' },
                },
              ],
            },
            {
              name: 'galleries',
              type: 'join',
              collection: 'galleries',
              on: 'event',
              label: 'Photo galleries',
              admin: { description: 'Galleries linked to this event. Link a gallery from the gallery itself.' },
            },
          ],
        },
      ],
    },
    slugField(),
    seoField,
    legacyFields(),
  ],
};

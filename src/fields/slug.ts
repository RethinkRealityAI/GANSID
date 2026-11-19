import type { Field } from 'payload';

export const slugify = (input: string) =>
  input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);

/** URL slug, filled from the title when left empty. */
export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  label: 'Web address',
  admin: {
    position: 'sidebar',
    description: 'Filled in from the title. Only change it if you know why.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value);
        const source = data?.[from];
        return typeof source === 'string' ? slugify(source) : value;
      },
    ],
  },
});

/** Search and social sharing fields, grouped so editors can ignore them. */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'Search & sharing',
  admin: { description: 'Optional. If left empty, the title and summary are used.' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true, maxLength: 200 },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
};

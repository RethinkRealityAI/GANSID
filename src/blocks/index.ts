import type { Block } from 'payload';

/**
 * The page-building blocks editors can choose from. Each maps to a designed component,
 * so editors arrange content without being able to break the design.
 * Add new blocks only when a design exists for them.
 */
export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Page header', plural: 'Page headers' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: 'Small label above the title' },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'lede', type: 'textarea', localized: true, label: 'Intro sentence' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'actions',
      type: 'array',
      maxRows: 2,
      label: 'Buttons',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'href', type: 'text', required: true, label: 'Link' },
      ],
    },
  ],
};

export const TextBlock: Block = {
  slug: 'text',
  labels: { singular: 'Text', plural: 'Text' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'body', type: 'richText', required: true, localized: true },
  ],
};

export const MediaTextBlock: Block = {
  slug: 'mediaText',
  labels: { singular: 'Image beside text', plural: 'Image beside text' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'imageSide',
      type: 'radio',
      defaultValue: 'left',
      options: [
        { label: 'Image on the left', value: 'left' },
        { label: 'Image on the right', value: 'right' },
      ],
    },
    { name: 'heading', type: 'text', localized: true },
    { name: 'body', type: 'richText', localized: true },
  ],
};

export const CallToActionBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'text', type: 'textarea', localized: true },
    { name: 'buttonLabel', type: 'text', required: true, localized: true },
    { name: 'href', type: 'text', required: true, label: 'Link' },
  ],
};

export const pageBlocks = [HeroBlock, TextBlock, MediaTextBlock, CallToActionBlock];

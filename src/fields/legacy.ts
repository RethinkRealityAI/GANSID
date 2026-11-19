import type { Field } from 'payload';

/**
 * Where a record came from on the old WordPress site. Filled in by the import script and
 * kept read-only: it is the audit trail for redirects and for checking imported facts.
 */
export const legacyFields = ({ imageLabel = 'Old image address' }: { imageLabel?: string } = {}): Field => ({
  type: 'collapsible',
  label: 'Old website (imported)',
  admin: {
    initCollapsed: true,
    description: 'Filled in by the import from the old WordPress site. You can ignore this.',
  },
  fields: [
    {
      name: 'legacyUrls',
      type: 'array',
      label: 'Old web addresses',
      labels: { singular: 'Address', plural: 'Addresses' },
      admin: { readOnly: true, description: 'Old addresses that now redirect here.' },
      fields: [{ name: 'url', type: 'text', required: true }],
    },
    {
      name: 'legacyImageUrl',
      type: 'text',
      label: imageLabel,
      admin: {
        description: 'The image on the old site that has not been uploaded here yet. Once you have uploaded it above, clear this.',
      },
    },
  ],
});

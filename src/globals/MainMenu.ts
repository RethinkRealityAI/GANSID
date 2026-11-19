import type { Field, GlobalAfterChangeHook, GlobalConfig } from 'payload';
import { revalidatePath } from 'next/cache';
import { canEditContent } from '@/access/roles';

/** Menus appear on every page, so refresh the whole site layout when one is published. */
export const revalidateLayout: GlobalAfterChangeHook = ({ doc, req }) => {
  if (req.context?.disableRevalidate) return doc;
  try {
    revalidatePath('/', 'layout');
  } catch {}
  return doc;
};

const rowLabel = '/components/admin/row-label#LabelRowLabel';

/** The old site's menu goes five levels deep (Programs › Capacity Building › … › A Call for Mentors). */
const MAX_DEPTH = 5;

/**
 * Field holding the items one level below `depth` (1 = top level).
 * Each level needs its own name: Payload names the database relation after the field, so
 * `children` inside `children` gives two relations with the same name and every read fails.
 */
export const menuChildField = (depth: number): string => (depth === 1 ? 'children' : `level${depth + 1}`);

const menuItemFields = (depth: number): Field[] => [
  {
    type: 'row',
    fields: [
      { name: 'label', type: 'text', required: true, localized: true, admin: { width: '45%' } },
      {
        name: 'url',
        type: 'text',
        label: 'Link',
        admin: { width: '40%', description: 'e.g. /about. Leave empty for a heading that only opens a sub-menu.' },
      },
      { name: 'newTab', type: 'checkbox', label: 'Open in new tab', admin: { width: '15%' } },
    ],
  },
  ...(depth < MAX_DEPTH
    ? [
        {
          name: menuChildField(depth),
          type: 'array',
          // Short table names: five nested levels would exceed Postgres's 63-character limit.
          dbName: `main_menu_l${depth + 1}`,
          label: depth === 1 ? 'Drop-down items' : 'Sub-menu items',
          labels: { singular: 'Item', plural: 'Items' },
          admin: { initCollapsed: true, components: { RowLabel: rowLabel } },
          fields: menuItemFields(depth + 1),
        } satisfies Field,
      ]
    : []),
];

export const MainMenu: GlobalConfig = {
  slug: 'main-menu',
  label: 'Main menu',
  admin: {
    group: 'Website',
    description: 'The menu across the top of every page. Drag items to reorder; open an item to add its drop-down.',
  },
  access: { read: () => true, update: canEditContent },
  versions: { drafts: true, max: 25 },
  hooks: { afterChange: [revalidateLayout] },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Menu items',
      labels: { singular: 'Menu item', plural: 'Menu items' },
      admin: { components: { RowLabel: rowLabel } },
      fields: menuItemFields(1),
    },
  ],
};

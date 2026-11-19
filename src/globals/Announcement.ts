import type { GlobalConfig } from 'payload';
import { canEditContent } from '@/access/roles';

export const Announcement: GlobalConfig = {
  slug: 'announcement',
  label: 'Announcement bar',
  admin: { group: 'Website', description: 'A one-line message across the top of every page.' },
  access: { read: () => true, update: canEditContent },
  versions: { drafts: true },
  fields: [
    { name: 'enabled', type: 'checkbox', label: 'Show the announcement bar', defaultValue: false },
    { name: 'message', type: 'text', localized: true, admin: { condition: (d) => Boolean(d?.enabled) } },
    { name: 'linkLabel', type: 'text', localized: true, admin: { condition: (d) => Boolean(d?.enabled) } },
    { name: 'href', type: 'text', label: 'Link', admin: { condition: (d) => Boolean(d?.enabled) } },
  ],
};

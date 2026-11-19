import type { CollectionConfig } from 'payload';
import { STAFF_ROLES, isAdmin, isAdminField, selfOrAdmin } from '@/access/roles';
import { supabaseStrategy } from '@/auth/supabase-strategy';

/**
 * Staff who can open the admin. Passwords are NOT stored here: everyone signs in with
 * their GANSID (Supabase) account at /sign-in. Adding someone here is what grants access.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Staff member', plural: 'Staff' },
  admin: {
    hideAPIURL: true,
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles', 'disabled'],
    group: 'Settings',
    description: 'People who can sign in to this admin. They sign in with their GANSID account email.',
  },
  auth: {
    disableLocalStrategy: true,
    strategies: [supabaseStrategy],
  },
  access: {
    read: selfOrAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Must match the email they use to sign in.' },
      hooks: { beforeChange: [({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value)] },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: [...STAFF_ROLES],
      access: { update: isAdminField, create: isAdminField },
      saveToJWT: true,
    },
    {
      name: 'disabled',
      type: 'checkbox',
      defaultValue: false,
      label: 'Access paused',
      access: { update: isAdminField },
    },
    {
      name: 'supabaseId',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar', description: 'Linked automatically on first sign-in.' },
      access: { update: () => false },
    },
  ],
};

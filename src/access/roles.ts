import type { Access, FieldAccess } from 'payload';

/**
 * Staff roles for the admin. Kept deliberately small and in plain language.
 * Members (portal users) are NOT Payload users; they live in Supabase Auth only.
 */
export const STAFF_ROLES = [
  { label: 'Super admin', value: 'super-admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Editor (website content)', value: 'editor' },
  { label: 'Forms manager', value: 'forms-manager' },
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number]['value'];

type MaybeStaff = { roles?: StaffRole[] | null } | null | undefined;

export const hasRole = (user: MaybeStaff, ...roles: StaffRole[]) =>
  Boolean(user?.roles?.some((r) => r === 'super-admin' || roles.includes(r)));

export const isAdmin: Access = ({ req }) => hasRole(req.user as MaybeStaff, 'admin');
export const isAdminField: FieldAccess = ({ req }) => hasRole(req.user as MaybeStaff, 'admin');
export const canEditContent: Access = ({ req }) => hasRole(req.user as MaybeStaff, 'admin', 'editor');
export const isStaff: Access = ({ req }) => Boolean(req.user);

/** Public can read published documents; staff can read drafts too. */
export const publishedOrStaff: Access = ({ req }) => {
  if (req.user) return true;
  return { _status: { equals: 'published' } };
};

/** Staff can read their own user record; admins can read everyone. */
export const selfOrAdmin: Access = ({ req }) => {
  if (hasRole(req.user as MaybeStaff, 'admin')) return true;
  if (!req.user) return false;
  return { id: { equals: req.user.id } };
};

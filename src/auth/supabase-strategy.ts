import type { AuthStrategy } from 'payload';
import { createSupabaseFromHeaders } from '@/lib/supabase/from-headers';
import { supabaseConfigured } from '@/lib/supabase/env';

/**
 * One login for everything: staff sign in with their Supabase account (the same one
 * they would use for the member portal or Congress), and Payload trusts that session.
 *
 * Rules:
 * - A Supabase session only becomes a Payload (staff) session if a matching staff user exists.
 *   Signing up on the portal never grants admin access.
 * - First-run bootstrap: emails listed in ADMIN_BOOTSTRAP_EMAILS are created as super admins
 *   the first time they sign in, so nobody needs database access to get started.
 * - Matching is by Supabase user id, falling back to email once (then the id is stored).
 */
const bootstrapEmails = () =>
  (process.env.ADMIN_BOOTSTRAP_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const supabaseStrategy: AuthStrategy = {
  name: 'supabase',
  authenticate: async ({ payload, headers }) => {
    if (!supabaseConfigured) return { user: null };

    const supabase = createSupabaseFromHeaders(headers);
    // getUser() asks Supabase Auth to validate the token, so a forged or revoked cookie is rejected.
    const { data, error } = await supabase.auth.getUser();
    const sbUser = data?.user;
    if (error || !sbUser?.email) return { user: null };

    const email = sbUser.email.toLowerCase();
    const found = await payload.find({
      collection: 'users',
      where: { or: [{ supabaseId: { equals: sbUser.id } }, { email: { equals: email } }] },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    let staff = found.docs[0];

    if (staff && staff.supabaseId && staff.supabaseId !== sbUser.id) {
      // Email matches but it is linked to a different Supabase account: refuse rather than guess.
      return { user: null };
    }

    if (staff && staff.disabled) return { user: null };

    if (staff && !staff.supabaseId) {
      staff = await payload.update({
        collection: 'users',
        id: staff.id,
        data: { supabaseId: sbUser.id },
        overrideAccess: true,
        depth: 0,
      });
    }

    if (!staff && bootstrapEmails().includes(email)) {
      staff = await payload.create({
        collection: 'users',
        data: {
          email,
          name: (sbUser.user_metadata?.full_name as string | undefined) ?? email.split('@')[0],
          roles: ['super-admin'],
          supabaseId: sbUser.id,
        },
        overrideAccess: true,
        depth: 0,
      });
    }

    if (!staff) return { user: null };

    return { user: { ...staff, collection: 'users', _strategy: 'supabase' } };
  },
};

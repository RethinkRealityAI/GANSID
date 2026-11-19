'use client';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

/** Signs out of the shared GANSID account (Supabase), which also ends the admin session. */
export function SignOutButton() {
  const signOut = async () => {
    try {
      await createSupabaseBrowserClient().auth.signOut();
    } finally {
      window.location.href = '/admin/login';
    }
  };
  return (
    <button type="button" className="nav__log-out" onClick={signOut} aria-label="Sign out" title="Sign out"
      style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}>
      Sign out
    </button>
  );
}

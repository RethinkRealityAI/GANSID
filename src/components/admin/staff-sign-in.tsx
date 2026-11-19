'use client';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { supabaseConfigured } from '@/lib/supabase/env';

/**
 * Admin login screen content. Staff use the same GANSID account as the portal.
 * Password or one-time email link; no separate admin password exists.
 */
export function StaffSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'password' | 'link'>('password');
  const [status, setStatus] = useState<{ kind: 'idle' | 'busy' | 'error' | 'sent'; message?: string }>({ kind: 'idle' });

  const redirectTo = () => {
    const raw = new URLSearchParams(window.location.search).get('redirect') ?? '/admin';
    return raw.startsWith('/') && !raw.startsWith('//') ? raw : '/admin';
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ kind: 'busy' });
    const supabase = createSupabaseBrowserClient();
    if (mode === 'link') {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo())}` },
      });
      setStatus(error ? { kind: 'error', message: friendly(error.message) } : { kind: 'sent' });
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setStatus({ kind: 'error', message: friendly(error.message) });
    // Signed in to GANSID, but only staff can open the admin: check before redirecting.
    const me = await fetch('/api/users/me', { credentials: 'include' }).then((r) => r.json()).catch(() => null);
    if (!me?.user) {
      await supabase.auth.signOut();
      return setStatus({
        kind: 'error',
        message: 'You are signed in to GANSID, but this account is not on the staff list. Ask an admin to add you.',
      });
    }
    window.location.href = redirectTo();
  };

  if (!supabaseConfigured) {
    return <p style={box}>Sign-in is not configured yet (missing Supabase settings).</p>;
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 14, width: '100%', maxWidth: 380, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, margin: 0 }}>Staff sign-in</h1>
      <p style={{ margin: 0, opacity: 0.75 }}>Use your GANSID account. Only people added as staff can open the admin.</p>
      <label style={label}>
        Email
        <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} />
      </label>
      {mode === 'password' && (
        <label style={label}>
          Password
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} style={input} />
        </label>
      )}
      <button type="submit" disabled={status.kind === 'busy'} style={button}>
        {status.kind === 'busy' ? 'Signing in…' : mode === 'password' ? 'Sign in' : 'Email me a sign-in link'}
      </button>
      <button type="button" onClick={() => { setMode(mode === 'password' ? 'link' : 'password'); setStatus({ kind: 'idle' }); }} style={linkButton}>
        {mode === 'password' ? 'Sign in with an email link instead' : 'Use my password instead'}
      </button>
      {status.kind === 'error' && <p role="alert" style={{ ...box, borderColor: '#d7262e', color: '#9b1519' }}>{status.message}</p>}
      {status.kind === 'sent' && <p role="status" style={box}>Check your inbox for a sign-in link.</p>}
    </form>
  );
}

const friendly = (msg: string) =>
  /invalid login/i.test(msg) ? 'That email and password do not match. Try again or use an email link.' :
  /signups not allowed|user not found/i.test(msg) ? 'There is no account for that email yet. Ask an admin to invite you.' :
  /failed to fetch|network/i.test(msg) ? 'We could not reach the sign-in service. Check your connection and try again.' :
  msg;

const label: React.CSSProperties = { display: 'grid', gap: 6, fontWeight: 600, fontSize: 14 };
const input: React.CSSProperties = { padding: '12px 14px', borderRadius: 10, border: '1px solid #d6d3cf', fontSize: 16, fontWeight: 400 };
const button: React.CSSProperties = { padding: '12px 16px', borderRadius: 999, border: 0, background: '#d7262e', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' };
const linkButton: React.CSSProperties = { background: 'none', border: 0, color: '#1a3c6e', textDecoration: 'underline', cursor: 'pointer', fontSize: 14 };
const box: React.CSSProperties = { margin: 0, padding: '10px 12px', borderRadius: 10, border: '1px solid #d6d3cf', fontSize: 14 };

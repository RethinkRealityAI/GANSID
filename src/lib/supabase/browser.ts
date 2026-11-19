'use client';
import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env';

export const createSupabaseBrowserClient = () => createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

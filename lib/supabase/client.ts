import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  return createBrowserClient(url, publishableKey);
}

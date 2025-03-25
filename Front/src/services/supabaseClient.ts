import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getPublicProfileUrl = (profile: string | null): string | null => {
    if (!profile) return null;
    const { data } = supabase.storage.from("profiles").getPublicUrl(profile);
    return data.publicUrl;
  };
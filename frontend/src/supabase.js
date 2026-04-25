import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY."
  );
}

const supabase = createClient(supabaseUrl, supabasePublishableKey);

function mapSupabaseUser(user) {
  const metadata = user?.user_metadata || {};

  return {
    avatarUrl: metadata.avatar_url || null,
    displayName:
      metadata.full_name ||
      metadata.name ||
      metadata.user_name ||
      user?.email ||
      "Developer",
    email: user?.email || null,
    id: user?.id || "",
    profileUrl: metadata.profile_url || null,
    provider: user?.app_metadata?.provider || null,
    username: metadata.user_name || metadata.preferred_username || user?.email || "developer"
  };
}

export { mapSupabaseUser, supabase };


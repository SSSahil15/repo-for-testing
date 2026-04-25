const { createClient } = require("@supabase/supabase-js");

const config = require("./env");

const supabase = createClient(config.supabaseUrl, config.supabasePublishableKey, {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
    persistSession: false
  }
});

module.exports = supabase;


const supabase = require("../config/supabase");
const createHttpError = require("../utils/httpError");

function extractBearerToken(authorizationHeader) {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

async function authenticateAccessToken(accessToken) {
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    throw createHttpError(401, "Your Supabase session is invalid or expired. Sign in again.");
  }

  return data.user;
}

function sanitizeSupabaseUser(user) {
  const metadata = user.user_metadata || {};

  return {
    avatarUrl: metadata.avatar_url || null,
    displayName:
      metadata.full_name ||
      metadata.name ||
      metadata.user_name ||
      user.email ||
      "Developer",
    email: user.email || null,
    id: user.id,
    profileUrl: metadata.profile_url || null,
    provider: user.app_metadata?.provider || null,
    username: metadata.user_name || metadata.preferred_username || user.email || user.id
  };
}

module.exports = {
  authenticateAccessToken,
  extractBearerToken,
  sanitizeSupabaseUser
};


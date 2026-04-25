const asyncHandler = require("../utils/asyncHandler");
const {
  authenticateAccessToken,
  extractBearerToken,
  sanitizeSupabaseUser
} = require("../services/supabaseAuth.service");

const ensureAuthenticated = asyncHandler(async (req, res, next) => {
  const accessToken = extractBearerToken(req.headers.authorization);

  if (!accessToken) {
    return res.status(401).json({
      message: "Authentication required. Sign in with GitHub through Supabase first."
    });
  }

  const user = await authenticateAccessToken(accessToken);

  req.accessToken = accessToken;
  req.supabaseUser = user;
  req.user = sanitizeSupabaseUser(user);

  return next();
});

module.exports = ensureAuthenticated;

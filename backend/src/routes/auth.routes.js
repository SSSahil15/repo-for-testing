const express = require("express");
const config = require("../config/env");
const {
  exchangeCodeForGitHubToken,
  fetchGitHubUser,
  issueDevPulseJWT,
} = require("../services/githubAuth.service");
const {
  deleteGitHubProviderToken,
  getGitHubProviderTokenStatus,
  saveGitHubProviderToken,
} = require("../services/providerTokenStore.service");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

/**
 * Step 1: Redirect user to GitHub OAuth authorization page.
 */
router.get("/github", (req, res) => {
  const callbackUrl = `${config.backendUrl}/auth/github/callback`;
  console.log("[OAuth] Starting GitHub OAuth flow");
  console.log("[OAuth] Client ID:", config.githubClientId);
  console.log("[OAuth] Redirect URI:", callbackUrl);
  
  const params = new URLSearchParams({
    client_id: config.githubClientId,
    redirect_uri: callbackUrl,
    scope: "repo read:user user:email",
    prompt: "consent", // Force GitHub to ask for permission every time
  });
  const authUrl = `https://github.com/login/oauth/authorize?${params}`;
  console.log("[OAuth] Full auth URL:", authUrl);
  res.redirect(authUrl);
});

/**
 * Step 2: GitHub redirects here with a code. Exchange it for a token,
 * issue a DevPulse JWT, and redirect back to the frontend with it.
 */
router.get(
  "/github/callback",
  asyncHandler(async (req, res) => {
    const { code, error, state } = req.query;

    console.log("[OAuth Callback] Received callback");
    console.log("[OAuth Callback] Code:", code ? code.substring(0, 10) + "..." : "missing");
    console.log("[OAuth Callback] Error:", error || "none");
    console.log("[OAuth Callback] State:", state || "none");

    if (error || !code) {
      console.error("[OAuth Callback] Auth denied or no code:", error);
      return res.redirect(`${config.frontendUrl}/login?error=github_denied`);
    }

    try {
      console.log("[OAuth Callback] Exchanging code for token...");
      const githubToken = await exchangeCodeForGitHubToken(code);
      console.log("[OAuth Callback] Token received successfully");
      
      console.log("[OAuth Callback] Fetching GitHub user...");
      const githubUser = await fetchGitHubUser(githubToken);
      console.log("[OAuth Callback] GitHub user fetched:", githubUser.login);

      // Save the GitHub token using the GitHub user ID as the key
      await saveGitHubProviderToken({
        githubViewer: {
          id: String(githubUser.id),
          login: githubUser.login,
          avatarUrl: githubUser.avatar_url,
          profileUrl: githubUser.html_url,
        },
        providerToken: githubToken,
        userId: String(githubUser.id),
      });

      const devpulseToken = issueDevPulseJWT(githubUser);

      const redirectUrl = `${config.frontendUrl}/auth/callback?token=${devpulseToken}`;
      console.log("[OAuth Callback] Redirecting to:", redirectUrl.split("?")[0]);
      
      // Redirect to frontend with the token in the URL
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error("[OAuth Callback] Error during auth flow:", err.message);
      console.error("[OAuth Callback] Full error:", err);
      return res.redirect(`${config.frontendUrl}/login?error=auth_failed`);
    }
  })
);

/**
 * GET /auth/me — Returns current user info (used by frontend to verify session).
 */
router.get(
  "/me",
  ensureAuthenticated,
  asyncHandler(async (req, res) => {
    const githubTokenSynced = await getGitHubProviderTokenStatus(req.user.id);
    return res.status(200).json({
      authenticated: true,
      githubTokenSynced,
      user: req.user,
    });
  })
);

/**
 * DELETE /auth/provider-token — Clears stored GitHub token on logout.
 */
router.delete(
  "/provider-token",
  ensureAuthenticated,
  asyncHandler(async (req, res) => {
    await deleteGitHubProviderToken(req.user.id);
    return res.status(200).json({ message: "GitHub token removed." });
  })
);

module.exports = router;

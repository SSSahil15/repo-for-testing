const express = require("express");

const ensureAuthenticated = require("../middleware/ensureAuthenticated");
const { fetchAuthenticatedViewer } = require("../services/github.service");
const {
  deleteGitHubProviderToken,
  getGitHubProviderTokenStatus,
  saveGitHubProviderToken
} = require("../services/providerTokenStore.service");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/me",
  ensureAuthenticated,
  asyncHandler(async (req, res) => {
    const githubTokenSynced = await getGitHubProviderTokenStatus(req.supabaseUser.id);

    return res.status(200).json({
      authenticated: true,
      githubTokenSynced,
      user: req.user
    });
  })
);

router.post(
  "/provider-token",
  ensureAuthenticated,
  asyncHandler(async (req, res) => {
    const { providerToken } = req.body;

    if (!providerToken || typeof providerToken !== "string") {
      return res.status(400).json({
        message: "providerToken is required."
      });
    }

    const githubViewer = await fetchAuthenticatedViewer(providerToken);

    await saveGitHubProviderToken({
      githubViewer,
      providerToken,
      userId: req.supabaseUser.id
    });

    return res.status(200).json({
      github: {
        avatarUrl: githubViewer.avatarUrl,
        id: githubViewer.id,
        login: githubViewer.login,
        profileUrl: githubViewer.profileUrl
      },
      message: "GitHub provider token synced successfully."
    });
  })
);

router.delete(
  "/provider-token",
  ensureAuthenticated,
  asyncHandler(async (req, res) => {
    await deleteGitHubProviderToken(req.supabaseUser.id);

    return res.status(200).json({
      message: "GitHub provider token removed successfully."
    });
  })
);

module.exports = router;

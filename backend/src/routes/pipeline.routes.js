const express = require("express");
const { z } = require("zod");
const asyncHandler = require("../utils/asyncHandler");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");
const ensureGitHubTokenSynced = require("../middleware/ensureGitHubTokenSynced");
const { simulateLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const pipelineController = require("../controllers/pipeline.controller");

const router = express.Router();

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const ingestSchema = z.object({
  repository: z.string().min(1),
  commitSha: z.string().min(1),
  runId: z.string().min(1),
  commitMessage: z.string().max(200).optional(),
  branch: z.string().optional(),
  triggeredBy: z.string().optional(),
  runUrl: z.string().url().optional().nullable(),
  event: z.string().optional(),
  timestamp: z.string().optional(),
  overallStatus: z.string().optional(),
  stages: z.object({
    backend: z.object({ tests: z.string() }).optional(),
    frontend: z.object({ build: z.string(), tests: z.string() }).optional(),
    security: z.object({
      critical: z.number().int().min(0),
      high: z.number().int().min(0),
      medium: z.number().int().min(0),
      vulnerabilities: z.array(z.any()).optional(),
    }).optional(),
    docker: z.object({
      build: z.string(),
      imageSize: z.string().optional(),
      imageVulnerabilities: z.number().int().min(0).optional(),
    }).optional(),
  }).optional(),
});

const simulateSchema = z.object({
  repositoryFullName: z.string().min(3).regex(/^[\w.-]+\/[\w.-]+$/, "Must be in owner/repo format"),
});

// ─────────────────────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────────────────────

router.post(
  "/results",
  validate(ingestSchema, "body"),
  asyncHandler(pipelineController.ingestResult)
);

router.post(
  "/simulate",
  simulateLimiter,
  ensureAuthenticated,
  ensureGitHubTokenSynced,
  validate(simulateSchema, "body"),
  asyncHandler(pipelineController.simulateScan)
);

router.get(
  "/simulate/status/:jobId",
  ensureAuthenticated,
  asyncHandler(pipelineController.getSimulationStatus)
);

router.get(
  "/results",
  asyncHandler(pipelineController.getResultsList)
);

router.get(
  "/results/:runId",
  asyncHandler(pipelineController.getResultById)
);

router.get(
  "/score/:repository(*)/history",
  asyncHandler(pipelineController.getScoreHistory)
);

router.get(
  "/score/:repository(*)",
  asyncHandler(pipelineController.getLatestScore)
);

router.get(
  "/health",
  asyncHandler(pipelineController.getPipelineHealth)
);

router.delete(
  "/results/:id",
  asyncHandler(pipelineController.deleteResultById)
);

router.delete(
  "/results",
  asyncHandler(pipelineController.deleteResultsBulk)
);

module.exports = router;

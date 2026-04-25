const express = require("express");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

/**
 * In-memory pipeline results store.
 * In production, replace this with a database (Postgres, Supabase, etc.)
 */
const pipelineResults = [];
const MAX_RESULTS = 200;

/**
 * POST /api/pipeline/results
 *
 * Receives pipeline results from the GitHub Actions CI/CD workflow.
 * This endpoint is called automatically at the end of every pipeline run.
 *
 * Expected payload:
 * {
 *   repository: string,
 *   commitSha: string,
 *   commitMessage: string,
 *   branch: string,
 *   triggeredBy: string,
 *   runId: string,
 *   runUrl: string,
 *   event: string,
 *   timestamp: string,
 *   stages: {
 *     backend:  { tests: "success" | "failure" | "skipped" },
 *     frontend: { build: "success" | "failure" | "skipped", tests: "..." },
 *     security: { critical: number, high: number, medium: number },
 *     docker:   { build: "success" | "failure" | "skipped", imageVulnerabilities: number }
 *   },
 *   overallStatus: "success" | "failure"
 * }
 */
router.post(
  "/results",
  asyncHandler(async (req, res) => {
    const {
      repository,
      commitSha,
      commitMessage,
      branch,
      triggeredBy,
      runId,
      runUrl,
      event,
      timestamp,
      stages,
      overallStatus,
    } = req.body;

    // Validate required fields
    if (!repository || !commitSha || !runId) {
      return res.status(400).json({
        message:
          "Missing required fields: repository, commitSha, and runId are required.",
      });
    }

    const record = {
      id: `pr-${runId}-${Date.now()}`,
      repository,
      commitSha: commitSha?.slice(0, 12),
      commitMessage: commitMessage?.slice(0, 200) || "",
      branch: branch || "unknown",
      triggeredBy: triggeredBy || "unknown",
      runId,
      runUrl: runUrl || null,
      event: event || "unknown",
      timestamp: timestamp || new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      overallStatus: overallStatus || "unknown",
      stages: {
        backend: {
          tests: stages?.backend?.tests || "skipped",
        },
        frontend: {
          build: stages?.frontend?.build || "skipped",
          tests: stages?.frontend?.tests || "skipped",
        },
        security: {
          critical: Number(stages?.security?.critical) || 0,
          high: Number(stages?.security?.high) || 0,
          medium: Number(stages?.security?.medium) || 0,
        },
        docker: {
          build: stages?.docker?.build || "skipped",
          imageVulnerabilities:
            Number(stages?.docker?.imageVulnerabilities) || 0,
        },
      },
    };

    // Log the receipt in a structured way
    console.log(
      JSON.stringify({
        event: "pipeline_result_received",
        repository: record.repository,
        commit: record.commitSha,
        branch: record.branch,
        status: record.overallStatus,
        security: record.stages.security,
        timestamp: record.receivedAt,
      })
    );

    // Store (FIFO, capped)
    pipelineResults.unshift(record);
    if (pipelineResults.length > MAX_RESULTS) {
      pipelineResults.length = MAX_RESULTS;
    }

    return res.status(201).json({
      message: "Pipeline results stored successfully.",
      id: record.id,
      overallStatus: record.overallStatus,
    });
  })
);

/**
 * GET /api/pipeline/results
 *
 * Returns stored pipeline results. Supports optional filters:
 *   ?repository=owner/repo  — filter by repository
 *   ?branch=main            — filter by branch
 *   ?limit=20               — limit results (default 20, max 100)
 */
router.get(
  "/results",
  asyncHandler(async (req, res) => {
    const { repository, branch, limit: rawLimit } = req.query;
    const limit = Math.min(Math.max(Number(rawLimit) || 20, 1), 100);

    let filtered = pipelineResults;

    if (repository) {
      filtered = filtered.filter((r) => r.repository === repository);
    }

    if (branch) {
      filtered = filtered.filter((r) => r.branch === branch);
    }

    return res.status(200).json({
      total: filtered.length,
      results: filtered.slice(0, limit),
    });
  })
);

/**
 * GET /api/pipeline/results/:runId
 *
 * Returns a single pipeline result by its run ID.
 */
router.get(
  "/results/:runId",
  asyncHandler(async (req, res) => {
    const { runId } = req.params;
    const result = pipelineResults.find((r) => r.runId === runId);

    if (!result) {
      return res.status(404).json({
        message: `No pipeline result found for run ID: ${runId}`,
      });
    }

    return res.status(200).json(result);
  })
);

/**
 * GET /api/pipeline/health
 *
 * Quick health summary: last run status, total stored, etc.
 */
router.get(
  "/health",
  asyncHandler(async (req, res) => {
    const latest = pipelineResults[0] || null;
    const successCount = pipelineResults.filter(
      (r) => r.overallStatus === "success"
    ).length;

    return res.status(200).json({
      service: "devpulse-pipeline",
      status: "ok",
      totalRuns: pipelineResults.length,
      successRate:
        pipelineResults.length > 0
          ? `${Math.round((successCount / pipelineResults.length) * 100)}%`
          : "N/A",
      latestRun: latest
        ? {
            repository: latest.repository,
            commit: latest.commitSha,
            status: latest.overallStatus,
            timestamp: latest.timestamp,
          }
        : null,
    });
  })
);

module.exports = router;

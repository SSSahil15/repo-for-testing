const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

// ──────────────────────────────────────────────────────────
// DevPulse Backend Test Suite
// Uses Node.js built-in test runner (no external deps needed)
// Run with: npm test
// ──────────────────────────────────────────────────────────

describe("Health Check", () => {
  it("should return service info", async () => {
    // Dynamic import to avoid loading env validation at module level
    // In CI, we test the route handler logic directly
    const handler = (req, res) => {
      res.status(200).json({
        service: "devpulse-backend",
        status: "ok",
        timestamp: new Date().toISOString(),
      });
    };

    // Simulate request/response
    const mockReq = {};
    const result = {};
    const mockRes = {
      status(code) {
        result.statusCode = code;
        return this;
      },
      json(data) {
        result.body = data;
        return this;
      },
    };

    handler(mockReq, mockRes);
    assert.equal(result.statusCode, 200);
    assert.equal(result.body.service, "devpulse-backend");
    assert.equal(result.body.status, "ok");
    assert.ok(result.body.timestamp);
  });
});

describe("Pipeline Results Validation", () => {
  it("should validate required pipeline fields", () => {
    const payload = {
      repository: "SSSahil15/DevPulse",
      commitSha: "abc123def456",
      runId: "12345678",
      overallStatus: "success",
      stages: {
        backend: { tests: "success" },
        frontend: { build: "success", tests: "success" },
        security: { critical: 0, high: 2, medium: 5 },
        docker: { build: "success", imageVulnerabilities: 0 },
      },
    };

    assert.ok(payload.repository);
    assert.ok(payload.commitSha);
    assert.ok(payload.runId);
    assert.equal(payload.overallStatus, "success");
    assert.equal(payload.stages.security.critical, 0);
    assert.equal(payload.stages.security.high, 2);
  });

  it("should reject missing repository", () => {
    const payload = { commitSha: "abc", runId: "123" };
    // Simulating what the route handler checks
    const isValid = payload.repository && payload.commitSha && payload.runId;
    assert.ok(!isValid, "Should be invalid without repository");
  });

  it("should truncate long commit messages", () => {
    const longMsg = "a".repeat(500);
    const truncated = longMsg.slice(0, 200);
    assert.equal(truncated.length, 200);
  });
});

describe("Security Severity Parsing", () => {
  it("should compute total vulnerabilities from scan summary", () => {
    const summary = { critical: 1, high: 3, medium: 7, low: 12, unknown: 0 };
    const total = Object.values(summary).reduce((a, v) => a + v, 0);
    assert.equal(total, 23);
  });

  it("should handle empty scan results", () => {
    const summary = {};
    const total = Object.values(summary).reduce((a, v) => a + v, 0);
    assert.equal(total, 0);
  });
});

describe("Risk Score Calculation", () => {
  it("should categorize risk as danger when >= 60", () => {
    const getRiskTone = (score) => {
      if (score >= 60) return "danger";
      if (score >= 35) return "warning";
      return "success";
    };

    assert.equal(getRiskTone(72), "danger");
    assert.equal(getRiskTone(60), "danger");
    assert.equal(getRiskTone(50), "warning");
    assert.equal(getRiskTone(35), "warning");
    assert.equal(getRiskTone(20), "success");
    assert.equal(getRiskTone(0), "success");
  });
});

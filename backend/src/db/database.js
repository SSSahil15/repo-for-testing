const { pool, migrate } = require("./postgres");

// ─── Pipeline Results Helpers ─────────────────────────────────────────────────

const pipelineDB = {
  async insert(record) {
    const query = `
      INSERT INTO pipeline_results
        (id, repository, commit_sha, commit_message, branch, triggered_by,
         run_id, run_url, event, timestamp, received_at, overall_status,
         stages, devpulse_score, insights)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    `;
    await pool.query(query, [
      record.id,
      record.repository,
      record.commitSha,
      record.commitMessage,
      record.branch,
      record.triggeredBy,
      record.runId,
      record.runUrl,
      record.event,
      record.timestamp,
      record.receivedAt,
      record.overallStatus,
      record.stages,
      record.devpulseScore,
      record.insights,
    ]);
  },

  async findFiltered({ repository, branch, limit = 20, offset = 0 }) {
    let query, params;
    if (repository && branch) {
      query = `SELECT * FROM pipeline_results WHERE repository = $1 AND branch = $2 ORDER BY received_at DESC LIMIT $3 OFFSET $4`;
      params = [repository, branch, limit, offset];
    } else if (repository) {
      query = `SELECT * FROM pipeline_results WHERE repository = $1 ORDER BY received_at DESC LIMIT $2 OFFSET $3`;
      params = [repository, limit, offset];
    } else {
      query = `SELECT * FROM pipeline_results ORDER BY received_at DESC LIMIT $1 OFFSET $2`;
      params = [limit, offset];
    }
    const { rows } = await pool.query(query, params);
    return rows.map(parsePipelineRow);
  },

  async findByRunId(runId) {
    const { rows } = await pool.query(`SELECT * FROM pipeline_results WHERE run_id = $1 LIMIT 1`, [runId]);
    return rows.length ? parsePipelineRow(rows[0]) : null;
  },

  async deleteById(id) {
    const { rowCount } = await pool.query(`DELETE FROM pipeline_results WHERE id = $1`, [id]);
    return { changes: rowCount };
  },

  async deleteByIds(ids) {
    await pool.query(`DELETE FROM pipeline_results WHERE id = ANY($1)`, [ids]);
  },

  async getHealth() {
    const { rows: countRows } = await pool.query(`SELECT COUNT(*) as total FROM pipeline_results`);
    const total = parseInt(countRows[0].total, 10);

    const { rows: successRows } = await pool.query(`SELECT COUNT(*) as total FROM pipeline_results WHERE overall_status = 'success'`);
    const successes = parseInt(successRows[0].total, 10);

    const { rows: avgRows } = await pool.query(`SELECT AVG((devpulse_score->>'score')::numeric) as avg FROM pipeline_results`);
    const avgScore = total > 0 ? Math.round(parseFloat(avgRows[0].avg) || 0) : null;

    const { rows: latestRows } = await pool.query(`SELECT * FROM pipeline_results ORDER BY received_at DESC LIMIT 1`);
    const latest = latestRows.length ? parsePipelineRow(latestRows[0]) : null;

    return { total, successes, avgScore, latest };
  },
};

function parsePipelineRow(row) {
  if (!row) return null;
  return {
    ...row,
    commitSha: row.commit_sha,
    commitMessage: row.commit_message,
    triggeredBy: row.triggered_by,
    runId: row.run_id,
    runUrl: row.run_url,
    receivedAt: row.received_at,
    overallStatus: row.overall_status,
    stages: row.stages,
    devpulseScore: row.devpulse_score,
    insights: row.insights,
  };
}

// ─── Scan Job Helpers ─────────────────────────────────────────────────────────

const scanJobDB = {
  async create(id, repository) {
    const now = new Date().toISOString();
    await pool.query(`
      INSERT INTO scan_jobs (id, repository, status, created_at, updated_at)
      VALUES ($1, $2, 'pending', $3, $3)
    `, [id, repository, now]);
  },

  async getById(id) {
    const { rows } = await pool.query(`SELECT * FROM scan_jobs WHERE id = $1 LIMIT 1`, [id]);
    if (!rows.length) return null;
    const row = rows[0];
    return {
      ...row,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      result: row.result,
    };
  },

  async markProcessing(id) {
    await pool.query(`UPDATE scan_jobs SET status = 'processing', updated_at = $1 WHERE id = $2`, [new Date().toISOString(), id]);
  },

  async markDone(id, result) {
    await pool.query(`UPDATE scan_jobs SET status = 'done', result = $1, updated_at = $2 WHERE id = $3`, [result, new Date().toISOString(), id]);
  },

  async markFailed(id, errorMsg) {
    await pool.query(`UPDATE scan_jobs SET status = 'failed', error = $1, updated_at = $2 WHERE id = $3`, [errorMsg, new Date().toISOString(), id]);
  },
};

// ─── Report Helpers ───────────────────────────────────────────────────────────

const reportDB = {
  async insert(report) {
    await pool.query(`
      INSERT INTO reports
        (token, repository, repo_meta, devpulse_score, stages, insights, created_by, created_at, expires_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      report.token, report.repository, report.repoMeta, report.devpulseScore, report.stages,
      report.insights, report.createdBy, report.createdAt, report.expiresAt
    ]);
  },

  async getByToken(token) {
    const { rows } = await pool.query(`SELECT * FROM reports WHERE token = $1 LIMIT 1`, [token]);
    if (!rows.length) return null;
    const row = rows[0];
    return {
      token: row.token,
      repository: row.repository,
      repoMeta: row.repo_meta || {},
      devpulseScore: row.devpulse_score || null,
      stages: row.stages || null,
      insights: row.insights || null,
      createdBy: row.created_by,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
    };
  },

  async cleanupExpired() {
    const { rowCount } = await pool.query(`DELETE FROM reports WHERE expires_at < $1`, [new Date().toISOString()]);
    if (rowCount > 0) {
      console.log(`[DB] Cleaned up ${rowCount} expired report(s).`);
    }
  },
};

// ─── Provider Token Helpers ───────────────────────────────────────────────────

const providerTokenDB = {
  async upsert({ userId, encryptedToken, githubLogin, profileUrl }) {
    await pool.query(`
      INSERT INTO provider_tokens (user_id, encrypted_token, github_login, profile_url, synced_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT(user_id) DO UPDATE SET
        encrypted_token = EXCLUDED.encrypted_token,
        github_login    = EXCLUDED.github_login,
        profile_url     = EXCLUDED.profile_url,
        synced_at       = EXCLUDED.synced_at
    `, [userId, encryptedToken, githubLogin || null, profileUrl || null, new Date().toISOString()]);
  },

  async getByUserId(userId) {
    const { rows } = await pool.query(`SELECT * FROM provider_tokens WHERE user_id = $1 LIMIT 1`, [userId]);
    return rows.length ? rows[0] : null;
  },

  async deleteByUserId(userId) {
    await pool.query(`DELETE FROM provider_tokens WHERE user_id = $1`, [userId]);
  },
};

// Initialize DB and background jobs
if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      await migrate();

      // ─── Cleanup job: run once per hour ──────────────────────────────────────────
      const cleanupInterval = setInterval(async () => {
        try {
          await reportDB.cleanupExpired();
          const { rowCount } = await pool.query(`DELETE FROM pipeline_results WHERE received_at < NOW() - INTERVAL '7 days'`);
          if (rowCount > 0) console.log(`[DB] Cleaned up ${rowCount} pipeline result(s) older than 7 days.`);
        } catch (err) {
          console.error("[DB] Cleanup job error:", err);
        }
      }, 60 * 60 * 1000);
      cleanupInterval.unref?.();
    } catch (err) {
      console.error("Failed to initialize database:", err);
    }
  })();
}

module.exports = { pool, pipelineDB, scanJobDB, reportDB, providerTokenDB };

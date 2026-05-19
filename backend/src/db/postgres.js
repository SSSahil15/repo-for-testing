const { Pool } = require("pg");
const config = require("../config/env");

const pool = new Pool({
  connectionString: config.databaseUrl || "postgresql://devpulse:devpulse@localhost:5432/devpulse",
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS pipeline_results (
        id VARCHAR(255) PRIMARY KEY,
        repository VARCHAR(255) NOT NULL,
        commit_sha VARCHAR(255),
        commit_message TEXT,
        branch VARCHAR(255),
        triggered_by VARCHAR(255),
        run_id VARCHAR(255),
        run_url TEXT,
        event VARCHAR(255),
        timestamp TIMESTAMPTZ,
        received_at TIMESTAMPTZ NOT NULL,
        overall_status VARCHAR(50),
        stages JSONB NOT NULL,
        devpulse_score JSONB NOT NULL,
        insights JSONB NOT NULL
      );
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_pipeline_repository ON pipeline_results(repository);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_pipeline_branch ON pipeline_results(branch);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_pipeline_received ON pipeline_results(received_at DESC);`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS scan_jobs (
        id VARCHAR(255) PRIMARY KEY,
        repository VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        result JSONB,
        error TEXT
      );
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_scanjob_repository ON scan_jobs(repository);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_scanjob_status ON scan_jobs(status);`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS reports (
        token VARCHAR(255) PRIMARY KEY,
        repository VARCHAR(255) NOT NULL,
        repo_meta JSONB,
        devpulse_score JSONB,
        stages JSONB,
        insights JSONB,
        created_by VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL
      );
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_report_repository ON reports(repository);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_report_expires ON reports(expires_at);`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS provider_tokens (
        user_id VARCHAR(255) PRIMARY KEY,
        encrypted_token TEXT NOT NULL,
        github_login VARCHAR(255),
        profile_url TEXT,
        synced_at TIMESTAMPTZ NOT NULL
      );
    `);

    await client.query("COMMIT");
    console.log("[DB] PostgreSQL database ready and migrated.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[DB] PostgreSQL migration failed", err);
    throw err;
  } finally {
    client.release();
  }
}

pool.on("error", (err, client) => {
  console.error("[DB] Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = { pool, migrate };

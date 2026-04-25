import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import MetricCard from "./MetricCard";

function getRiskTone(riskScore) {
  if (riskScore >= 60) {
    return "danger";
  }

  if (riskScore >= 35) {
    return "warning";
  }

  return "success";
}

function formatPercentage(value) {
  return `${Math.round(value)}%`;
}

function AnalysisPanel({
  analysisState,
  analysisResult,
  onAnalyze,
  repository,
  accessToken
}) {
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    if (!repository) return;

    async function fetchRuns() {
      try {
        const data = await apiRequest(`/webhooks/runs/${encodeURIComponent(repository.fullName)}`, {
          accessToken
        });
        setRuns(data);
      } catch (error) {
        console.error("Failed to fetch CI runs:", error);
      }
    }

    fetchRuns();
    const interval = setInterval(fetchRuns, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [repository, accessToken]);

  if (!repository) {
    return (
      <section className="panel-shell">
        <div className="empty-panel">
          <h2>Select a repository</h2>
          <p>
            Pick a repository from the left to inspect its baseline delivery
            risk and prepare it for the upcoming CI, Trivy, and AI phases.
          </p>
        </div>
      </section>
    );
  }

  const analysis = analysisResult?.analysis;
  const vulnerabilitySummary = analysis?.securityScan?.summary;
  const totalVulnerabilities = vulnerabilitySummary
    ? Object.values(vulnerabilitySummary).reduce((sum, value) => sum + value, 0)
    : 0;

  return (
    <section className="panel-shell">
      <div className="panel-header">
        <div>
          <p className="section-label">Repository pulse</p>
          <h2>{repository.fullName}</h2>
          <p className="panel-description">
            {repository.description ||
              "This repository is ready for baseline DevPulse analysis."}
          </p>
        </div>

        <button
          className="primary-button"
          disabled={analysisState.status === "loading"}
          onClick={() => onAnalyze(repository)}
          type="button"
        >
          {analysisState.status === "loading" ? "Running analysis..." : "Analyze Repo"}
        </button>
      </div>

      <div className="panel-grid">
        <MetricCard
          detail="Combined CI stability and security posture."
          eyebrow="Risk score"
          tone={analysis ? getRiskTone(analysis.riskScore) : "neutral"}
          value={analysis ? analysis.riskScore : "--"}
        />
        <MetricCard
          detail="Estimated chance that the next pipeline run fails."
          eyebrow="Failure prediction"
          tone={analysis?.failurePrediction ? getRiskTone(analysis.failurePrediction.probability) : "neutral"}
          value={analysis?.failurePrediction ? formatPercentage(analysis.failurePrediction.probability) : "--"}
        />
        <MetricCard
          detail={analysis?.securityScan?.status === "completed" 
            ? `Trivy scan completed. ${totalVulnerabilities} issues found.` 
            : "Security findings will populate here once the scan completes."}
          eyebrow="Vulnerabilities"
          tone={totalVulnerabilities > 0 ? "danger" : "neutral"}
          value={analysis ? totalVulnerabilities : "--"}
        />
      </div>

      {analysisState.status === "error" ? (
        <div className="feedback-card feedback-error">{analysisState.error}</div>
      ) : null}

      {analysis ? (
        <>
          <div className="analysis-section">
            <div className="analysis-card">
              <p className="section-label">Decision</p>
              <div className="decision-row">
                <span className={`decision-pill decision-${analysis.decision?.toLowerCase()}`}>
                  {analysis.decision}
                </span>
                <span className="decision-source">{analysis.source}</span>
              </div>
              <p>{analysis.failurePrediction?.rationale}</p>
            </div>

            <div className="analysis-card">
              <p className="section-label">Severity breakdown</p>
              <div className="severity-grid">
                {analysis.securityScan?.summary && Object.entries(analysis.securityScan.summary).map(([severity, count]) => (
                  <div className="severity-cell" key={severity}>
                    <span>{severity}</span>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
              <p className="section-footnote">
                {analysis.securityScan?.status === "completed" 
                  ? "This breakdown is based on a live Trivy scan of the repository."
                  : "Trivy integration is active. Run an analysis to see live security data."}
              </p>
            </div>
          </div>

          <div className="analysis-section">
            <div className="analysis-card">
              <p className="section-label">AI suggestions</p>
              <ul className="suggestion-list">
                {analysis.suggestions?.map((suggestion) => (
                  <li key={suggestion}>{suggestion}</li>
                ))}
              </ul>
            </div>

            <div className="analysis-card">
              <p className="section-label">Repository facts</p>
              <div className="fact-grid">
                <div>
                  <span>Default branch</span>
                  <strong>{repository.defaultBranch}</strong>
                </div>
                <div>
                  <span>Open issues</span>
                  <strong>{repository.openIssuesCount}</strong>
                </div>
                <div>
                  <span>Stars</span>
                  <strong>{repository.stargazersCount}</strong>
                </div>
                <div>
                  <span>Forks</span>
                  <strong>{repository.forksCount}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="analysis-section">
            <div className="analysis-card full-width">
              <p className="section-label">Recent CI runs (via GitHub Actions)</p>
              {runs.length === 0 ? (
                <p className="empty-message">No GitHub Action runs detected yet. Add the DevPulse workflow to your repo!</p>
              ) : (
                <div className="runs-list">
                  {runs.map(run => (
                    <div key={run.id} className="run-item">
                      <span className={`run-status status-${run.conclusion}`}>
                        {run.conclusion.toUpperCase()}
                      </span>
                      <div className="run-details">
                        <strong>Run #{run.id.slice(0, 8)}</strong>
                        <span>Received at: {new Date(run.receivedAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="empty-analysis">
          <h3>No analysis yet</h3>
          <p>
            Run the first repository analysis to generate a baseline risk score,
            failure probability, and recommendations.
          </p>
        </div>
      )}
    </section>
  );
}

export default AnalysisPanel;


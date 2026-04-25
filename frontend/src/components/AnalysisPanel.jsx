import { useEffect, useState } from "react";
import {
  Zap, ShieldAlert, Activity, History,
  AlertCircle, CheckCircle2, AlertTriangle, Lightbulb,
  Loader2, GitBranch
} from "lucide-react";
import MetricCard from "./MetricCard";
import { apiRequest } from "../api";

function getRiskTone(score) {
  if (score >= 60) return "danger";
  if (score >= 35) return "warning";
  return "success";
}

function AnalysisPanel({ analysisState, analysisResult, onAnalyze, repository, accessToken }) {
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    if (!repository) return;
    async function fetchRuns() {
      try {
        const data = await apiRequest(`/webhooks/runs/${encodeURIComponent(repository.fullName)}`, { accessToken });
        setRuns(data);
      } catch {}
    }
    fetchRuns();
    const id = setInterval(fetchRuns, 10000);
    return () => clearInterval(id);
  }, [repository, accessToken]);

  if (!repository) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-32">
        <div className="w-20 h-20 bg-white/[0.03] ring-1 ring-white/10 rounded-3xl flex items-center justify-center mb-6">
          <GitBranch className="w-9 h-9 text-slate-600" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No repository selected</h2>
        <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
          Pick a repository from the sidebar to run a full AI + security analysis.
        </p>
      </div>
    );
  }

  const analysis = analysisResult?.analysis;
  const vulnSummary = analysis?.securityScan?.summary;
  const totalVulns = vulnSummary ? Object.values(vulnSummary).reduce((a, v) => a + v, 0) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400">Repository Pulse</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">{repository.fullName}</h2>
          <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
            {repository.description || "AI-powered DevSecOps analysis for this repository."}
          </p>
        </div>
        <button
          onClick={() => onAnalyze(repository)}
          disabled={analysisState.status === "loading"}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20 shrink-0"
        >
          {analysisState.status === "loading"
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Zap className="w-4 h-4 fill-white" />
          }
          {analysisState.status === "loading" ? "Scanning..." : "Analyze Repo"}
        </button>
      </div>

      {/* Error */}
      {analysisState.status === "error" && (
        <div className="flex items-center gap-3 bg-red-500/10 ring-1 ring-red-500/20 rounded-2xl px-5 py-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-sm text-red-300">{analysisState.error}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          eyebrow="Risk Score"
          value={analysis ? analysis.riskScore : "--"}
          detail="Weighted aggregate of delivery risk and security posture."
          tone={analysis ? getRiskTone(analysis.riskScore) : "neutral"}
        />
        <MetricCard
          eyebrow="Failure Probability"
          value={analysis?.failurePrediction ? `${Math.round(analysis.failurePrediction.probability)}%` : "--"}
          detail="AI prediction of next pipeline run failure based on activity and technical debt."
          tone={analysis?.failurePrediction ? getRiskTone(analysis.failurePrediction.probability) : "neutral"}
        />
        <MetricCard
          eyebrow="Vulnerabilities"
          value={analysis ? totalVulns : "--"}
          detail={analysis?.securityScan?.status === "completed" ? `Trivy scan found ${totalVulns} issues.` : "Security findings from live Trivy scan."}
          tone={totalVulns > 0 ? "danger" : (analysis ? "success" : "neutral")}
        />
      </div>

      {/* Empty state */}
      {!analysis && analysisState.status !== "loading" && (
        <div className="py-24 rounded-[28px] ring-1 ring-dashed ring-white/[0.07] flex flex-col items-center justify-center gap-4">
          <div className="animate-pulse-glow w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
            <Zap className="w-7 h-7 text-blue-400 fill-blue-400" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-white mb-1">Awaiting Analysis</h3>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Click "Analyze Repo" to generate your AI risk profile, security scan, and CI predictions.
            </p>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="grid grid-cols-2 gap-6">
          {/* Decision */}
          <div className="bg-white/[0.03] ring-1 ring-white/10 rounded-2xl p-7 relative overflow-hidden">
            <div className="absolute top-6 right-6 opacity-[0.04]">
              <ShieldAlert className="w-28 h-28" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-5">AI Decision</p>
            <div className="flex items-center gap-3 mb-5">
              <span className={`px-5 py-1.5 rounded-full text-xs font-black tracking-widest ring-1 ${
                analysis.decision === "BLOCK"
                  ? "bg-red-500/15 text-red-400 ring-red-500/30"
                  : "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30"
              }`}>
                {analysis.decision}
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-white/5 ring-1 ring-white/10 px-3 py-1 rounded-lg uppercase">
                {analysis.source}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed italic">
              "{analysis.failurePrediction?.rationale}"
            </p>
          </div>

          {/* Severity Breakdown */}
          <div className="bg-white/[0.03] ring-1 ring-white/10 rounded-2xl p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-5">Severity Breakdown</p>
            <div className="grid grid-cols-5 gap-2">
              {vulnSummary && Object.entries(vulnSummary).map(([sev, count]) => {
                const colorMap = { critical: "text-red-400", high: "text-orange-400", medium: "text-amber-400", low: "text-blue-400", unknown: "text-slate-400" };
                return (
                  <div key={sev} className="flex flex-col items-center bg-white/[0.04] ring-1 ring-white/5 rounded-xl p-3 gap-1">
                    <span className={`text-xl font-black ${colorMap[sev] || "text-slate-400"}`}>{count}</span>
                    <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">{sev}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-600 mt-4 italic">
              {analysis.securityScan?.status === "completed" ? "✓ Live Trivy scan" : "⚠ Scan pending"}
            </p>
          </div>

          {/* AI Suggestions */}
          <div className="bg-white/[0.03] ring-1 ring-white/10 rounded-2xl p-7">
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">AI Remediation</p>
            </div>
            <div className="space-y-3">
              {analysis.suggestions?.map((s, i) => (
                <div key={i} className="flex gap-3 group">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-black shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    {i + 1}
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Repo Facts */}
          <div className="bg-white/[0.03] ring-1 ring-white/10 rounded-2xl p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-5">Repository Facts</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Branch", value: repository.defaultBranch },
                { label: "Open Issues", value: repository.openIssuesCount },
                { label: "Stars", value: repository.stargazersCount },
                { label: "Forks", value: repository.forksCount },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/[0.03] ring-1 ring-white/[0.06] rounded-xl px-4 py-3">
                  <div className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">{label}</div>
                  <div className="text-lg font-bold text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CI Runs */}
      {analysis && (
        <div className="bg-white/[0.03] ring-1 ring-white/10 rounded-2xl p-7">
          <div className="flex items-center gap-2 mb-5">
            <History className="w-4 h-4 text-blue-400" />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">CI/CD Webhook Activity</p>
          </div>
          {runs.length === 0 ? (
            <div className="py-8 text-center ring-1 ring-dashed ring-white/[0.06] rounded-xl">
              <p className="text-sm text-slate-600">No runs yet. Add <code className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">devpulse-scan.yml</code> to your GitHub Actions to stream live data here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {runs.slice(0, 5).map(run => (
                <div key={run.id} className="flex items-center justify-between p-3 bg-white/[0.02] ring-1 ring-white/[0.06] rounded-xl hover:ring-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    {run.conclusion === "success"
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      : <AlertTriangle className="w-4 h-4 text-red-500" />
                    }
                    <span className="text-sm font-mono text-slate-300">Run #{run.id.slice(0, 8)}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">{new Date(run.receivedAt).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AnalysisPanel;

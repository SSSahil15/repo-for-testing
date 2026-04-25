import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, GitBranch, Shield, Zap, AlertCircle, ChevronRight } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const STAT_CARDS = [
  { label: "Risk Score",           value: "72",  color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20"    },
  { label: "Failure Probability",  value: "61%", color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20"  },
  { label: "Critical CVEs",        value: "3",   color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
];

const FEATURES = [
  { icon: Zap,       title: "AI Risk Engine",   desc: "Predicts pipeline failures before they happen."   },
  { icon: Shield,    title: "Trivy Security",   desc: "Deep CVE scanning across your dependencies."      },
  { icon: GitBranch, title: "GitHub Actions",   desc: "Live CI webhook feed directly in your dashboard." },
];

function LoginPage({ sessionError }) {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const authError = searchParams.get("error");

  function handleLoginWithGitHub() {
    setIsLoading(true);
    // Redirect directly to backend — no Supabase
    window.location.href = `${BACKEND_URL}/auth/github`;
  }

  return (
    <div className="min-h-screen bg-[#080b14] flex flex-col overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">DevPulse</span>
        </div>
        <span className="text-xs text-slate-500 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full font-mono">
          AI-Powered DevSecOps
        </span>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            Live Intelligence Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
            <span className="text-white">Confidence for</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              every merge.
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            DevPulse connects to GitHub, scans your code for vulnerabilities, predicts failures, and turns noisy risk into a clean operational signal.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleLoginWithGitHub}
              disabled={isLoading}
              className="group flex items-center gap-3 bg-white text-[#080b14] font-bold text-sm px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-white/10 disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              )}
              {isLoading ? "Redirecting to GitHub..." : "Continue with GitHub"}
              {!isLoading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
            <p className="text-xs text-slate-600">Direct GitHub OAuth · No passwords · No third-party middlemen</p>
          </div>

          {/* Errors */}
          {(authError || sessionError) && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 max-w-md mx-auto">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-300">
                {authError === "github_denied" ? "GitHub authorization was denied. Please try again." :
                 authError === "auth_failed" ? "Authentication failed. Please try again." :
                 sessionError || "Something went wrong. Please try again."}
              </p>
            </div>
          )}
        </div>

        {/* Stats preview */}
        <div className="relative z-10 mt-20 w-full max-w-3xl mx-auto">
          <p className="text-center text-xs text-slate-600 uppercase tracking-widest mb-6 font-semibold">What you'll see after login</p>
          <div className="grid grid-cols-3 gap-4">
            {STAT_CARDS.map(({ label, value, color, bg, border }) => (
              <div key={label} className={`${bg} ${border} border rounded-2xl p-6 text-center backdrop-blur-sm`}>
                <div className={`text-4xl font-black mb-1 ${color}`}>{value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 mt-10 w-full max-w-3xl mx-auto grid grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-bold text-sm mb-1">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 py-6 border-t border-white/5 text-center">
        <p className="text-xs text-slate-600">Built with React, FastAPI &amp; Trivy · GitHub OAuth Direct</p>
      </footer>
    </div>
  );
}

export default LoginPage;

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, GitBranch, Shield, Zap, AlertCircle, ChevronRight, Activity, LineChart, Layers, Terminal, Server, Lock, Code2, PlayCircle, Star, Users, Database, Target, CheckCircle2, MessageSquare } from "lucide-react";
import CountUp from "../components/CountUp";
import { WaveChart, BarChart, SecurityLineChart, ActivityGrid } from '../components/charts';
import DemoVideoMockup from '../components/DemoVideoMockup';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function GithubIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  );
}

function TwitterIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
  );
}

function DiscordIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="1"/>
      <circle cx="15" cy="12" r="1"/>
      <path d="M7.5 7.5c3.5-1 5.5-1 9 0"/>
      <path d="M7 16.5c3.5 1 6.5 1 10 0"/>
      <path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .667-1.667.5-5.833-1.5-11.5-1.457-1.015-3-1.34-4.5-1.5l-1 2.5"/>
      <path d="M8.5 17c0 1-1.5 3-2 3-1.5 0-2.833-1.667-3.5-3-.667-1.667-.5-5.833 1.5-11.5 1.457-1.015 3-1.34 4.5-1.5l1 2.5"/>
    </svg>
  );
}

const STAT_CARDS = [
  { label: "Risk Score",           value: 72,  suffix: "", color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20",    trend: "↑ +4 today", trendColor: "text-red-400" },
  { label: "Failure Probability",  value: 61,  suffix: "%", color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20", trend: "↓ -2% this week", trendColor: "text-emerald-400"  },
  { label: "Critical CVEs",        value: 3,   suffix: "", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", trend: "↑ 1 new", trendColor: "text-orange-400" },
];

const FEATURES = [
  { icon: Zap,       title: "AI Risk Engine",       desc: "Predicts pipeline failures before they happen."   },
  { icon: Shield,    title: "Trivy Security",       desc: "Deep CVE scanning across your dependencies."      },
  { icon: Activity,  title: "Real-Time Sync",       desc: "Instant scan progress updates via WebSockets."    },
  { icon: Layers,    title: "Asynchronous Scans",   desc: "Heavy analysis offloaded to background workers."  },
  { icon: LineChart, title: "Deep Observability",   desc: "Full telemetry with Grafana, Loki, and OTel."     },
  { icon: GitBranch, title: "GitHub Integration",   desc: "Live CI webhook feed directly in your dashboard." },
];

// --- Subcomponents ---

// 1. Interactive AI Demo
function InteractiveAIDemo() {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    const sequence = [
      { delay: 1500, state: 1 },
      { delay: 2000, state: 2 },
      { delay: 2500, state: 3 },
      { delay: 4000, state: 4 },
      { delay: 5000, state: 0 }, // Reset loop
    ];
    
    let timeout;
    const runSequence = (index) => {
      if (index >= sequence.length) return;
      timeout = setTimeout(() => {
        setStep(sequence[index].state);
        runSequence(index + 1);
      }, sequence[index].delay);
    };
    
    runSequence(0);
    return () => clearTimeout(timeout);
  }, [step === 0]); 

  return (
    <div className="w-full bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden font-mono text-sm relative shadow-2xl">
      <div className="flex items-center px-4 py-2 bg-white/5 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
        </div>
        <div className="mx-auto text-xs text-slate-500 flex items-center gap-2">
          <Terminal className="w-3 h-3" /> devpulse-ai-copilot
        </div>
      </div>
      <div className="p-5 h-[220px] flex flex-col gap-3">
        {step >= 0 && (
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-blue-400">❯</span> <span>Analyzing deployment pipeline...</span>
            {step === 0 && <span className="w-2 h-4 bg-slate-400 animate-pulse inline-block ml-1" />}
          </div>
        )}
        {step >= 1 && (
          <div className="flex items-start gap-2 text-red-400 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Found 3 Critical Vulnerabilities (CVE-2024-21334, CVE-2023-4527, CVE-2023-3333)</span>
          </div>
        )}
        {step >= 2 && (
          <div className="flex items-center gap-2 text-slate-400 animate-in fade-in duration-300">
            <span className="text-blue-400">❯</span> <span>AI Agent calculating remediation path...</span>
            {step === 2 && <span className="w-2 h-4 bg-slate-400 animate-pulse inline-block ml-1" />}
          </div>
        )}
        {step >= 3 && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-3 text-emerald-400 mt-2 animate-in fade-in zoom-in-95 duration-300">
            <div className="font-bold mb-1 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Recommended Action</div>
            <div className="text-slate-300 text-xs">Upgrade <code className="bg-white/10 px-1 py-0.5 rounded text-emerald-300">express</code> from <code className="bg-white/10 px-1 py-0.5 rounded text-red-300">4.17.1</code> to <code className="bg-white/10 px-1 py-0.5 rounded text-emerald-300">4.19.2</code> to patch prototype pollution.</div>
            {step === 3 && <span className="w-2 h-4 bg-emerald-400 animate-pulse inline-block mt-2" />}
          </div>
        )}
        {step >= 4 && (
          <div className="flex items-center gap-2 text-slate-400 mt-2 animate-in fade-in duration-300">
            <span className="text-blue-400">❯</span> <span className="text-blue-400 font-semibold">Creating Pull Request... Done.</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. Dashboard Visual Mockup
const MOCK_TABS = ["Overview", "Repositories", "Vulnerabilities", "AI Copilot"];
const COPILOT_MESSAGES = [
  "System baseline normal. Monitoring active deployments.",
  "Analyzing new commit in 'frontend' repository...",
  "Alert: Prototype pollution detected in frontend. Want me to patch it?",
  "Generating fix... PR #142 created. Awaiting approval."
];

function DashboardMockup() {
  const [activeTab, setActiveTab] = useState(0);
  const [copilotStep, setCopilotStep] = useState(0);
  const [riskScore, setRiskScore] = useState(72);
  const [scanned, setScanned] = useState(1248);
  const [cves, setCves] = useState(14);

  useEffect(() => {
    const tabInterval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % MOCK_TABS.length);
    }, 3000);
    
    const copilotInterval = setInterval(() => {
      setCopilotStep((prev) => (prev + 1) % COPILOT_MESSAGES.length);
    }, 4500);
    
    const dataInterval = setInterval(() => {
      setRiskScore(prev => Math.max(0, Math.min(100, prev + (Math.floor(Math.random() * 3) - 1))));
      setScanned(prev => prev + Math.floor(Math.random() * 5));
      setCves(prev => Math.max(0, prev + (Math.random() > 0.8 ? (Math.floor(Math.random() * 3) - 1) : 0)));
    }, 1500);
    
    return () => {
      clearInterval(tabInterval);
      clearInterval(copilotInterval);
      clearInterval(dataInterval);
    };
  }, []);

  const TAB_CONTENT = [
    {
      title: "Deployment Analytics",
      desc: "Live security and operational signals.",
      chartTitle: "Vulnerability Trend",
      chartComponent: <WaveChart />,
      stats: [
        { label: "Risk Score", value: riskScore, color: "text-red-400", bg: "bg-red-500/10" },
        { label: "Scanned", value: scanned.toLocaleString(), color: "text-white", bg: "bg-blue-500/10" },
        { label: "Critical CVEs", value: cves, color: "text-orange-400", bg: "bg-orange-500/10" },
      ],
    },
    {
      title: "Active Repositories",
      desc: "Synced from GitHub organization.",
      chartTitle: "Scan Velocity",
      chartComponent: <BarChart />,
      stats: [
        { label: "Monitored", value: "42", color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { label: "Outdated", value: "8", color: "text-orange-400", bg: "bg-orange-500/10" },
        { label: "PRs Pending", value: "3", color: "text-blue-400", bg: "bg-blue-500/10" },
      ],
    },
    {
      title: "Security Posture",
      desc: "Open issues and patch status.",
      chartTitle: "Critical Issues Timeline",
      chartComponent: <SecurityLineChart />,
      stats: [
        { label: "Critical", value: cves, color: "text-red-400", bg: "bg-red-500/10" },
        { label: "High", value: "24", color: "text-orange-400", bg: "bg-orange-500/10" },
        { label: "Medium", value: "89", color: "text-yellow-400", bg: "bg-yellow-500/10" },
      ],
    },
    {
      title: "Copilot Activity",
      desc: "Auto-fixes and intelligent monitoring.",
      chartTitle: "Agent Actions Timeline",
      chartComponent: <ActivityGrid />,
      stats: [
        { label: "Auto-fixed", value: "1,024", color: "text-blue-400", bg: "bg-blue-500/10" },
        { label: "Active Agents", value: "3", color: "text-purple-400", bg: "bg-purple-500/10" },
        { label: "Lines Scanned", value: "2.4M", color: "text-emerald-400", bg: "bg-emerald-500/10" },
      ],
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 relative" style={{ perspective: "2000px" }}>
      <div className="absolute inset-0 bg-gradient-to-t from-[#080b14] via-transparent to-transparent z-10 top-[40%] pointer-events-none" />
      <div 
        className="relative rounded-3xl border border-white/10 bg-[#0d1117] p-2 shadow-[0_0_100px_-20px_rgba(79,70,229,0.3)] transform-gpu transition-all duration-700 hover:scale-[1.02]"
        style={{ transform: "rotateX(5deg) scale(0.95)" }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "rotateX(0deg) scale(1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "rotateX(5deg) scale(0.95)"; }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl pointer-events-none" />
        
        {/* CSS Mockup */}
        <div className="w-full h-[350px] sm:h-[450px] rounded-2xl bg-[#080b14] border border-white/5 overflow-hidden flex relative select-none">
          {/* Sidebar */}
          <div className="hidden sm:flex w-56 border-r border-white/5 p-4 flex-col gap-6 bg-white/[0.01]">
            <div className="flex items-center gap-2 mb-6">
              <img src="/Logo.png" alt="DevPulse Logo" className="w-5 h-5 object-contain" />
              <span className="font-bold text-white tracking-tight">DevPulse</span>
            </div>
            <div className="flex flex-col gap-2">
              {MOCK_TABS.map((tab, idx) => (
                <div 
                  key={tab}
                  className={`h-8 rounded-lg flex items-center px-3 text-xs transition-all duration-500 ${
                    activeTab === idx 
                      ? "bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold scale-105 origin-left shadow-lg shadow-blue-500/10" 
                      : "text-slate-500 border border-transparent"
                  }`}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>
          
          {/* Main Area */}
          <div className="flex-1 relative overflow-hidden">
            {TAB_CONTENT.map((tab, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 p-6 flex flex-col gap-6 transition-opacity duration-700 ease-in-out ${activeTab === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
              >
                 <div className="flex justify-between items-start">
                   <div>
                     <h2 className="text-xl font-bold text-white mb-1">{tab.title}</h2>
                     <p className="text-slate-400 text-xs">{tab.desc}</p>
                   </div>
                   <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> System Healthy
                   </div>
                 </div>
                 
                 {/* Stats Row */}
                 <div className="grid grid-cols-3 gap-3">
                    {tab.stats.map((stat, sIdx) => (
                      <div key={sIdx} className="h-24 bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-center relative overflow-hidden">
                         <div className="text-slate-400 text-xs mb-1">{stat.label}</div>
                         <div className={`text-2xl font-black ${stat.color} transition-colors`}>{stat.value}</div>
                         <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-xl ${stat.bg}`} />
                      </div>
                    ))}
                 </div>
    
                 {/* Main Chart Area */}
                 <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-4 relative overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-4 relative z-20">
                      <div className="text-xs font-semibold text-slate-300">{tab.chartTitle}</div>
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                    </div>
                    <div className="flex-1 relative w-full h-full overflow-hidden">
                       {tab.chartComponent}
                    </div>
                 </div>
              </div>
            ))}
             
             {/* Floating AI Copilot Widget */}
             <div className="absolute bottom-6 right-6 w-64 bg-[#0d1117]/90 backdrop-blur-md border border-blue-500/30 rounded-2xl p-3 shadow-2xl shadow-blue-500/20 transition-all duration-300 z-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center"><Zap className="w-3 h-3 text-white" /></div>
                  <div className="text-xs font-bold text-white">AI Copilot</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-[10px] text-slate-300 leading-relaxed border border-white/5 h-12 flex items-center overflow-hidden">
                  <div key={copilotStep} className="animate-fade-in">{COPILOT_MESSAGES[copilotStep]}</div>
                </div>
                {copilotStep === 3 && (
                  <div className="mt-2 bg-blue-500 hover:bg-blue-400 transition-colors text-white text-[10px] font-bold py-1.5 rounded flex justify-center cursor-pointer animate-fade-in shadow-lg shadow-blue-500/20">
                    Generate Fix
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#080b14]/90 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <div className="text-white font-semibold flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-blue-400" />
            DevPulse Platform Demo
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Video Player */}
        <div className="w-full aspect-video bg-black relative">
          <DemoVideoMockup />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage({ sessionError }) {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);
  const authError = searchParams.get("error");

  async function handleFeedbackSubmit(e) {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    try {
      await fetch(`${BACKEND_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: feedbackText })
      });
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    }

    setIsFeedbackSent(true);
    setFeedbackText("");
    setTimeout(() => setIsFeedbackSent(false), 5000);
  }

  function handleLoginWithGitHub() {
    setIsLoading(true);
    window.location.href = `${BACKEND_URL}/auth/github`;
  }

  return (
    <div className="min-h-screen bg-[#080b14] flex flex-col overflow-hidden relative font-sans text-slate-300">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", backgroundPosition: "center center" }} />

      {/* SaaS Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-4 border-b border-white/5 bg-[#080b14]/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src="/Logo.png" alt="DevPulse Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-black tracking-tight text-white">DevPulse</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
          <a href="#docs" className="hover:text-white transition-colors">Docs</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="https://github.com/SSSahil15/repo-for-testing" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors"><GithubIcon className="w-4 h-4"/> GitHub</a>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleLoginWithGitHub} className="text-sm font-bold text-white hover:text-blue-400 transition-colors hidden sm:block">
            Login
          </button>
          <button onClick={handleLoginWithGitHub} className="bg-white text-black text-sm font-bold px-5 py-2 rounded-lg hover:bg-slate-200 transition-colors active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Get Started
          </button>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center w-full">
        {/* HERO SECTION */}
        <section className="w-full max-w-5xl mx-auto px-6 pt-12 pb-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#4F46E5]/10 border border-[#4F46E5]/20 text-[#4F46E5] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full animate-pulse" />
            AI-Powered Deployment Intelligence
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-5">
            <span className="text-white">Ship faster with</span>
            <br />
            <span style={{ background: "linear-gradient(90deg,#22D3EE,#3B82F6,#8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              zero deployment fear.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            DevPulse continuously analyzes your CI/CD pipelines, security posture, deployment risks, and GitHub activity to prevent failures before they happen.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handleLoginWithGitHub}
              disabled={isLoading}
              className="group relative flex items-center justify-center gap-3 font-bold text-base px-8 py-4 rounded-xl active:scale-95 disabled:opacity-60 text-white overflow-hidden bg-blue-600 hover:bg-blue-500 transition-colors shadow-[0_0_30px_rgba(37,99,235,0.4)] w-full sm:w-auto"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GithubIcon className="w-5 h-5" />}
              {isLoading ? "Redirecting..." : "Connect GitHub"}
              {!isLoading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
            <button 
              onClick={() => setIsVideoModalOpen(true)}
              className="flex items-center justify-center gap-2 font-bold text-base px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-full sm:w-auto"
            >
              <PlayCircle className="w-5 h-5" /> View Demo
            </button>
          </div>

          {(authError || sessionError) && (
            <div className="mt-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3 max-w-md mx-auto">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-300">
                {authError === "github_denied" ? "GitHub authorization denied." :
                 authError === "auth_failed" ? "Authentication failed." :
                 sessionError || "Something went wrong."}
              </p>
            </div>
          )}
        </section>

        {/* Dashboard Mockup */}
        <section className="w-full px-6 pb-12 flex justify-center z-10">
          <DashboardMockup />
        </section>

        {/* Trust Indicators */}
        <section className="w-full border-y border-white/5 bg-white/[0.01] py-8 z-10">
          <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-6 md:gap-16 items-center text-slate-500 font-semibold text-sm">
            <div className="flex items-center gap-2"><Database className="w-4 h-4 text-emerald-400" /> 10K+ Scans Analyzed</div>
            <div className="flex items-center gap-2"><Target className="w-4 h-4 text-blue-400" /> 98.2% Detection Accuracy</div>
            <div className="flex items-center gap-2"><GithubIcon className="w-4 h-4 text-white" /> Native Integrations</div>
          </div>
        </section>

        {/* Stats Preview (Animated) */}
        <section className="w-full max-w-5xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Real-Time Risk Telemetry</h2>
            <p className="text-slate-400">Live operational signals right on your dashboard.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STAT_CARDS.map(({ label, value, suffix, color, bg, border, trend, trendColor }) => (
              <div key={label} className={`${bg} ${border} border rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">{label}</div>
                  <Activity className={`w-4 h-4 ${color} opacity-50`} />
                </div>
                <div className={`text-5xl font-black tracking-tighter ${color} mb-3 group-hover:scale-105 origin-left transition-transform duration-300 flex items-baseline`}>
                  <CountUp value={value} duration={2500} />{suffix}
                </div>
                <div className={`text-xs font-semibold ${trendColor} flex items-center gap-1 bg-white/5 inline-flex px-2 py-1 rounded-md`}>
                  {trend}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive AI Demo & About Split */}
        <section id="features" className="w-full max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Code2 className="w-4 h-4" /> Autonomous Intelligence
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              An AI Copilot that actually <span className="text-blue-400">fixes code</span>.
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              DevPulse doesn't just point out errors. Our built-in agent analyzes your repository context, pinpoints the vulnerable dependencies, and generates a precise Pull Request to patch the issue before deployment.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Deterministic pipeline analysis
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Automated CVE remediation
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Real-time WebSocket syncing
              </li>
            </ul>
            <button onClick={handleLoginWithGitHub} className="bg-white/10 hover:bg-white/20 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors border border-white/10">
              Try the Copilot
            </button>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-2xl rounded-[3rem]" />
            <InteractiveAIDemo />
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full max-w-5xl mx-auto px-6 py-12 mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Everything you need for secure deployments</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 group cursor-default">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-bold text-base mb-2 text-white">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Us & Contact Us */}
        <section className="relative z-10 w-full max-w-5xl mx-auto px-6 mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* About Us */}
          <div id="about" className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.05] transition-colors scroll-mt-24">
            <h3 className="font-bold text-lg mb-3 text-slate-200">About Us</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              DevPulse was engineered to solve the disconnect between CI/CD pipelines and security scanning. We believe developers deserve real-time, actionable intelligence directly inside their dashboard, turning noisy risk into a clear operational signal.
            </p>
          </div>

          {/* Contact Us */}
          <div id="contact" className="relative group bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.05] transition-colors flex flex-col justify-center scroll-mt-24 overflow-hidden">
            <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <h3 className="relative z-10 font-bold text-lg mb-6 text-slate-200">Connect with the Creator</h3>
            
            <div className="relative z-10 flex flex-col gap-4">
              <a href="mailto:ansarisahil3690@gmail.com" className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/30 hover:bg-blue-500/[0.05] transition-all group/email shadow-lg shadow-black/20">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover/email:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Email Address</div>
                  <div className="text-sm font-semibold text-slate-300 group-hover/email:text-blue-400 transition-colors">ansarisahil3690@gmail.com</div>
                </div>
              </a>

              <a href="https://github.com/SSSahil15" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/30 hover:bg-purple-500/[0.05] transition-all group/github shadow-lg shadow-black/20">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover/github:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">GitHub Profile</div>
                  <div className="text-sm font-semibold text-slate-300 group-hover/github:text-purple-400 transition-colors">github.com/SSSahil15</div>
                </div>
              </a>

              <a href="https://discord.gg/gGaqBAVrGq" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/30 hover:bg-indigo-500/[0.05] transition-all group/discord shadow-lg shadow-black/20">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover/discord:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 127.14 96.36"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a67.55,67.55,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-19.32-72.15ZM42.63,65.37c-5.36,0-9.83-4.9-9.83-10.94s4.39-10.94,9.83-10.94,9.88,4.9,9.83,10.94C52.46,60.47,48,65.37,42.63,65.37Zm41.9,0c-5.36,0-9.83-4.9-9.83-10.94s4.39-10.94,9.83-10.94,9.88,4.9,9.83,10.94C94.41,60.47,89.93,65.37,84.53,65.37Z"/></svg>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Discord Support</div>
                  <div className="text-sm font-semibold text-slate-300 group-hover/discord:text-indigo-400 transition-colors">Join our Server</div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section id="feedback" className="relative z-10 w-full max-w-5xl mx-auto px-6 mb-20 scroll-mt-24">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-200">Send Feedback</h3>
                <p className="text-xs text-slate-500">We'd love to hear your thoughts on DevPulse</p>
              </div>
            </div>

            {isFeedbackSent ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4" />
                <h4 className="text-lg font-bold text-slate-200 mb-2">Thank you!</h4>
                <p className="text-sm text-slate-400">Your feedback has been received. We appreciate your input.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="How can we improve DevPulse?"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all min-h-[120px] resize-y"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!feedbackText.trim()}
                    className="disabled:opacity-50 text-white bg-blue-600 hover:bg-blue-500 font-semibold text-sm px-6 py-2.5 rounded-xl active:scale-95 transition-all shadow-lg shadow-blue-600/20"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* SaaS Footer */}
      <footer className="relative z-10 bg-[#06080d] border-t border-white/5 pt-16 pb-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="/Logo.png" alt="DevPulse Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-black tracking-tight text-white">DevPulse</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 pr-4">
              The AI-powered DevSecOps platform for modern engineering teams. Ship faster, securely.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><TwitterIcon className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><GithubIcon className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><DiscordIcon className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>&copy; {new Date().getFullYear()} DevPulse Inc. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </div>
        </div>
      </footer>
      
      {/* Video Modal */}
      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
    </div>
  );
}

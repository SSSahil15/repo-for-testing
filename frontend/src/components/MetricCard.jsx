import { Info } from "lucide-react";

const toneMap = {
  danger:  { ring: "ring-red-500/30 bg-red-500/[0.02]",    text: "text-red-400",    glow: "bg-red-500/20", shadow: "shadow-[inset_0_1px_0_rgba(239,68,68,0.2)]" },
  warning: { ring: "ring-amber-500/30 bg-amber-500/[0.02]", text: "text-amber-400",  glow: "bg-amber-500/20", shadow: "shadow-[inset_0_1px_0_rgba(245,158,11,0.2)]" },
  success: { ring: "ring-emerald-500/30 bg-emerald-500/[0.02]", text: "text-emerald-400", glow: "bg-emerald-500/20", shadow: "shadow-[inset_0_1px_0_rgba(16,185,129,0.2)]" },
  neutral: { ring: "ring-white/10 bg-white/[0.02]",   text: "text-slate-300",  glow: "bg-blue-500/10", shadow: "shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" },
};

function MetricCard({ eyebrow, value, detail, tone = "neutral" }) {
  const t = toneMap[tone] || toneMap.neutral;
  return (
    <div className={`relative overflow-hidden rounded-2xl ring-1 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] ${t.ring} ${t.shadow}`}>
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</span>
          <div className="relative group">
            <Info className="w-3.5 h-3.5 text-slate-600 hover:text-slate-400 cursor-help transition-colors" />
            <div className="absolute bottom-full right-0 mb-2 w-52 bg-[#0f1421] border border-white/10 rounded-xl p-3 text-[11px] text-slate-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {detail}
            </div>
          </div>
        </div>
        <div className={`text-4xl font-black tracking-tight ${t.text}`}>
          {value}
          {typeof value === "number" && eyebrow.toLowerCase().includes("risk") && (
            <span className="text-sm font-normal text-slate-600 ml-1">/ 100</span>
          )}
        </div>
      </div>
      <div className={`absolute -right-6 -bottom-6 w-28 h-28 rounded-full blur-3xl opacity-30 ${t.glow}`} />
    </div>
  );
}

export default MetricCard;

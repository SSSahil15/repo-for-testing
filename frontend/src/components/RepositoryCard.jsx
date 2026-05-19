import { Lock, Globe, Star, Code2, Play, Loader2 } from "lucide-react";

function RepositoryCard({ isAnalyzing, isSelected, onAnalyze, onSelect, repository }) {
  return (
    <button
      onClick={() => onSelect(repository)}
      className={`w-full text-left p-4 rounded-xl transition-all duration-300 relative group overflow-hidden ${
        isSelected
          ? "bg-blue-600/10 ring-1 ring-blue-500/40 shadow-[inset_0_1px_0_rgba(59,130,246,0.2)]"
          : "bg-transparent hover:bg-white/[0.03] ring-1 ring-transparent hover:ring-white/10 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
      }`}
    >
      {/* Passing light shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-x-full group-hover:translate-x-full pointer-events-none" style={{ transitionDuration: '1s' }} />
      {isSelected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
      )}

      <div className="space-y-2 pl-1">
        {/* Name row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {repository.isPrivate
              ? <Lock className="w-3 h-3 text-amber-500/70 shrink-0" />
              : <Globe className="w-3 h-3 text-blue-400/70 shrink-0" />
            }
            <span className={`text-sm font-semibold truncate transition-colors ${isSelected ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
              {repository.name}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-600 shrink-0">
            <Star className="w-3 h-3" /> {repository.stargazersCount}
          </div>
        </div>

        {/* Description */}
        {repository.description && (
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
            {repository.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          {repository.language && (
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <Code2 className="w-3 h-3" />
              {repository.language}
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onAnalyze(repository); }}
            className={`ml-auto p-1.5 rounded-lg transition-all ${
              isAnalyzing
                ? "text-blue-400 bg-blue-500/15"
                : "text-slate-600 hover:text-blue-400 hover:bg-blue-500/10"
            }`}
            title="Analyze"
          >
            {isAnalyzing
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Play className="w-3.5 h-3.5 fill-current" />
            }
          </button>
        </div>
      </div>
    </button>
  );
}

export default RepositoryCard;

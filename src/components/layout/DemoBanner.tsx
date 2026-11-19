import React from 'react';
import { ShieldCheck, Database, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface DemoBannerProps {
  onOpenSettings: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onOpenSettings }) => {
  const { isSupabaseActive } = useAuth();
  const { geminiApiKey } = useData();

  return (
    <div className="bg-[#0D121F] border-b border-white/[0.06] text-[11px] px-4 py-1.5 flex items-center justify-between text-[#94A3B8]">
      <div className="flex items-center gap-3">
        {isSupabaseActive ? (
          <span className="flex items-center gap-1.5 text-[#2DD4BF] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Multi-Tenant PostgreSQL Cloud</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-amber-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <Database className="w-3.5 h-3.5" />
            <span>Interactive Demo Store (Local Persistence)</span>
          </span>
        )}

        <span className="text-white/20 hidden sm:inline">•</span>

        <span className="hidden sm:flex items-center gap-1 text-[#818CF8]">
          <Sparkles className="w-3 h-3" />
          <span>{geminiApiKey ? 'Gemini 1.5 Pro Connected' : 'NexusFlow AI Engine'}</span>
        </span>
      </div>

      <button
        onClick={onOpenSettings}
        className="text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1 font-mono transition"
      >
        <span>Configure Tenant / API Keys</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};

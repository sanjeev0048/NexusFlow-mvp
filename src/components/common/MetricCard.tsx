import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  subtitle?: string;
  trendLabel?: string;
  badge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  isPositive, 
  icon: Icon, 
  subtitle,
  trendLabel = 'vs last month',
  badge
}) => (
  <Card className="p-5 relative overflow-hidden group hover:border-[#818CF8]/30 transition-all duration-300" hoverable glowTop>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] font-mono">{title}</span>
        {badge && (
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-[#818CF8] border border-white/[0.06]">
            {badge}
          </span>
        )}
      </div>
      <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#818CF8] group-hover:scale-110 group-hover:text-[#2DD4BF] group-hover:border-[#2DD4BF]/30 transition-all duration-300">
        <Icon className="w-4 h-4" />
      </div>
    </div>

    <div className="mt-4 flex items-baseline justify-between">
      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight tabular-nums font-sans">
        {value}
      </h3>
      <div className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border transition-all ${
        isPositive 
          ? 'text-[#2DD4BF] bg-[#2DD4BF]/10 border-[#2DD4BF]/25' 
          : 'text-rose-400 bg-rose-500/10 border-rose-500/25'
      }`}>
        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
        <span>{change}</span>
      </div>
    </div>

    {subtitle && (
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#94A3B8] pt-2 border-t border-white/[0.04]">
        <span className="truncate">{subtitle}</span>
        <span className="text-slate-500 text-[10px] font-mono shrink-0 ml-2">{trendLabel}</span>
      </div>
    )}
  </Card>
);

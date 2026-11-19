import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  colorClass?: string;
  subtitle?: string;
  trendLabel?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  isPositive, 
  icon: Icon, 
  subtitle,
  trendLabel = 'vs last month'
}) => (
  <Card className="p-5 relative overflow-hidden group hover:border-white/20 transition-all duration-300" hoverable>
    {/* Subtle top border illumination */}
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#818CF8]/40 transition-all" />

    <div className="flex items-center justify-between">
      <span className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">{title}</span>
      <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#818CF8] group-hover:scale-105 group-hover:text-[#2DD4BF] transition-all">
        <Icon className="w-4 h-4" />
      </div>
    </div>

    <div className="mt-4 flex items-baseline justify-between">
      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight tabular-nums font-sans">
        {value}
      </h3>
      <div className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${
        isPositive 
          ? 'text-[#2DD4BF] bg-[#2DD4BF]/10 border-[#2DD4BF]/20' 
          : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
      }`}>
        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
        {change}
      </div>
    </div>

    {subtitle && (
      <div className="mt-2 flex items-center justify-between text-[11px] text-[#94A3B8]">
        <span>{subtitle}</span>
        <span className="text-slate-500 text-[10px]">{trendLabel}</span>
      </div>
    )}
  </Card>
);

import React from 'react';
import { Sparkles, Database, ShieldCheck, Cpu, ArrowUpRight, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { FlowAIChat } from '../components/ai/FlowAIChat';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../lib/utils';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const FlowAIPage: React.FC = () => {
  const { leads, products, orders, invoices, expenses, geminiApiKey } = useData();

  const totalRev = orders.reduce((s, o) => s + o.total, 0);
  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
  const netMargin = totalRev - totalExp;
  const pipelineVal = leads.filter(l => l.status !== 'Closed Lost').reduce((s, l) => s + l.value, 0);
  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;

  return (
    <div className="space-y-5 flex flex-col h-full animate-fadeIn pb-6">
      {/* 1. Header with exact requested title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#818CF8]/10 text-[#818CF8] text-[11px] font-mono border border-[#818CF8]/20 mb-2">
            <Sparkles className="w-3 h-3 text-[#2DD4BF]" />
            <span>Autonomous Intelligence Layer</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Meet your business intelligence layer.</span>
          </h1>

          <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">
            Query across live sales pipelines, warehouse stock buffers, accounts receivable and workforce telemetry with conversational precision.
          </p>
        </div>

        {/* Live System Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-[#101827] text-[#F8FAFC] border border-white/[0.08] flex items-center gap-2 font-mono text-[11px] shadow-card-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-ping" />
            <Database className="w-3.5 h-3.5 text-[#818CF8]" />
            <span>{leads.length} Leads • {products.length} SKUs • {orders.length} Orders</span>
          </span>

          <span className="px-3 py-1.5 rounded-xl bg-[#818CF8]/10 text-[#818CF8] border border-[#818CF8]/30 flex items-center gap-1.5 font-mono text-[11px] font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>{geminiApiKey ? 'Gemini 1.5 Pro Active' : 'Adaptive Local Engine'}</span>
          </span>
        </div>
      </div>

      {/* 2. Top Contextual Insights Snapshot Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#101827] border border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Active Pipeline</span>
            <div className="text-sm font-bold text-white tabular-nums">{formatCurrency(pipelineVal)}</div>
          </div>
          <span className="text-[10px] font-mono text-[#818CF8] bg-[#818CF8]/10 px-1.5 py-0.5 rounded">
            {leads.length} Accounts
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#101827] border border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Net Margin</span>
            <div className="text-sm font-bold text-[#2DD4BF] tabular-nums">{formatCurrency(netMargin)}</div>
          </div>
          <span className="text-[10px] font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 px-1.5 py-0.5 rounded">
            +14.2%
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#101827] border border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Stock Alerts</span>
            <div className="text-sm font-bold text-white tabular-nums">
              {lowStockCount > 0 ? `${lowStockCount} SKUs Low` : 'All Optimal'}
            </div>
          </div>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${lowStockCount > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-[#2DD4BF]/10 text-[#2DD4BF]'}`}>
            {lowStockCount > 0 ? 'Action' : 'Normal'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#101827] border border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Telemetry Latency</span>
            <div className="text-sm font-bold text-white tabular-nums">&lt; 14ms</div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            Syncing
          </span>
        </div>
      </div>

      {/* 3. Main Interactive AI Console */}
      <FlowAIChat />
    </div>
  );
};

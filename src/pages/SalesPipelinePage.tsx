import React, { useState } from 'react';
import { Briefcase, Plus, Filter, Download, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import { PipelineBoard } from '../components/crm/PipelineBoard';
import { LeadModal } from '../components/crm/LeadModal';
import { Lead } from '../types';
import { useData } from '../context/DataContext';
import { formatCurrency, exportToCSV } from '../lib/utils';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const SalesPipelinePage: React.FC = () => {
  const { leads, updateLeadStatus, convertLeadToCustomer } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const activeLeads = leads.filter(l => l.status !== 'Closed Lost');
  const totalPipelineValue = activeLeads.reduce((sum, l) => sum + l.value, 0);
  const wonValue = leads.filter(l => l.status === 'Closed Won').reduce((sum, l) => sum + l.value, 0);
  const avgDealSize = leads.length > 0 ? Math.round(totalPipelineValue / (activeLeads.length || 1)) : 0;

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleNewDeal = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    exportToCSV('NexusFlow_Sales_Pipeline', leads);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#818CF8]/10 text-[#818CF8] text-[11px] font-mono border border-[#818CF8]/25 mb-1.5">
            <Briefcase className="w-3 h-3 text-[#2DD4BF]" />
            <span>Revenue Velocity Funnel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sales Pipeline Kanban
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Drag or advance deals across stages with automated AI probability scoring and contract values.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-[#101827] hover:bg-[#151F32] border border-white/[0.08] text-[#94A3B8] hover:text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition shadow-card-subtle"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleNewDeal}
            className="px-4 py-2 bg-[#818CF8] hover:bg-[#6366F1] text-[#080B14] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-glow-primary transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Deal</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08] shadow-card-subtle">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Active Pipeline Value</span>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-1 tabular-nums">
            {formatCurrency(totalPipelineValue)}
          </div>
          <span className="text-[11px] text-[#818CF8] font-mono mt-0.5 block">{activeLeads.length} open opportunities</span>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08] shadow-card-subtle">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Won Revenue</span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#2DD4BF] mt-1 tabular-nums">
            {formatCurrency(wonValue)}
          </div>
          <span className="text-[11px] text-[#2DD4BF] font-mono mt-0.5 block">100% Closed</span>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08] shadow-card-subtle">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Avg Deal Size</span>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-1 tabular-nums">
            {formatCurrency(avgDealSize)}
          </div>
          <span className="text-[11px] text-[#94A3B8] font-mono mt-0.5 block">Across enterprise deals</span>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08] shadow-card-subtle">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8]">AI Conversion Likelihood</span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#818CF8] mt-1 tabular-nums">
            84.2%
          </div>
          <span className="text-[11px] text-[#2DD4BF] font-mono mt-0.5 block">High confidence</span>
        </div>
      </div>

      {/* Kanban Board */}
      <PipelineBoard
        leads={leads}
        onSelectLead={handleSelectLead}
        onUpdateStatus={updateLeadStatus}
        onConvertToCustomer={convertLeadToCustomer}
      />

      {/* Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        leadToEdit={selectedLead}
      />
    </div>
  );
};

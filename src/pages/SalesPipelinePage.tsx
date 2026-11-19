import React, { useState } from 'react';
import { Briefcase, Plus, Filter, Download } from 'lucide-react';
import { PipelineBoard } from '../components/crm/PipelineBoard';
import { LeadModal } from '../components/crm/LeadModal';
import { Lead } from '../types';
import { useData } from '../context/DataContext';
import { formatCurrency, exportToCSV } from '../lib/utils';

export const SalesPipelinePage: React.FC = () => {
  const { leads, updateLeadStatus, convertLeadToCustomer } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const totalPipelineValue = leads
    .filter(l => l.status !== 'Closed Lost')
    .reduce((sum, l) => sum + l.value, 0);

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <span>Sales Pipeline Kanban</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Active pipeline velocity: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(totalPipelineValue)}</strong> across {leads.length} accounts.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Deals
          </button>
          <button
            onClick={handleNewDeal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition"
          >
            <Plus className="w-4 h-4" /> New Deal
          </button>
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

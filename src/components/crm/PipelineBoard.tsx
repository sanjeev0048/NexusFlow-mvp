import React from 'react';
import { ArrowRight, CheckCircle2, XCircle, Sparkles, User, DollarSign } from 'lucide-react';
import { Lead, LeadStatus } from '../../types';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../lib/utils';

interface PipelineBoardProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onConvertToCustomer: (id: string) => void;
}

const STAGES: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'New', label: 'New Inbound', color: 'border-blue-500' },
  { id: 'Contacted', label: 'Contacted', color: 'border-indigo-500' },
  { id: 'Qualified', label: 'Qualified', color: 'border-purple-500' },
  { id: 'Proposal', label: 'Proposal Sent', color: 'border-amber-500' },
  { id: 'Closed Won', label: 'Closed Won', color: 'border-emerald-500' },
  { id: 'Closed Lost', label: 'Closed Lost', color: 'border-rose-500' },
];

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  leads,
  onSelectLead,
  onUpdateStatus,
  onConvertToCustomer
}) => {
  const getNextStage = (current: LeadStatus): LeadStatus | null => {
    switch (current) {
      case 'New': return 'Contacted';
      case 'Contacted': return 'Qualified';
      case 'Qualified': return 'Proposal';
      case 'Proposal': return 'Closed Won';
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
      {STAGES.map(stage => {
        const stageLeads = leads.filter(l => l.status === stage.id);
        const stageTotal = stageLeads.reduce((acc, l) => acc + l.value, 0);

        return (
          <div 
            key={stage.id} 
            className="bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col min-w-[240px]"
          >
            {/* Stage Header */}
            <div className={`border-t-2 ${stage.color} pt-2 mb-3 flex items-center justify-between`}>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {stage.label}
                </h4>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {formatCurrency(stageTotal)}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                {stageLeads.length}
              </span>
            </div>

            {/* Stage Cards */}
            <div className="space-y-2.5 flex-1 overflow-y-auto">
              {stageLeads.length === 0 ? (
                <div className="h-24 border border-dashed border-slate-300 dark:border-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-400">
                  No deals
                </div>
              ) : (
                stageLeads.map(lead => {
                  const nextStage = getNextStage(lead.status);

                  return (
                    <div
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-blue-500/50 transition cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <h5 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                          {lead.name}
                        </h5>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {formatCurrency(lead.value)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">
                        {lead.company}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                        <span className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
                          <Sparkles className="w-3 h-3" />
                          <span>AI: {lead.score}</span>
                        </span>
                        <span className="text-slate-400 flex items-center gap-1 truncate max-w-[100px]">
                          <User className="w-3 h-3" />
                          {lead.assignedTo?.split(' ')[0] || 'Unassigned'}
                        </span>
                      </div>

                      {/* Quick stage advance buttons */}
                      <div 
                        className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {lead.status !== 'Closed Won' && lead.status !== 'Closed Lost' && (
                          <>
                            {nextStage && (
                              <button
                                onClick={() => onUpdateStatus(lead.id, nextStage)}
                                className="px-2 py-0.5 text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 rounded hover:bg-blue-100 transition flex items-center gap-1"
                                title={`Advance to ${nextStage}`}
                              >
                                <span>Advance</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            <div className="flex items-center gap-1 ml-auto">
                              <button
                                onClick={() => onConvertToCustomer(lead.id)}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition"
                                title="Mark Won & Convert to Customer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onUpdateStatus(lead.id, 'Closed Lost')}
                                className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition"
                                title="Mark Closed Lost"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}

                        {lead.status === 'Closed Won' && (
                          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Won & Converted
                          </span>
                        )}
                        {lead.status === 'Closed Lost' && (
                          <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Lost
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

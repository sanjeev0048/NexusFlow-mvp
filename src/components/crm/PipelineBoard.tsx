import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle, Sparkles, User, DollarSign, GripVertical } from 'lucide-react';
import { Lead, LeadStatus } from '../../types';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../lib/utils';

interface PipelineBoardProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onConvertToCustomer: (id: string) => void;
}

const STAGES: { id: LeadStatus; label: string; accentColor: string; pillColor: string }[] = [
  { id: 'New', label: 'New Inbound', accentColor: '#818CF8', pillColor: 'border-[#818CF8]/30 text-[#818CF8]' },
  { id: 'Contacted', label: 'Contacted', accentColor: '#6366F1', pillColor: 'border-indigo-400/30 text-indigo-300' },
  { id: 'Qualified', label: 'Qualified', accentColor: '#A855F7', pillColor: 'border-purple-400/30 text-purple-300' },
  { id: 'Proposal', label: 'Proposal Sent', accentColor: '#F59E0B', pillColor: 'border-amber-400/30 text-amber-300' },
  { id: 'Closed Won', label: 'Closed Won', accentColor: '#2DD4BF', pillColor: 'border-[#2DD4BF]/30 text-[#2DD4BF]' },
  { id: 'Closed Lost', label: 'Closed Lost', accentColor: '#F43F5E', pillColor: 'border-rose-500/30 text-rose-400' },
];

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  leads,
  onSelectLead,
  onUpdateStatus,
  onConvertToCustomer
}) => {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStatus | null>(null);

  const getNextStage = (current: LeadStatus): LeadStatus | null => {
    switch (current) {
      case 'New': return 'Contacted';
      case 'Contacted': return 'Qualified';
      case 'Qualified': return 'Proposal';
      case 'Proposal': return 'Closed Won';
      default: return null;
    }
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: LeadStatus) => {
    e.preventDefault();
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, stageId: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (leadId) {
      onUpdateStatus(leadId, stageId);
    }
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
      {STAGES.map(stage => {
        const stageLeads = leads.filter(l => l.status === stage.id);
        const stageTotal = stageLeads.reduce((acc, l) => acc + l.value, 0);
        const isTargeted = dragOverStage === stage.id;

        return (
          <div 
            key={stage.id} 
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
            className={`rounded-2xl p-3 flex flex-col min-w-[250px] transition-all duration-200 ${
              isTargeted 
                ? 'bg-[#151F32] border-2 border-[#818CF8] shadow-glow-primary' 
                : 'bg-[#101827] border border-white/[0.08] shadow-card-subtle'
            }`}
          >
            {/* Stage Header */}
            <div className="pb-3 mb-3 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.accentColor }} />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    {stage.label}
                  </h4>
                </div>
                <span className="text-[11px] font-mono font-semibold text-[#94A3B8] block mt-0.5 tabular-nums">
                  {formatCurrency(stageTotal)}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-white/[0.04] border ${stage.pillColor}`}>
                {stageLeads.length}
              </span>
            </div>

            {/* Stage Cards */}
            <div className="space-y-2.5 flex-1 overflow-y-auto min-h-[300px]">
              {stageLeads.length === 0 ? (
                <div className="h-28 border border-dashed border-white/[0.08] rounded-xl flex items-center justify-center text-xs text-slate-500 font-mono">
                  Drop deals here
                </div>
              ) : (
                stageLeads.map(lead => {
                  const nextStage = getNextStage(lead.status);

                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => onSelectLead(lead)}
                      className="bg-[#151F32] border border-white/[0.08] rounded-xl p-3.5 shadow-card-subtle hover:border-[#818CF8]/40 hover:shadow-card-elevated hover:bg-[#18243a] transition-all cursor-grab active:cursor-grabbing group select-none relative"
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h5 className="font-semibold text-xs text-white group-hover:text-[#818CF8] transition leading-snug truncate pr-2">
                          {lead.name}
                        </h5>
                        <span className="text-xs font-extrabold text-[#F8FAFC] tabular-nums font-sans">
                          {formatCurrency(lead.value)}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#94A3B8] mb-2.5 truncate font-medium">
                        {lead.company}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[10px] font-mono">
                        <span className="inline-flex items-center gap-1 text-[#818CF8] font-semibold bg-[#818CF8]/10 px-1.5 py-0.5 rounded border border-[#818CF8]/20">
                          <Sparkles className="w-3 h-3 text-[#2DD4BF]" />
                          <span>AI: {lead.score}%</span>
                        </span>
                        <span className="text-slate-400 flex items-center gap-1 truncate max-w-[100px]">
                          <User className="w-3 h-3" />
                          <span>{lead.assignedTo?.split(' ')[0] || 'Unassigned'}</span>
                        </span>
                      </div>

                      {/* Quick stage advance buttons */}
                      <div 
                        className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {lead.status !== 'Closed Won' && lead.status !== 'Closed Lost' && (
                          <>
                            {nextStage && (
                              <button
                                onClick={() => onUpdateStatus(lead.id, nextStage)}
                                className="px-2 py-0.5 text-[10px] font-semibold bg-[#818CF8]/15 hover:bg-[#818CF8]/25 text-[#818CF8] border border-[#818CF8]/30 rounded-md transition flex items-center gap-1 active:scale-95"
                                title={`Advance to ${nextStage}`}
                              >
                                <span>Advance</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            <div className="flex items-center gap-1 ml-auto">
                              <button
                                onClick={() => onConvertToCustomer(lead.id)}
                                className="p-1 text-[#2DD4BF] hover:bg-[#2DD4BF]/20 rounded-md transition"
                                title="Mark Won & Convert to Client Account"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onUpdateStatus(lead.id, 'Closed Lost')}
                                className="p-1 text-rose-400 hover:bg-rose-500/20 rounded-md transition"
                                title="Mark Closed Lost"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}

                        {lead.status === 'Closed Won' && (
                          <span className="text-[10px] text-[#2DD4BF] font-semibold flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3 h-3" /> Won & Converted
                          </span>
                        )}
                        {lead.status === 'Closed Lost' && (
                          <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 font-mono">
                            <XCircle className="w-3 h-3" /> Lost Deal
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

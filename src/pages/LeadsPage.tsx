import React, { useState } from 'react';
import { 
  Users, Plus, Trash2, Edit3, UserCheck, Sparkles, Phone, Mail, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { LeadModal } from '../components/crm/LeadModal';
import { Lead, LeadStatus } from '../types';
import { useData } from '../context/DataContext';
import { formatCurrency, exportToCSV } from '../lib/utils';

export const LeadsPage: React.FC = () => {
  const { leads, deleteLead, updateLeadStatus, assignLeadEmployee, convertLeadToCustomer, employees } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = filteredLeads.reduce((s, l) => s + l.value, 0);

  const handleExport = () => {
    exportToCSV('NexusFlow_CRM_Leads', filteredLeads);
  };

  const handleEdit = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setLeadToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#818CF8]/10 text-[#818CF8] text-[11px] font-mono border border-[#818CF8]/25 mb-1.5">
            <Users className="w-3 h-3 text-[#2DD4BF]" />
            <span>Lead & Account Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Leads & Prospects
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage sales pipeline contacts, account executives & automated AI conversion probability.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <span className="px-3 py-1.5 rounded-xl bg-[#101827] border border-white/[0.08]">
            Filtered Volume: <strong className="text-white tabular-nums">{formatCurrency(totalValue)}</strong>
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search lead name, company or email..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={[
          { label: 'All Statuses', value: 'All' },
          { label: 'New', value: 'New' },
          { label: 'Contacted', value: 'Contacted' },
          { label: 'Qualified', value: 'Qualified' },
          { label: 'Proposal', value: 'Proposal' },
          { label: 'Closed Won', value: 'Closed Won' },
          { label: 'Closed Lost', value: 'Closed Lost' },
        ]}
        onExport={handleExport}
        onAddClick={handleNew}
        addLabel="Create Lead"
      />

      {/* Table */}
      <Card className="overflow-hidden border-white/[0.08]" elevated>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#151F32]/80 border-b border-white/[0.08] text-[11px] uppercase font-mono tracking-wider text-[#94A3B8]">
                <th className="p-4">Prospect & Company</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Deal Value</th>
                <th className="p-4">AI Score</th>
                <th className="p-4">Pipeline Stage</th>
                <th className="p-4">Account Rep</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#94A3B8]">
                    No prospects match current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#151F32] border border-white/10 text-white flex items-center justify-center font-bold text-xs">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-[#818CF8] transition text-sm">
                            {lead.name}
                          </div>
                          <div className="text-[11px] text-[#94A3B8]">
                            {lead.company}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-[#94A3B8]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{lead.email}</span>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-white text-sm tabular-nums">
                      {formatCurrency(lead.value)}
                    </td>

                    <td className="p-4">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#818CF8]/10 text-[#818CF8] font-mono text-[11px] border border-[#818CF8]/25 font-semibold">
                        <Sparkles className="w-3 h-3 text-[#2DD4BF]" />
                        <span>{lead.score}%</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <Badge 
                        variant={
                          lead.status === 'Closed Won' ? 'success' : 
                          lead.status === 'Closed Lost' ? 'danger' : 
                          lead.status === 'Proposal' ? 'warning' :
                          lead.status === 'Qualified' ? 'purple' : 'info'
                        }
                      >
                        {lead.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-[#94A3B8]">
                      <select
                        value={lead.assignedTo || 'Unassigned'}
                        onChange={(e) => assignLeadEmployee(lead.id, e.target.value)}
                        className="bg-[#151F32] border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#818CF8]/50"
                      >
                        <option value="Unassigned">Unassigned</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.name} className="bg-[#101827]">
                            {emp.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {lead.status !== 'Closed Won' && (
                          <button
                            onClick={() => convertLeadToCustomer(lead.id)}
                            className="p-1.5 rounded-lg bg-[#2DD4BF]/10 hover:bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/25 transition"
                            title="Convert to Client Account"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(lead)}
                          className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06] transition"
                          title="Edit Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 transition"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        leadToEdit={leadToEdit}
      />
    </div>
  );
};

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Leads & Prospects</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage sales pipeline contacts, assign account executives & AI conversion scoring.
          </p>
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
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                <th className="p-4">Contact & Company</th>
                <th className="p-4">Deal Value</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Sales Owner</th>
                <th className="p-4">FlowAI Score</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No leads found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span>{lead.name}</span>
                        <span className="text-xs font-normal text-slate-400">({lead.company})</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-normal text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                        {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>}
                      </div>
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(lead.value)}
                    </td>

                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className="text-xs font-semibold px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Closed Won">Closed Won</option>
                        <option value="Closed Lost">Closed Lost</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <select
                        value={lead.assignedTo || 'Unassigned'}
                        onChange={(e) => assignLeadEmployee(lead.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
                      >
                        <option value="Unassigned">Unassigned</option>
                        {employees.map(e => (
                          <option key={e.id} value={e.name}>{e.name}</option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              lead.score >= 80 ? 'bg-emerald-500' : lead.score >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                            }`} 
                            style={{ width: `${lead.score}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {lead.score}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {lead.status !== 'Closed Won' && (
                          <button
                            onClick={() => convertLeadToCustomer(lead.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition"
                            title="Convert to Customer Account"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(lead)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                          title="Edit Lead"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        leadToEdit={leadToEdit}
      />
    </div>
  );
};

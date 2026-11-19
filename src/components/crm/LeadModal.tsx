import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Lead, LeadStatus } from '../../types';
import { useData } from '../../context/DataContext';
import { calculateAILeadScore } from '../../lib/utils';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit?: Lead | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, leadToEdit }) => {
  const { addLead, updateLead, employees } = useData();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [value, setValue] = useState(25000);
  const [status, setStatus] = useState<LeadStatus>('New');
  const [assignedTo, setAssignedTo] = useState('Unassigned');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (leadToEdit) {
      setName(leadToEdit.name);
      setCompany(leadToEdit.company);
      setEmail(leadToEdit.email);
      setPhone(leadToEdit.phone || '');
      setValue(leadToEdit.value);
      setStatus(leadToEdit.status);
      setAssignedTo(leadToEdit.assignedTo || 'Unassigned');
      setNotes(leadToEdit.notes || '');
    } else {
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setValue(30000);
      setStatus('New');
      setAssignedTo(employees[0]?.name || 'Unassigned');
      setNotes('');
    }
  }, [leadToEdit, isOpen, employees]);

  const previewScore = calculateAILeadScore({ value: Number(value), email, company, status });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadToEdit) {
      updateLead(leadToEdit.id, {
        name,
        company,
        email,
        phone,
        value: Number(value),
        status,
        assignedTo,
        notes
      });
    } else {
      addLead({
        name,
        company,
        email,
        phone,
        value: Number(value),
        status,
        assignedTo,
        notes
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={leadToEdit ? 'Edit CRM Prospect' : 'Create New CRM Lead'}
      subtitle="Configure prospect pipeline stage, contact details, and value"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Contact Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Company / Organization *</label>
            <input
              type="text"
              required
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Work Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="sarah@acme.com"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Est. Deal Value ($) *</label>
            <input
              type="number"
              required
              min="0"
              step="1000"
              value={value}
              onChange={e => setValue(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Pipeline Stage</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as LeadStatus)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Assign Sales Owner</label>
          <select
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          >
            <option value="Unassigned">Unassigned</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.name}>{emp.name} ({emp.department})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Notes & Requirements</label>
          <textarea
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Specific customer pain points, requested integrations, budget notes..."
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* AI Score Preview */}
        <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="font-medium">FlowAI Predicted Conversion Score</span>
          </div>
          <span className="text-sm font-bold text-purple-700 dark:text-purple-300">{previewScore}/100</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-sm shadow-blue-500/20 transition"
          >
            {leadToEdit ? 'Save Changes' : 'Create Lead'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

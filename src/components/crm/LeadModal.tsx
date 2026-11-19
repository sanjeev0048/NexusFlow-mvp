import React, { useState, useEffect } from 'react';
import { Sparkles, DollarSign, Building2, User, Mail, Phone, FileText } from 'lucide-react';
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
      subtitle="Configure prospect pipeline stage, contact details, and deal value"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Contact Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Company / Organization *</label>
            <input
              type="text"
              required
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Work Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="sarah@acme.com"
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 019-2834"
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Deal Value ($ USD) *</label>
            <input
              type="number"
              required
              min={0}
              step={1000}
              value={value}
              onChange={e => setValue(Number(e.target.value))}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white tabular-nums focus:outline-none focus:border-[#818CF8]/60 transition font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Pipeline Stage</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as LeadStatus)}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#818CF8]/60 transition"
            >
              <option value="New" className="bg-[#101827]">New Inbound</option>
              <option value="Contacted" className="bg-[#101827]">Contacted</option>
              <option value="Qualified" className="bg-[#101827]">Qualified</option>
              <option value="Proposal" className="bg-[#101827]">Proposal Sent</option>
              <option value="Closed Won" className="bg-[#101827]">Closed Won</option>
              <option value="Closed Lost" className="bg-[#101827]">Closed Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Assigned Executive</label>
            <select
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#818CF8]/60 transition"
            >
              <option value="Unassigned" className="bg-[#101827]">Unassigned</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.name} className="bg-[#101827]">
                  {emp.name} ({emp.department})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic AI Score Preview */}
        <div className="p-3 rounded-xl bg-[#080B14] border border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#818CF8]" />
            <span className="text-xs text-[#94A3B8]">AI Conversion Probability Preview:</span>
          </div>
          <span className="text-xs font-mono font-bold text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded-md border border-[#2DD4BF]/25">
            {previewScore}% Win Confidence
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Notes & Context</label>
          <textarea
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Record client timeline, decision maker notes, or specific requirements..."
            className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
          />
        </div>

        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#94A3B8] hover:text-white border border-white/[0.08] font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#818CF8] hover:bg-[#6366F1] text-[#080B14] font-bold shadow-glow-primary transition active:scale-95"
          >
            {leadToEdit ? 'Save Changes' : 'Create Lead'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ExpenseCategory } from '../../types';
import { useData } from '../../context/DataContext';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose }) => {
  const { addExpense } = useData();

  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Infrastructure');
  const [amount, setAmount] = useState<number>(2500);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor.trim()) return;

    addExpense({
      vendor,
      category,
      amount: Number(amount),
      date,
      description
    });

    onClose();
    setVendor('');
    setDescription('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Corporate Expenditure"
      subtitle="Log operational vendor costs, infrastructure, SaaS subscriptions or travel"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Vendor / Payee *</label>
          <input
            type="text"
            required
            value={vendor}
            onChange={e => setVendor(e.target.value)}
            placeholder="e.g. Amazon Web Services, Slack, Stripe, Vercel"
            className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ExpenseCategory)}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#818CF8]/60 transition cursor-pointer"
            >
              <option value="Infrastructure" className="bg-[#101827]">Infrastructure</option>
              <option value="Office & Rent" className="bg-[#101827]">Office & Rent</option>
              <option value="Marketing" className="bg-[#101827]">Marketing</option>
              <option value="Software & Tools" className="bg-[#101827]">Software & Tools</option>
              <option value="Travel" className="bg-[#101827]">Travel</option>
              <option value="Payroll" className="bg-[#101827]">Payroll</option>
              <option value="Other" className="bg-[#101827]">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Amount ($ USD) *</label>
            <input
              type="number"
              required
              min="1"
              step="10"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white font-mono tabular-nums focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Expense Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-[#818CF8]/60 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Business Notes & Purpose</label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Record cost allocation purpose, department approval, or invoice receipt details..."
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
            className="px-5 py-2 bg-[#818CF8] hover:bg-[#6366F1] text-[#080B14] font-bold rounded-xl shadow-glow-primary transition active:scale-95"
          >
            Record Expense
          </button>
        </div>
      </form>
    </Modal>
  );
};

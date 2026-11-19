import React, { useState } from 'react';
import { Plus, Trash2, Calculator, Receipt } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Invoice, InvoiceItem, InvoiceStatus } from '../../types';
import { useData } from '../../context/DataContext';
import { formatCurrency, generateId } from '../../lib/utils';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose }) => {
  const { addInvoice, customers } = useData();

  const [client, setClient] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState<InvoiceStatus>('Pending');
  const [taxRate, setTaxRate] = useState(10);
  const [notes, setNotes] = useState('Payment is due within 30 days of issue date.');

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: generateId('II'), description: 'Enterprise License Tier 1', quantity: 1, unitPrice: 5000, total: 5000 }
  ]);

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCompany = e.target.value;
    setClient(selectedCompany);
    const found = customers.find(c => c.company === selectedCompany);
    if (found) {
      setClientEmail(found.email);
    }
  };

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      { id: generateId('II'), description: '', quantity: 1, unitPrice: 1000, total: 1000 }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleItemChange = (id: string, field: 'description' | 'quantity' | 'unitPrice', val: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: val };
        const q = field === 'quantity' ? Number(val) : item.quantity;
        const p = field === 'unitPrice' ? Number(val) : item.unitPrice;
        updated.total = Math.max(0, q * p);
        return updated;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((acc, itm) => acc + itm.total, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim() || items.length === 0) return;

    addInvoice({
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      client,
      clientEmail,
      subtotal,
      taxRate: Number(taxRate),
      taxAmount,
      totalAmount,
      issueDate,
      dueDate,
      status,
      items,
      notes
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Itemized Invoice"
      subtitle="Issue an accounts receivable invoice with automated tax calculations"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Client / Company Name *</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={client}
                onChange={e => setClient(e.target.value)}
                placeholder="e.g. Acme Hypercloud"
                className="flex-1 p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
              />
              {customers.length > 0 && (
                <select
                  onChange={handleClientSelect}
                  className="w-28 p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                  title="Pick existing customer"
                >
                  <option value="">Quick Pick</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.company} className="bg-[#101827]">{c.company}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Client Billing Email</label>
            <input
              type="email"
              value={clientEmail}
              onChange={e => setClientEmail(e.target.value)}
              placeholder="billing@acme.com"
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Issue Date</label>
            <input
              type="date"
              required
              value={issueDate}
              onChange={e => setIssueDate(e.target.value)}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Due Date</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Initial Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as InvoiceStatus)}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#818CF8]/60 transition cursor-pointer"
            >
              <option value="Pending" className="bg-[#101827]">Pending</option>
              <option value="Paid" className="bg-[#101827]">Paid</option>
              <option value="Overdue" className="bg-[#101827]">Overdue</option>
            </select>
          </div>
        </div>

        {/* Line Items Section */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#94A3B8]">Invoice Line Items</span>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs text-[#818CF8] hover:text-white font-semibold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>

          <div className="space-y-2 border border-white/[0.08] rounded-xl p-3 bg-[#080B14]">
            {items.map((item, index) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder={`Item description ${index + 1}`}
                  value={item.description}
                  onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                  className="flex-1 w-full p-2 bg-[#151F32] border border-white/[0.08] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
                />

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="w-20">
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={e => handleItemChange(item.id, 'quantity', e.target.value)}
                      className="w-full p-2 bg-[#151F32] border border-white/[0.08] rounded-lg text-xs text-white text-center font-mono"
                    />
                  </div>

                  <div className="w-28">
                    <input
                      type="number"
                      required
                      min="0"
                      step="50"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={e => handleItemChange(item.id, 'unitPrice', e.target.value)}
                      className="w-full p-2 bg-[#151F32] border border-white/[0.08] rounded-lg text-xs text-white text-right font-mono"
                    />
                  </div>

                  <div className="w-24 text-right font-mono font-bold text-white tabular-nums pr-2">
                    {formatCurrency(item.total)}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={items.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-rose-400 disabled:opacity-20 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation summary */}
        <div className="p-4 rounded-xl bg-[#151F32] border border-white/[0.08] space-y-2">
          <div className="flex justify-between text-xs text-[#94A3B8]">
            <span>Subtotal:</span>
            <span className="font-mono text-white tabular-nums">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-[#94A3B8]">
            <div className="flex items-center gap-2">
              <span>Tax Rate (%):</span>
              <input
                type="number"
                min="0"
                max="100"
                value={taxRate}
                onChange={e => setTaxRate(Number(e.target.value))}
                className="w-16 p-1 bg-[#080B14] border border-white/[0.08] rounded text-center text-xs text-white font-mono"
              />
            </div>
            <span className="font-mono text-white tabular-nums">{formatCurrency(taxAmount)}</span>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex justify-between text-sm font-bold text-white">
            <span>Total Payable:</span>
            <span className="text-base text-[#2DD4BF] font-mono tabular-nums">{formatCurrency(totalAmount)}</span>
          </div>
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
            Issue Invoice
          </button>
        </div>
      </form>
    </Modal>
  );
};

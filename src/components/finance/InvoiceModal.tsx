import React, { useState } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
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

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim()) return;

    addInvoice({
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      client,
      clientEmail,
      subtotal,
      taxRate,
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
      title="Create New Accounts Receivable Invoice"
      subtitle="Issue itemized bill with automatic tax and balance calculation"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Select Client / Customer *</label>
            <div className="flex gap-2">
              <select
                value={client}
                onChange={handleClientSelect}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select an account...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.company}>{c.company} ({c.name})</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Billing Email *</label>
            <input
              type="email"
              required
              value={clientEmail}
              onChange={e => setClientEmail(e.target.value)}
              placeholder="billing@company.com"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Issue Date</label>
            <input
              type="date"
              value={issueDate}
              onChange={e => setIssueDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Payment Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as InvoiceStatus)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Line Items</span>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Line
            </button>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="p-3 w-1/2">Description</th>
                  <th className="p-3 w-20 text-center">Qty</th>
                  <th className="p-3 w-28">Rate ($)</th>
                  <th className="p-3 w-28 text-right">Subtotal</th>
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2">
                      <input
                        type="text"
                        required
                        value={item.description}
                        onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                        placeholder="Item or service description..."
                        className="w-full p-2 bg-transparent border border-transparent focus:border-blue-500 rounded text-slate-900 dark:text-white focus:outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        required
                        value={item.quantity}
                        onChange={e => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                        className="w-full p-2 text-center bg-transparent border border-transparent focus:border-blue-500 rounded text-slate-900 dark:text-white focus:outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        step="10"
                        required
                        value={item.unitPrice}
                        onChange={e => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                        className="w-full p-2 bg-transparent border border-transparent focus:border-blue-500 rounded text-slate-900 dark:text-white focus:outline-none"
                      />
                    </td>
                    <td className="p-2 text-right font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(item.total)}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length <= 1}
                        className="text-slate-400 hover:text-rose-500 disabled:opacity-30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculations & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Invoice Notes & Wire Terms</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs">
              <span className="flex items-center gap-1">
                <span>Tax Rate:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={e => setTaxRate(Number(e.target.value))}
                  className="w-12 px-1 py-0.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-center font-bold text-slate-900 dark:text-white"
                />%
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 dark:text-white">Total Amount Due:</span>
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
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
            Issue Invoice
          </button>
        </div>
      </form>
    </Modal>
  );
};

import React from 'react';
import { Printer, CheckCircle, Download, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Invoice } from '../../types';
import { Badge } from '../common/Badge';
import { NexusLogo } from '../common/NexusLogo';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useData } from '../../context/DataContext';

interface InvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({ isOpen, onClose, invoice }) => {
  const { updateInvoiceStatus } = useData();

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice #${invoice.invoiceNumber}`}
      subtitle={`Client: ${invoice.client} • Due: ${formatDate(invoice.dueDate)}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-xs" id="printable-invoice">
        {/* Invoice Header */}
        <div className="flex items-start justify-between pb-6 border-b border-white/[0.08]">
          <div className="space-y-1">
            <NexusLogo size="sm" badge="Official Statement" />
            <p className="text-[#94A3B8] text-[11px] pt-1">NexusFlow Technologies Inc. • Finance Department</p>
            <p className="text-slate-500 text-[10px]">100 Enterprise Way, Suite 400 • San Francisco, CA</p>
          </div>
          <div className="text-right space-y-1">
            <Badge variant={invoice.status === 'Paid' ? 'success' : invoice.status === 'Pending' ? 'warning' : 'danger'}>
              {invoice.status.toUpperCase()}
            </Badge>
            <p className="text-[10px] font-mono text-slate-500">Ref: {invoice.id}</p>
          </div>
        </div>

        {/* Bill To & Dates */}
        <div className="grid grid-cols-2 gap-6 bg-[#080B14] p-4 rounded-xl border border-white/[0.06]">
          <div>
            <span className="font-mono text-[10px] uppercase text-[#94A3B8] block mb-1">Billed To</span>
            <h4 className="text-sm font-bold text-white">{invoice.client}</h4>
            <p className="text-[#94A3B8] text-xs font-mono">{invoice.clientEmail || 'accounts@client.com'}</p>
          </div>
          <div className="text-right space-y-1 font-mono text-[11px]">
            <div>
              <span className="text-[#94A3B8]">Invoice Number: </span>
              <strong className="text-white">{invoice.invoiceNumber}</strong>
            </div>
            <div>
              <span className="text-[#94A3B8]">Issue Date: </span>
              <strong className="text-white">{formatDate(invoice.issueDate)}</strong>
            </div>
            <div>
              <span className="text-[#94A3B8]">Due Date: </span>
              <strong className="text-white">{formatDate(invoice.dueDate)}</strong>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#101827]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#151F32] border-b border-white/[0.08] text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
                <th className="p-3">Description</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {invoice.items.map(item => (
                <tr key={item.id} className="hover:bg-white/[0.02]">
                  <td className="p-3 font-medium text-white">{item.description}</td>
                  <td className="p-3 text-center font-mono text-[#94A3B8]">{item.quantity}</td>
                  <td className="p-3 text-right font-mono text-[#94A3B8] tabular-nums">{formatCurrency(item.unitPrice)}</td>
                  <td className="p-3 text-right font-mono font-bold text-white tabular-nums">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Calculation Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2 bg-[#080B14] p-4 rounded-xl border border-white/[0.06] font-mono text-xs">
            <div className="flex justify-between text-[#94A3B8]">
              <span>Subtotal:</span>
              <span className="text-white tabular-nums">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>Tax ({invoice.taxRate}%):</span>
              <span className="text-white tabular-nums">{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className="pt-2 border-t border-white/[0.08] flex justify-between font-bold text-sm">
              <span className="text-white">Total Due:</span>
              <span className="text-[#2DD4BF] tabular-nums font-extrabold">{formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes & Payment instructions */}
        {invoice.notes && (
          <div className="p-3 bg-[#151F32]/50 rounded-xl border border-white/[0.06] text-[11px] text-[#94A3B8]">
            <strong className="text-white block mb-0.5">Payment Terms & Wire Routing:</strong>
            {invoice.notes}
          </div>
        )}

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="text-[#94A3B8] text-[11px]">Reconcile Status:</span>
            <select
              value={invoice.status}
              onChange={(e) => updateInvoiceStatus(invoice.id, e.target.value as any)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/[0.08] bg-[#151F32] text-white focus:outline-none"
            >
              <option value="Pending" className="bg-[#101827]">Pending</option>
              <option value="Paid" className="bg-[#101827]">Mark as Paid</option>
              <option value="Overdue" className="bg-[#101827]">Overdue</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-white rounded-xl text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#818CF8] hover:bg-[#6366F1] text-[#080B14] rounded-xl text-xs font-bold transition active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

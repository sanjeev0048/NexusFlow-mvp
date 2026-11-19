import React from 'react';
import { Printer, CheckCircle, Download, Layers } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Invoice } from '../../types';
import { Badge } from '../common/Badge';
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
      <div className="space-y-6 print:m-0" id="printable-invoice">
        {/* Invoice Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">NexusFlow Technologies Inc.</h2>
              <p className="text-xs text-slate-500">100 Enterprise Way, Suite 400 • Silicon Valley, CA</p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant={invoice.status === 'Paid' ? 'success' : invoice.status === 'Pending' ? 'info' : 'danger'}>
              {invoice.status.toUpperCase()}
            </Badge>
            <p className="text-xs text-slate-400 mt-1">Ref: {invoice.id}</p>
          </div>
        </div>

        {/* Bill To & Dates */}
        <div className="grid grid-cols-2 gap-6 text-xs">
          <div>
            <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">Billed To</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{invoice.client}</h4>
            <p className="text-slate-500">{invoice.clientEmail || 'accounts@client.com'}</p>
          </div>
          <div className="text-right space-y-1">
            <div>
              <span className="text-slate-400">Issue Date: </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(invoice.issueDate)}</span>
            </div>
            <div>
              <span className="text-slate-400">Payment Due: </span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{formatDate(invoice.dueDate)}</span>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="p-3">Item Description</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {invoice.items.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="p-3 font-medium text-slate-900 dark:text-white">{item.description}</td>
                  <td className="p-3 text-center text-slate-600 dark:text-slate-400">{item.quantity}</td>
                  <td className="p-3 text-right text-slate-600 dark:text-slate-400">{formatCurrency(item.unitPrice)}</td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-white">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex flex-col items-end space-y-1 text-xs">
          <div className="flex justify-between w-64 text-slate-500 dark:text-slate-400">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between w-64 text-slate-500 dark:text-slate-400">
            <span>Sales Tax ({invoice.taxRate}%):</span>
            <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(invoice.taxAmount)}</span>
          </div>
          <div className="flex justify-between w-64 pt-2 border-t border-slate-200 dark:border-slate-800 text-sm">
            <span className="font-bold text-slate-900 dark:text-white">Total Balance:</span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400 text-base">{formatCurrency(invoice.totalAmount)}</span>
          </div>
        </div>

        {invoice.notes && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400">
            <span className="font-bold block text-slate-700 dark:text-slate-300 mb-0.5">Payment Terms & Notes:</span>
            {invoice.notes}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          {invoice.status !== 'Paid' ? (
            <button
              onClick={() => {
                updateInvoiceStatus(invoice.id, 'Paid');
                onClose();
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Paid
            </button>
          ) : (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Payment Settled
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

import React, { useState, useMemo } from 'react';
import { Receipt, Plus, Eye, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { InvoiceModal } from '../components/finance/InvoiceModal';
import { InvoiceViewModal } from '../components/finance/InvoiceViewModal';
import { Invoice, InvoiceStatus } from '../types';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate, exportToCSV } from '../lib/utils';

export const InvoicesPage: React.FC = () => {
  const { invoices, updateInvoiceStatus, deleteInvoice } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(i => {
    const matchesSearch = 
      i.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
      i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBilled = useMemo(() => invoices.reduce((s, i) => s + i.totalAmount, 0), [invoices]);
  const totalPaid = useMemo(() => invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.totalAmount, 0), [invoices]);
  const totalPending = useMemo(() => invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((s, i) => s + i.totalAmount, 0), [invoices]);

  const handleExport = () => {
    const exportable = invoices.map(i => ({
      InvoiceNumber: i.invoiceNumber,
      Client: i.client,
      IssueDate: i.issueDate,
      DueDate: i.dueDate,
      Subtotal: i.subtotal,
      TaxRate: i.taxRate,
      TotalAmount: i.totalAmount,
      Status: i.status
    }));
    exportToCSV('NexusFlow_Invoices', exportable);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            <span>Accounts Receivable & Billing Invoices</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Issue itemized invoices, monitor payment deadlines, and reconcile collections.
          </p>
        </div>
      </div>

      {/* Financial Receivables Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Invoiced</span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(totalBilled)}</h3>
          <span className="text-[11px] text-slate-400">{invoices.length} invoices generated</span>
        </Card>

        <Card className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold">Collected Revenue</span>
          <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{formatCurrency(totalPaid)}</h3>
          <span className="text-[11px] text-emerald-600/80">{invoices.filter(i => i.status === 'Paid').length} paid invoices</span>
        </Card>

        <Card className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60">
          <span className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider font-semibold">Outstanding Balance</span>
          <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400 mt-1">{formatCurrency(totalPending)}</h3>
          <span className="text-[11px] text-amber-600/80">{invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').length} pending collection</span>
        </Card>
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search invoice # or client..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Pending', value: 'Pending' },
          { label: 'Paid', value: 'Paid' },
          { label: 'Overdue', value: 'Overdue' },
        ]}
        onExport={handleExport}
        onAddClick={() => setIsCreateModalOpen(true)}
        addLabel="Create Invoice"
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                <th className="p-4">Invoice #</th>
                <th className="p-4">Client</th>
                <th className="p-4">Issue Date</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No invoices matching query.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewInvoice(inv)}
                          className="hover:text-blue-600 dark:hover:text-blue-400 underline font-mono text-sm"
                        >
                          {inv.invoiceNumber}
                        </button>
                      </div>
                      <div className="text-xs font-normal text-slate-400">{inv.id}</div>
                    </td>

                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                      {inv.client}
                    </td>

                    <td className="p-4 text-xs text-slate-500">
                      {formatDate(inv.issueDate)}
                    </td>

                    <td className="p-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <span className={inv.status === 'Overdue' ? 'text-rose-600 font-bold' : ''}>
                        {formatDate(inv.dueDate)}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(inv.totalAmount)}
                    </td>

                    <td className="p-4">
                      <select
                        value={inv.status}
                        onChange={(e) => updateInvoiceStatus(inv.id, e.target.value as InvoiceStatus)}
                        className="text-xs font-semibold px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewInvoice(inv)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition"
                          title="View / Print Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteInvoice(inv.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                          title="Delete Invoice"
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

      {/* Create Modal */}
      <InvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* View Printable Modal */}
      <InvoiceViewModal
        isOpen={!!viewInvoice}
        onClose={() => setViewInvoice(null)}
        invoice={viewInvoice}
      />
    </div>
  );
};

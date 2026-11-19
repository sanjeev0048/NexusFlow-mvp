import React, { useState, useMemo } from 'react';
import { Receipt, Plus, Eye, Trash2, CheckCircle2, Clock, AlertCircle, DollarSign, Download } from 'lucide-react';
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
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#818CF8]/10 text-[#818CF8] text-[11px] font-mono border border-[#818CF8]/25 mb-1.5">
            <Receipt className="w-3 h-3 text-[#2DD4BF]" />
            <span>Accounts Receivable & Billing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Invoices & Billing
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Issue itemized tax-compliant invoices, track collections deadlines & automated dunning.
          </p>
        </div>
      </div>

      {/* Financial Receivables Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08] shadow-card-subtle">
          <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Total Invoiced Volume</span>
          <h3 className="text-2xl font-extrabold text-white mt-1 tabular-nums font-mono">{formatCurrency(totalBilled)}</h3>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">{invoices.length} invoices generated</span>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-[#2DD4BF]/25 shadow-card-subtle">
          <span className="text-[10px] font-mono text-[#2DD4BF] uppercase">Collected Capital</span>
          <h3 className="text-2xl font-extrabold text-[#2DD4BF] mt-1 tabular-nums font-mono">{formatCurrency(totalPaid)}</h3>
          <span className="text-[11px] text-[#2DD4BF]/80 font-mono mt-0.5 block">{invoices.filter(i => i.status === 'Paid').length} paid invoices</span>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-amber-500/25 shadow-card-subtle">
          <span className="text-[10px] font-mono text-amber-300 uppercase">Outstanding Receivables</span>
          <h3 className="text-2xl font-extrabold text-amber-300 mt-1 tabular-nums font-mono">{formatCurrency(totalPending)}</h3>
          <span className="text-[11px] text-amber-400/80 font-mono mt-0.5 block">{invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').length} pending collection</span>
        </div>
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search invoice # or client name..."
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

      <Card className="overflow-hidden border-white/[0.08]" elevated>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#151F32]/80 border-b border-white/[0.08] text-[11px] uppercase font-mono tracking-wider text-[#94A3B8]">
                <th className="p-4">Invoice #</th>
                <th className="p-4">Client Company</th>
                <th className="p-4">Issue Date</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Subtotal</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#94A3B8]">
                    No invoices match selected search filter.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="p-4 font-mono font-bold text-white group-hover:text-[#818CF8] transition">
                      {inv.invoiceNumber}
                    </td>

                    <td className="p-4 font-semibold text-white">
                      <div>{inv.client}</div>
                      <div className="text-[11px] font-mono text-[#94A3B8] font-normal">{inv.clientEmail || 'Direct Account'}</div>
                    </td>

                    <td className="p-4 text-[#94A3B8] font-mono text-[11px]">
                      {formatDate(inv.issueDate)}
                    </td>

                    <td className="p-4 text-[#94A3B8] font-mono text-[11px]">
                      {formatDate(inv.dueDate)}
                    </td>

                    <td className="p-4 font-mono text-[#94A3B8] tabular-nums">
                      {formatCurrency(inv.subtotal)}
                    </td>

                    <td className="p-4 font-mono font-extrabold text-white text-sm tabular-nums">
                      {formatCurrency(inv.totalAmount)}
                    </td>

                    <td className="p-4">
                      <Badge 
                        variant={
                          inv.status === 'Paid' ? 'success' : 
                          inv.status === 'Overdue' ? 'danger' : 'warning'
                        }
                      >
                        {inv.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewInvoice(inv)}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] text-[11px] font-medium flex items-center gap-1 transition"
                          title="View / Print Invoice"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => deleteInvoice(inv.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 transition"
                          title="Delete Invoice"
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

      {/* Create Modal */}
      <InvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* View / Print Statement Modal */}
      <InvoiceViewModal
        isOpen={!!viewInvoice}
        onClose={() => setViewInvoice(null)}
        invoice={viewInvoice}
      />
    </div>
  );
};

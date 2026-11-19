import React, { useState, useMemo } from 'react';
import { Wallet, Plus, Trash2, Tag, Calendar, DollarSign, TrendingDown, Layers } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { ExpenseModal } from '../components/finance/ExpenseModal';
import { Expense, ExpenseCategory } from '../types';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate, exportToCSV } from '../lib/utils';

export const ExpensesPage: React.FC = () => {
  const { expenses, deleteExpense } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = 
      e.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || e.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalExpenditure = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  // Category breakdown calculation
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).map(([cat, amt]) => ({
      category: cat,
      amount: amt,
      percentage: totalExpenditure > 0 ? ((amt / totalExpenditure) * 100).toFixed(1) : '0'
    })).sort((a, b) => b.amount - a.amount);
  }, [expenses, totalExpenditure]);

  const handleExport = () => {
    exportToCSV('NexusFlow_Expenses', filteredExpenses);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#818CF8]/10 text-[#818CF8] text-[11px] font-mono border border-[#818CF8]/25 mb-1.5">
            <Wallet className="w-3 h-3 text-[#2DD4BF]" />
            <span>Corporate Expenditure Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Corporate Expenses
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Reconcile operational burn rate, infrastructure vendor costs, marketing budgets & SaaS subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <span className="px-3 py-1.5 rounded-xl bg-[#101827] border border-white/[0.08]">
            Total Outflow: <strong className="text-rose-400 tabular-nums">{formatCurrency(totalExpenditure)}</strong>
          </span>
        </div>
      </div>

      {/* Category Distribution Quick Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {categoryBreakdown.slice(0, 4).map(item => (
          <div key={item.category} className="p-3.5 rounded-xl bg-[#101827] border border-white/[0.08] shadow-card-subtle space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="font-semibold text-white truncate">{item.category}</span>
              <span className="font-mono text-[#94A3B8]">{item.percentage}%</span>
            </div>
            <div className="text-sm font-bold text-white font-mono tabular-nums">
              {formatCurrency(item.amount)}
            </div>
            <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden">
              <div 
                className="bg-[#818CF8] h-full rounded-full" 
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search vendor or expense note..."
        statusFilter={categoryFilter}
        onStatusFilterChange={setCategoryFilter}
        statusOptions={[
          { label: 'All Categories', value: 'All' },
          { label: 'Infrastructure', value: 'Infrastructure' },
          { label: 'Office & Rent', value: 'Office & Rent' },
          { label: 'Marketing', value: 'Marketing' },
          { label: 'Software & Tools', value: 'Software & Tools' },
          { label: 'Travel', value: 'Travel' },
          { label: 'Payroll', value: 'Payroll' },
        ]}
        onExport={handleExport}
        onAddClick={() => setIsModalOpen(true)}
        addLabel="Record Expense"
      />

      <Card className="overflow-hidden border-white/[0.08]" elevated>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#151F32]/80 border-b border-white/[0.08] text-[11px] uppercase font-mono tracking-wider text-[#94A3B8]">
                <th className="p-4">Payee / Vendor</th>
                <th className="p-4">Category</th>
                <th className="p-4">Expense Date</th>
                <th className="p-4">Business Context</th>
                <th className="p-4">Amount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#94A3B8]">
                    No expenditure records found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="p-4 font-semibold text-white group-hover:text-[#818CF8] transition text-sm">
                      {exp.vendor}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.06] text-[11px] font-mono text-[#94A3B8]">
                        {exp.category}
                      </span>
                    </td>

                    <td className="p-4 text-[#94A3B8] font-mono text-[11px]">
                      {formatDate(exp.date)}
                    </td>

                    <td className="p-4 text-slate-300 max-w-xs truncate">
                      {exp.description || '—'}
                    </td>

                    <td className="p-4 font-mono font-bold text-rose-400 text-sm tabular-nums">
                      -{formatCurrency(exp.amount)}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 transition"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

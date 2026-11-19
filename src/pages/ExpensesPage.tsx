import React, { useState, useMemo } from 'react';
import { Wallet, Plus, Trash2, Tag, Calendar, DollarSign } from 'lucide-react';
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

  const handleExport = () => {
    exportToCSV('NexusFlow_Expenses', filteredExpenses);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600" />
            <span>Corporate Operating Expenses</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Operational Outflow: <strong className="text-rose-600 font-bold">{formatCurrency(totalExpenditure)}</strong> across {expenses.length} records.
          </p>
        </div>
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

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                <th className="p-4">Payee / Vendor</th>
                <th className="p-4">Category</th>
                <th className="p-4">Expense Date</th>
                <th className="p-4">Notes & Business Context</th>
                <th className="p-4">Amount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      <div>{exp.vendor}</div>
                      <div className="text-xs font-normal text-slate-400">{exp.id}</div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <Tag className="w-3 h-3 text-blue-500" />
                        {exp.category}
                      </span>
                    </td>

                    <td className="p-4 text-xs text-slate-500">
                      {formatDate(exp.date)}
                    </td>

                    <td className="p-4 text-xs text-slate-600 dark:text-slate-400 max-w-sm truncate">
                      {exp.description || 'General operating expense'}
                    </td>

                    <td className="p-4 font-extrabold text-rose-600 dark:text-rose-400">
                      {formatCurrency(exp.amount)}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-4 h-4" />
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

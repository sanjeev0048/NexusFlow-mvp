import React, { useState } from 'react';
import { Contact, Plus, Trash2, Mail, Phone, ShoppingBag, DollarSign } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { Modal } from '../components/common/Modal';
import { Customer } from '../types';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate, exportToCSV } from '../lib/utils';

export const CustomersPage: React.FC = () => {
  const { customers, addCustomer, deleteCustomer } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Customer Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    exportToCSV('NexusFlow_Customers', filteredCustomers);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;

    addCustomer({
      name,
      company,
      email,
      phone,
      status: 'Active'
    });

    setIsModalOpen(false);
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Contact className="w-6 h-6 text-blue-600" />
            <span>Customers & Accounts</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enterprise client accounts, lifetime revenue contributions & order history.
          </p>
        </div>
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search customer, account name or email..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
          { label: 'Churned', value: 'Churned' },
        ]}
        onExport={handleExport}
        onAddClick={() => setIsModalOpen(true)}
        addLabel="Add Customer"
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                <th className="p-4">Customer & Account</th>
                <th className="p-4">Lifetime Spend</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4">Status</th>
                <th className="p-4">Client Since</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No customer accounts found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {cust.company}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                        <span>{cust.name}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {cust.email}</span>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(cust.totalSpend)}
                    </td>

                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                        <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                        {cust.ordersCount} orders
                      </span>
                    </td>

                    <td className="p-4">
                      <Badge variant={cust.status === 'Active' ? 'success' : cust.status === 'Inactive' ? 'warning' : 'danger'}>
                        {cust.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-xs text-slate-500">
                      {formatDate(cust.joinedDate)}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteCustomer(cust.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                        title="Delete Account"
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

      {/* Add Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Customer Account"
        subtitle="Create an enterprise account profile for billing and orders"
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Company / Organization *</label>
            <input
              type="text"
              required
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Primary Contact Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Billing Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="sarah@acme.com"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-sm shadow-blue-500/20 transition"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

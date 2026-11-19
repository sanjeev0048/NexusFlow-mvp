import React, { useState } from 'react';
import { Contact, Plus, Trash2, Mail, Phone, ShoppingBag, DollarSign, Building2, User } from 'lucide-react';
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

  const totalSpendAll = customers.reduce((s, c) => s + c.totalSpend, 0);

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
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#818CF8]/10 text-[#818CF8] text-[11px] font-mono border border-[#818CF8]/25 mb-1.5">
            <Contact className="w-3 h-3 text-[#2DD4BF]" />
            <span>Accounts & Enterprise Relations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Client Accounts
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Accounts converted from CRM opportunities, lifetime value (LTV) metrics & fulfillment history.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <span className="px-3 py-1.5 rounded-xl bg-[#101827] border border-white/[0.08]">
            Cumulative LTV: <strong className="text-[#2DD4BF] tabular-nums">{formatCurrency(totalSpendAll)}</strong>
          </span>
        </div>
      </div>

      {/* Search Toolbar */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search customer, company or email..."
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
        addLabel="Add Client"
      />

      {/* Customer Directory Table */}
      <Card className="overflow-hidden border-white/[0.08]" elevated>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#151F32]/80 border-b border-white/[0.08] text-[11px] uppercase font-mono tracking-wider text-[#94A3B8]">
                <th className="p-4">Customer & Account</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Cumulative LTV</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4">Onboarded</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#94A3B8]">
                    No client accounts match search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#151F32] border border-white/10 text-[#818CF8] flex items-center justify-center font-bold text-xs shadow-sm">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-[#818CF8] transition text-sm">
                            {customer.name}
                          </div>
                          <div className="text-[11px] text-[#94A3B8]">
                            {customer.company}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-[#94A3B8]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-[#2DD4BF] text-sm tabular-nums">
                      {formatCurrency(customer.totalSpend)}
                    </td>

                    <td className="p-4 text-white font-mono">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#818CF8]" />
                        <span>{customer.ordersCount} orders</span>
                      </div>
                    </td>

                    <td className="p-4 text-[#94A3B8] font-mono text-[11px]">
                      {formatDate(customer.joinedDate)}
                    </td>

                    <td className="p-4">
                      <Badge 
                        variant={
                          customer.status === 'Active' ? 'success' : 
                          customer.status === 'Churned' ? 'danger' : 'default'
                        }
                      >
                        {customer.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteCustomer(customer.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 transition"
                        title="Remove Account"
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

      {/* New Client Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Client Account"
        subtitle="Manually create an enterprise customer record"
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Contact Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. David Sterling"
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Company / Organization *</label>
            <input
              type="text"
              required
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g. Sterling Capital"
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Work Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="david@sterling.com"
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 392-1084"
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#94A3B8] hover:text-white border border-white/[0.08] font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#818CF8] hover:bg-[#6366F1] text-[#080B14] font-bold shadow-glow-primary transition active:scale-95"
            >
              Save Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

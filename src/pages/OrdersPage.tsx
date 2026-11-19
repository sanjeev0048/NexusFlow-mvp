import React, { useState } from 'react';
import { ShoppingCart, Plus, Trash2, Filter, Package, User, CheckCircle2, Clock } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { Modal } from '../components/common/Modal';
import { Order, OrderItem, OrderStatus } from '../types';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate, exportToCSV, generateId } from '../lib/utils';

export const OrdersPage: React.FC = () => {
  const { orders, addOrder, updateOrderStatus, deleteOrder, customers, products } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Order Form state
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: products[0]?.id || '', quantity: 1 }
  ]);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalVolume = orders.reduce((s, o) => s + o.total, 0);

  const handleExport = () => {
    const exportable = orders.map(o => ({
      OrderNumber: o.orderNumber,
      Customer: o.customer,
      Date: o.date,
      Total: o.total,
      Status: o.status,
      ItemsCount: o.items.length
    }));
    exportToCSV('NexusFlow_Orders', exportable);
  };

  const handleAddItemRow = () => {
    setOrderItems(prev => [...prev, { productId: products[0]?.id || '', quantity: 1 }]);
  };

  const handleRemoveItemRow = (idx: number) => {
    if (orderItems.length <= 1) return;
    setOrderItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: 'productId' | 'quantity', val: any) => {
    setOrderItems(prev => prev.map((item, i) => {
      if (i === idx) {
        return { ...item, [field]: val };
      }
      return item;
    }));
  };

  const calculatedItems: OrderItem[] = orderItems.map(row => {
    const p = products.find(prod => prod.id === row.productId);
    const qty = Number(row.quantity) || 1;
    const price = p ? p.price : 0;
    return {
      id: generateId('ITM'),
      productId: row.productId,
      productName: p?.name || 'Unknown Item',
      quantity: qty,
      unitPrice: price,
      subtotal: qty * price
    };
  });

  const orderTotal = calculatedItems.reduce((acc, itm) => acc + itm.subtotal, 0);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    addOrder({
      orderNumber: `PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      customer: selectedCustomer,
      date: new Date().toISOString().split('T')[0],
      total: orderTotal,
      status: 'Processing',
      items: calculatedItems
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#818CF8]/10 text-[#818CF8] text-[11px] font-mono border border-[#818CF8]/25 mb-1.5">
            <ShoppingCart className="w-3 h-3 text-[#2DD4BF]" />
            <span>Fulfillment Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Orders & Fulfillment
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Track client purchase orders, line items, warehouse stock deductions and delivery progress.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <span className="px-3 py-1.5 rounded-xl bg-[#101827] border border-white/[0.08]">
            Fulfilled Volume: <strong className="text-white tabular-nums">{formatCurrency(totalVolume)}</strong>
          </span>
        </div>
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search order number or client..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Pending', value: 'Pending' },
          { label: 'Processing', value: 'Processing' },
          { label: 'Completed', value: 'Completed' },
          { label: 'Cancelled', value: 'Cancelled' },
        ]}
        onExport={handleExport}
        onAddClick={() => setIsModalOpen(true)}
        addLabel="Create Order"
      />

      <Card className="overflow-hidden border-white/[0.08]" elevated>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#151F32]/80 border-b border-white/[0.08] text-[11px] uppercase font-mono tracking-wider text-[#94A3B8]">
                <th className="p-4">Order Number</th>
                <th className="p-4">Client Customer</th>
                <th className="p-4">Date Placed</th>
                <th className="p-4">Line Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#94A3B8]">
                    No client orders matching selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-white group-hover:text-[#818CF8] transition text-sm">
                        {order.orderNumber}
                      </div>
                      <div className="text-[11px] font-mono text-[#94A3B8]">{order.id}</div>
                    </td>

                    <td className="p-4 font-semibold text-white">
                      {order.customer}
                    </td>

                    <td className="p-4 text-[#94A3B8] font-mono text-[11px]">
                      {formatDate(order.date)}
                    </td>

                    <td className="p-4 text-[#94A3B8]">
                      <div className="text-white font-medium">{order.items.length} line items</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs font-mono">
                        {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-white text-sm tabular-nums">
                      {formatCurrency(order.total)}
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/[0.08] bg-[#151F32] text-white focus:outline-none focus:border-[#818CF8]/50 cursor-pointer"
                      >
                        <option value="Pending" className="bg-[#101827]">Pending</option>
                        <option value="Processing" className="bg-[#101827]">Processing</option>
                        <option value="Completed" className="bg-[#101827]">Completed</option>
                        <option value="Cancelled" className="bg-[#101827]">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 transition"
                        title="Cancel Order"
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

      {/* New Order Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Customer Order"
        subtitle="Select customer account and configure line items from catalog"
        maxWidth="xl"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Customer Account *</label>
            <select
              required
              value={selectedCustomer}
              onChange={e => setSelectedCustomer(e.target.value)}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#818CF8]/60 transition"
            >
              <option value="" className="bg-[#101827]">Select a customer account...</option>
              {customers.map(c => (
                <option key={c.id} value={c.company} className="bg-[#101827]">{c.company} ({c.name})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] font-mono">Order Line Items</span>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-xs text-[#818CF8] hover:text-white font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
            </div>

            <div className="space-y-2 border border-white/[0.08] rounded-xl p-3 bg-[#080B14]">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={item.productId}
                    onChange={e => handleItemChange(idx, 'productId', e.target.value)}
                    className="flex-1 p-2 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id} className="bg-[#101827]">
                        {p.name} — {formatCurrency(p.price)} (Stock: {p.stock})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))}
                    className="w-16 p-2 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs text-center text-white font-mono"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveItemRow(idx)}
                    disabled={orderItems.length <= 1}
                    className="p-2 text-slate-400 hover:text-rose-400 disabled:opacity-20 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#151F32] border border-white/[0.08] rounded-xl flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">Total Order Valuation:</span>
            <span className="text-base font-extrabold text-[#2DD4BF] font-mono tabular-nums">{formatCurrency(orderTotal)}</span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#94A3B8] hover:text-white border border-white/[0.08] font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#818CF8] hover:bg-[#6366F1] text-[#080B14] font-bold rounded-xl shadow-glow-primary transition active:scale-95"
            >
              Submit Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

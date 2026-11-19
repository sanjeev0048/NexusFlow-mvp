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

  // Compute calculated total
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <span>Orders & Sales Fulfillment</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Process client purchase orders, inventory deductions and shipping statuses.
          </p>
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

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                <th className="p-4">Order ID & Number</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date Placed</th>
                <th className="p-4">Items Included</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      <div>{order.orderNumber}</div>
                      <div className="text-xs font-normal text-slate-400">{order.id}</div>
                    </td>

                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                      {order.customer}
                    </td>

                    <td className="p-4 text-xs text-slate-500">
                      {formatDate(order.date)}
                    </td>

                    <td className="p-4 text-xs text-slate-600 dark:text-slate-400">
                      <div>{order.items.length} line items</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </div>
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(order.total)}
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                        title="Cancel Order"
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

      {/* New Order Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Customer Order"
        subtitle="Select customer account and configure line items from catalog"
        maxWidth="xl"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Customer Account *</label>
            <select
              required
              value={selectedCustomer}
              onChange={e => setSelectedCustomer(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a customer...</option>
              {customers.map(c => (
                <option key={c.id} value={c.company}>{c.company} ({c.name})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Order Items</span>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
            </div>

            <div className="space-y-2 border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/30">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={item.productId}
                    onChange={e => handleItemChange(idx, 'productId', e.target.value)}
                    className="flex-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {formatCurrency(p.price)} (Stock: {p.stock})</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))}
                    className="w-16 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-center text-slate-900 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveItemRow(idx)}
                    disabled={orderItems.length <= 1}
                    className="p-2 text-slate-400 hover:text-rose-500 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">Total Order Amount:</span>
            <span className="text-base font-extrabold text-blue-800 dark:text-blue-300">{formatCurrency(orderTotal)}</span>
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
              Submit Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

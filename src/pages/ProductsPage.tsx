import React, { useState } from 'react';
import { Package, Plus, AlertTriangle, Layers, Edit3, Trash2, ArrowUpDown, TrendingUp, BarChart2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { ProductModal } from '../components/inventory/ProductModal';
import { StockAdjustModal } from '../components/inventory/StockAdjustModal';
import { Product } from '../types';
import { useData } from '../context/DataContext';
import { formatCurrency, exportToCSV } from '../lib/utils';

export const ProductsPage: React.FC = () => {
  const { products, deleteProduct } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [productToAdjust, setProductToAdjust] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalInventoryValuation = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);

  const handleExport = () => {
    exportToCSV('NexusFlow_Inventory_Catalog', filteredProducts);
  };

  const handleEdit = (prod: Product) => {
    setProductToEdit(prod);
    setIsProductModalOpen(true);
  };

  const handleNew = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenAdjust = (prod: Product) => {
    setProductToAdjust(prod);
    setIsAdjustModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#818CF8]/10 text-[#818CF8] text-[11px] font-mono border border-[#818CF8]/25 mb-1.5">
            <Package className="w-3 h-3 text-[#2DD4BF]" />
            <span>Warehouse & SKU Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Inventory & SKUs
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Real-time warehouse stock quantities, safety buffer monitors & catalog pricing.
          </p>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="px-3.5 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-xs font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{lowStockProducts.length} SKU(s) below safety threshold!</span>
          </div>
        )}
      </div>

      {/* Inventory Valuation Metric Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08] shadow-card-subtle">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Total Inventory Valuation</span>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-1 tabular-nums">
            {formatCurrency(totalInventoryValuation)}
          </div>
          <span className="text-[11px] text-[#2DD4BF] font-mono mt-0.5 block">{products.length} registered SKUs</span>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08] shadow-card-subtle">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Safety Stock Buffer Status</span>
          <div className={`text-xl sm:text-2xl font-extrabold mt-1 tabular-nums ${lowStockProducts.length > 0 ? 'text-amber-400' : 'text-[#2DD4BF]'}`}>
            {lowStockProducts.length > 0 ? `${lowStockProducts.length} Re-order Alerts` : '100% Healthy'}
          </div>
          <span className="text-[11px] text-[#94A3B8] font-mono mt-0.5 block">Automated replenishment</span>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08] shadow-card-subtle">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Software Licenses</span>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-1 tabular-nums">
            {products.filter(p => p.category === 'Software').length} Active
          </div>
          <span className="text-[11px] text-[#818CF8] font-mono mt-0.5 block">Zero physical holding cost</span>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08] shadow-card-subtle">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Hardware Units On-Hand</span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#2DD4BF] mt-1 tabular-nums">
            {products.filter(p => p.category === 'Hardware').reduce((s, p) => s + p.stock, 0)} Units
          </div>
          <span className="text-[11px] text-[#94A3B8] font-mono mt-0.5 block">In enterprise depots</span>
        </div>
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search product name or SKU code..."
        statusFilter={categoryFilter}
        onStatusFilterChange={setCategoryFilter}
        statusOptions={[
          { label: 'All Categories', value: 'All' },
          { label: 'Software', value: 'Software' },
          { label: 'Hardware', value: 'Hardware' },
          { label: 'Services', value: 'Services' },
          { label: 'Consulting', value: 'Consulting' },
        ]}
        onExport={handleExport}
        onAddClick={handleNew}
        addLabel="Add SKU"
      />

      <Card className="overflow-hidden border-white/[0.08]" elevated>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#151F32]/80 border-b border-white/[0.08] text-[11px] uppercase font-mono tracking-wider text-[#94A3B8]">
                <th className="p-4">Product & SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Unit Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Buffer Threshold</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#94A3B8]">
                    No product records match filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(prod => {
                  const isLow = prod.stock <= prod.lowStockThreshold;

                  return (
                    <tr 
                      key={prod.id} 
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-white group-hover:text-[#818CF8] transition text-sm">
                          {prod.name}
                        </div>
                        <div className="text-[11px] font-mono text-[#94A3B8] mt-0.5">
                          {prod.sku}
                        </div>
                      </td>

                      <td className="p-4 text-[#94A3B8]">
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.06] text-[11px] font-mono">
                          {prod.category}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold text-white tabular-nums text-sm">
                        {formatCurrency(prod.price)}
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <span className={`font-mono font-bold tabular-nums ${isLow ? 'text-amber-400' : 'text-white'}`}>
                            {prod.stock} units
                          </span>
                          <div className="w-24 bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${isLow ? 'bg-amber-400' : 'bg-[#2DD4BF]'}`}
                              style={{ width: `${Math.min(100, (prod.stock / (prod.lowStockThreshold * 3)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-[#94A3B8] font-mono">
                        {prod.lowStockThreshold} units min
                      </td>

                      <td className="p-4">
                        <Badge variant={isLow ? 'warning' : 'success'} dot>
                          {isLow ? 'Low Stock' : 'Optimal'}
                        </Badge>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenAdjust(prod)}
                            className="px-2.5 py-1 rounded-lg bg-[#818CF8]/10 hover:bg-[#818CF8]/20 text-[#818CF8] border border-[#818CF8]/30 font-semibold text-[11px] flex items-center gap-1 transition active:scale-95"
                            title="Adjust Units"
                          >
                            <ArrowUpDown className="w-3 h-3" />
                            <span>Adjust</span>
                          </button>
                          <button
                            onClick={() => handleEdit(prod)}
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06] transition"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 transition"
                            title="Delete SKU"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Product Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
      />

      <StockAdjustModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        product={productToAdjust}
      />
    </div>
  );
};

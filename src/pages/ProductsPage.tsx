import React, { useState } from 'react';
import { Package, Plus, AlertTriangle, Layers, Edit3, Trash2, ArrowUpDown } from 'lucide-react';
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

  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            <span>Products & Warehouse Inventory</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time SKU quantities, automated threshold monitors & catalog pricing.
          </p>
        </div>
        {lowStockCount > 0 && (
          <div className="px-3.5 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>{lowStockCount} items below safety stock buffer!</span>
          </div>
        )}
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search product name or SKU..."
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
        addLabel="Add Product"
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                <th className="p-4">Product & SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Unit Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Safety Buffer</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No products found matching query.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">
                      <div>{p.name}</div>
                      <div className="text-xs font-mono text-slate-400">{p.sku}</div>
                    </td>

                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {p.category}
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(p.price)}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {p.stock} units
                        </span>
                        <button
                          onClick={() => handleOpenAdjust(p)}
                          className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1"
                          title="Adjust Stock (+ / -)"
                        >
                          <ArrowUpDown className="w-3 h-3" /> Adjust
                        </button>
                      </div>
                    </td>

                    <td className="p-4 text-xs text-slate-500">
                      Min {p.lowStockThreshold} units
                    </td>

                    <td className="p-4">
                      <Badge variant={p.status === 'In Stock' ? 'success' : p.status === 'Low Stock' ? 'warning' : 'danger'}>
                        {p.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                          title="Edit Product Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                          title="Delete Product"
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

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
      />

      {/* Stock Adjust Modal */}
      <StockAdjustModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        product={productToAdjust}
      />
    </div>
  );
};

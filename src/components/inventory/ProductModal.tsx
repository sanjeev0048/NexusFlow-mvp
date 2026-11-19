import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Product } from '../../types';
import { useData } from '../../context/DataContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, productToEdit }) => {
  const { addProduct, updateProduct } = useData();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Software');
  const [price, setPrice] = useState(500);
  const [cost, setCost] = useState(150);
  const [stock, setStock] = useState(100);
  const [lowStockThreshold, setLowStockThreshold] = useState(15);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSku(productToEdit.sku);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setCost(productToEdit.cost || 0);
      setStock(productToEdit.stock);
      setLowStockThreshold(productToEdit.lowStockThreshold);
    } else {
      setName('');
      setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      setCategory('Software');
      setPrice(500);
      setCost(150);
      setStock(50);
      setLowStockThreshold(15);
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productToEdit) {
      updateProduct(productToEdit.id, {
        name,
        sku,
        category,
        price: Number(price),
        cost: Number(cost),
        stock: Number(stock),
        lowStockThreshold: Number(lowStockThreshold)
      });
    } else {
      addProduct({
        name,
        sku,
        category,
        price: Number(price),
        cost: Number(cost),
        stock: Number(stock),
        lowStockThreshold: Number(lowStockThreshold)
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? 'Edit Product Item' : 'Add Catalog Product'}
      subtitle="Configure SKU, inventory buffer thresholds, and price"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Cloud Security Module"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">SKU / Item Code *</label>
            <input
              type="text"
              required
              value={sku}
              onChange={e => setSku(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
              <option value="Services">Services</option>
              <option value="Consulting">Consulting</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Selling Price ($)</label>
            <input
              type="number"
              required
              min="0"
              step="1"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Unit Cost ($)</label>
            <input
              type="number"
              min="0"
              value={cost}
              onChange={e => setCost(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Current Stock Level</label>
            <input
              type="number"
              required
              min="0"
              value={stock}
              onChange={e => setStock(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Low Stock Alert Threshold</label>
            <input
              type="number"
              required
              min="0"
              value={lowStockThreshold}
              onChange={e => setLowStockThreshold(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-sm shadow-blue-500/20 transition"
          >
            {productToEdit ? 'Update Product' : 'Add to Catalog'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

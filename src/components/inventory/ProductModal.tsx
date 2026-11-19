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

  const margin = price > 0 ? (((price - cost) / price) * 100).toFixed(1) : '0';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? 'Edit SKU Item' : 'Add Catalog SKU'}
      subtitle="Configure SKU, inventory buffer thresholds, unit cost and pricing"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Neural Gateway Edge Node"
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">SKU Code *</label>
            <input
              type="text"
              required
              value={sku}
              onChange={e => setSku(e.target.value)}
              placeholder="SKU-HW-88"
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#818CF8]/60 transition"
            >
              <option value="Software" className="bg-[#101827]">Software</option>
              <option value="Hardware" className="bg-[#101827]">Hardware</option>
              <option value="Services" className="bg-[#101827]">Services</option>
              <option value="Consulting" className="bg-[#101827]">Consulting</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Unit Price ($)</label>
            <input
              type="number"
              required
              min={0}
              step={10}
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white font-mono tabular-nums focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Unit Cost ($)</label>
            <input
              type="number"
              min={0}
              step={5}
              value={cost}
              onChange={e => setCost(Number(e.target.value))}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white font-mono tabular-nums focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Current Stock Quantity</label>
            <input
              type="number"
              required
              min={0}
              value={stock}
              onChange={e => setStock(Number(e.target.value))}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white font-mono tabular-nums focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Low-Stock Buffer Alert</label>
            <input
              type="number"
              required
              min={1}
              value={lowStockThreshold}
              onChange={e => setLowStockThreshold(Number(e.target.value))}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white font-mono tabular-nums focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>
        </div>

        {/* Calculated margin banner */}
        <div className="p-3 rounded-xl bg-[#080B14] border border-white/[0.08] flex items-center justify-between text-xs">
          <span className="text-[#94A3B8]">Gross Product Margin:</span>
          <span className="font-mono font-bold text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded border border-[#2DD4BF]/25">
            {margin}% Profit Margin
          </span>
        </div>

        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#94A3B8] hover:text-white border border-white/[0.08] font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#818CF8] hover:bg-[#6366F1] text-[#080B14] font-bold shadow-glow-primary transition active:scale-95"
          >
            {productToEdit ? 'Save SKU' : 'Add Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

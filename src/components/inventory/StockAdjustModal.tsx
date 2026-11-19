import React, { useState } from 'react';
import { Plus, Minus, AlertTriangle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Product } from '../../types';
import { useData } from '../../context/DataContext';

interface StockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({ isOpen, onClose, product }) => {
  const { adjustProductStock } = useData();
  const [adjustment, setAdjustment] = useState(10);
  const [mode, setMode] = useState<'add' | 'remove'>('add');

  if (!product) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const delta = mode === 'add' ? Number(adjustment) : -Number(adjustment);
    adjustProductStock(product.id, delta);
    onClose();
  };

  const resultingStock = mode === 'add' 
    ? product.stock + Number(adjustment) 
    : Math.max(0, product.stock - Number(adjustment));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Adjust Stock: ${product.name}`}
      subtitle={`SKU: ${product.sku} • Current Level: ${product.stock} units`}
      maxWidth="sm"
    >
      <form onSubmit={handleApply} className="space-y-4">
        <div className="flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition ${
              mode === 'add' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Stock In
          </button>
          <button
            type="button"
            onClick={() => setMode('remove')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition ${
              mode === 'remove' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Minus className="w-3.5 h-3.5" /> Stock Out
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Units to {mode === 'add' ? 'Add' : 'Deduct'}
          </label>
          <input
            type="number"
            min="1"
            required
            value={adjustment}
            onChange={e => setAdjustment(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-bold text-center"
          />
        </div>

        {/* Result Preview */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between text-xs">
          <span className="text-slate-500">New On-Hand Total:</span>
          <span className={`font-bold text-sm ${resultingStock <= product.lowStockThreshold ? 'text-amber-500' : 'text-emerald-500'}`}>
            {resultingStock} units
          </span>
        </div>

        {resultingStock <= product.lowStockThreshold && (
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Warning: Resulting stock is below minimum safety threshold ({product.lowStockThreshold}).</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            Apply Adjustment
          </button>
        </div>
      </form>
    </Modal>
  );
};

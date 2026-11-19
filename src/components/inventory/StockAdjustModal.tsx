import React, { useState } from 'react';
import { Plus, Minus, AlertTriangle, Package } from 'lucide-react';
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
      <form onSubmit={handleApply} className="space-y-4 text-xs">
        <div className="flex rounded-xl p-1 bg-[#080B14] border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              mode === 'add' 
                ? 'bg-[#2DD4BF] text-[#080B14] font-bold shadow-sm' 
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Stock In
          </button>
          <button
            type="button"
            onClick={() => setMode('remove')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              mode === 'remove' 
                ? 'bg-rose-500 text-white font-bold shadow-sm' 
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Minus className="w-3.5 h-3.5" /> Stock Out
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
            Units to {mode === 'add' ? 'Add' : 'Deduct'}
          </label>
          <input
            type="number"
            min="1"
            required
            value={adjustment}
            onChange={e => setAdjustment(Number(e.target.value))}
            className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-[#818CF8]/60 font-bold text-center font-mono tabular-nums"
          />
        </div>

        {/* Result Preview */}
        <div className="p-3 bg-[#080B14] border border-white/[0.08] rounded-xl flex items-center justify-between text-xs font-mono">
          <span className="text-[#94A3B8]">New On-Hand Total:</span>
          <span className={`font-bold text-sm ${resultingStock <= product.lowStockThreshold ? 'text-amber-400' : 'text-[#2DD4BF]'}`}>
            {resultingStock} units
          </span>
        </div>

        {resultingStock <= product.lowStockThreshold && (
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Warning: Resulting stock is below minimum safety buffer ({product.lowStockThreshold} units).</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#94A3B8] hover:text-white border border-white/[0.08] font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-[#818CF8] hover:bg-[#6366F1] text-[#080B14] rounded-xl text-xs font-bold shadow-glow-primary transition active:scale-95"
          >
            Apply Adjustment
          </button>
        </div>
      </form>
    </Modal>
  );
};

import React from 'react';
import { Search, Filter, Download, Plus } from 'lucide-react';
import { Card } from './Card';

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  statusOptions?: { label: string; value: string }[];
  onExport?: () => void;
  onAddClick?: () => void;
  addLabel?: string;
  children?: React.ReactNode;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  onExport,
  onAddClick,
  addLabel = 'New Record',
  children
}) => {
  return (
    <div className="bg-[#101827] border border-white/[0.08] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-card-subtle">
      <div className="flex flex-1 flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
        <div className="relative w-full sm:w-80 group">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#818CF8] transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-8 py-2 bg-[#151F32]/80 border border-white/[0.06] rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#818CF8]/50 focus:bg-[#151F32] transition"
          />
          <span className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 bg-white/[0.05] px-1.5 py-0.5 rounded">
            /
          </span>
        </div>

        {statusOptions && onStatusFilterChange && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-[#151F32]/80 border border-white/[0.06] rounded-xl text-xs font-medium text-[#F8FAFC] focus:outline-none focus:border-[#818CF8]/50 cursor-pointer"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[#101827] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {children}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {onExport && (
          <button
            onClick={onExport}
            className="px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        )}
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="px-4 py-2 bg-[#818CF8] hover:bg-[#6366F1] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-glow-primary transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{addLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, LayoutDashboard, Users, Briefcase, Contact, Package, ShoppingCart, 
  Receipt, Wallet, UserCheck, Calendar, BarChart3, Sparkles, Settings, Plus,
  ArrowRight, X, Clock
} from 'lucide-react';
import { Page } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setPage: (page: Page) => void;
  onOpenNewLead?: () => void;
  onOpenNewProduct?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setPage,
  onOpenNewLead,
  onOpenNewProduct,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = [
    { id: 'flow-ai', label: 'Ask FlowAI Intelligence', category: 'AI Assistant', icon: Sparkles, action: () => { setPage('flow-ai'); onClose(); }, shortcut: 'AI' },
    { id: 'dashboard', label: 'Go to Command Center', category: 'Navigation', icon: LayoutDashboard, action: () => { setPage('dashboard'); onClose(); } },
    { id: 'leads', label: 'Go to Leads & Prospects', category: 'Navigation', icon: Users, action: () => { setPage('leads'); onClose(); } },
    { id: 'pipeline', label: 'Go to Sales Pipeline Kanban', category: 'Navigation', icon: Briefcase, action: () => { setPage('sales-pipeline'); onClose(); } },
    { id: 'customers', label: 'Go to Client Accounts', category: 'Navigation', icon: Contact, action: () => { setPage('customers'); onClose(); } },
    { id: 'products', label: 'Go to Inventory & SKUs', category: 'Navigation', icon: Package, action: () => { setPage('products'); onClose(); } },
    { id: 'orders', label: 'Go to Orders & Fulfillment', category: 'Navigation', icon: ShoppingCart, action: () => { setPage('orders'); onClose(); } },
    { id: 'invoices', label: 'Go to Invoices & Billing', category: 'Navigation', icon: Receipt, action: () => { setPage('invoices'); onClose(); } },
    { id: 'expenses', label: 'Go to Corporate Expenses', category: 'Navigation', icon: Wallet, action: () => { setPage('expenses'); onClose(); } },
    { id: 'analytics', label: 'Go to Enterprise Analytics', category: 'Navigation', icon: BarChart3, action: () => { setPage('analytics'); onClose(); } },
    { id: 'employees', label: 'Go to Team Directory', category: 'Navigation', icon: UserCheck, action: () => { setPage('employees'); onClose(); } },
    { id: 'attendance', label: 'Go to Attendance Punch', category: 'Navigation', icon: Calendar, action: () => { setPage('attendance'); onClose(); } },
    { id: 'settings', label: 'Go to System Settings', category: 'Navigation', icon: Settings, action: () => { setPage('settings'); onClose(); } },
    ...(onOpenNewLead ? [{ id: 'new-lead', label: 'Create New Lead', category: 'Quick Action', icon: Plus, action: () => { onClose(); onOpenNewLead(); }, shortcut: 'N' }] : []),
    ...(onOpenNewProduct ? [{ id: 'new-product', label: 'Add Product SKU', category: 'Quick Action', icon: Plus, action: () => { onClose(); onOpenNewProduct(); }, shortcut: 'P' }] : []),
  ];

  const filtered = actions.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) || 
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-[#080B14]/85 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-[#101827] border border-white/10 rounded-2xl shadow-card-elevated overflow-hidden z-10 flex flex-col">
        {/* Subtle top illumination */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#818CF8]/60 to-transparent pointer-events-none" />

        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-[#151F32]/40">
          <Search className="w-4 h-4 text-[#818CF8] mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search workspace modules..."
            className="w-full bg-transparent text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none font-sans"
          />
          <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-400 border border-white/[0.08]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#94A3B8]">
              No commands found matching "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                    isSelected 
                      ? 'bg-[#818CF8]/15 text-white border border-[#818CF8]/30 shadow-sm' 
                      : 'text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${
                      isSelected 
                        ? 'bg-[#818CF8] text-[#080B14]' 
                        : 'bg-white/[0.04] text-slate-400'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {item.category}
                    </span>
                    {item.shortcut && (
                      <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400 border border-white/[0.06]">
                        {item.shortcut}
                      </kbd>
                    )}
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-[#818CF8]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info strip */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-[#080B14]/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>NexusFlow Command v2.4</span>
        </div>
      </div>
    </div>
  );
};

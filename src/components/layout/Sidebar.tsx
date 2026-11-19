import React from 'react';
import { 
  LayoutDashboard, Users, UserCheck, BarChart3, Package, ShoppingCart, 
  Receipt, Wallet, Contact, Sparkles, Settings, LogOut, Briefcase, 
  Calendar, X, Command
} from 'lucide-react';
import { Page } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { NexusLogo } from '../common/NexusLogo';

interface SidebarProps {
  activePage: Page;
  setPage: (p: Page) => void;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  page: Page;
  activePage: Page;
  setPage: (p: Page) => void;
  badge?: string | number;
  highlight?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon: Icon, 
  label, 
  page, 
  activePage, 
  setPage, 
  badge,
  highlight = false
}) => {
  const isActive = activePage === page;
  return (
    <button
      onClick={() => setPage(page)}
      className={`w-full group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
        isActive 
          ? 'bg-white/[0.08] text-[#F8FAFC] border border-white/10 shadow-sm' 
          : 'text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC]'
      }`}
    >
      {/* Active left indicator accent bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#818CF8] rounded-r-full" />
      )}

      <div className="flex items-center gap-2.5">
        <Icon className={`w-4 h-4 transition-colors ${
          isActive 
            ? 'text-[#818CF8]' 
            : highlight 
            ? 'text-[#2DD4BF] group-hover:text-white' 
            : 'text-slate-400 group-hover:text-slate-200'
        }`} />
        <span className="tracking-tight">{label}</span>
      </div>

      {badge !== undefined && (
        <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded-md font-semibold ${
          isActive 
            ? 'bg-[#818CF8]/20 text-[#818CF8]' 
            : 'bg-white/[0.06] text-[#94A3B8]'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setPage, isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const { leads, products } = useData();

  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const newLeadsCount = leads.filter(l => l.status === 'New').length;

  const handleNavClick = (page: Page) => {
    setPage(page);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#080B14]/80 backdrop-blur-sm md:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#080B14] border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-4 space-y-5 overflow-y-auto">
          {/* Header & Logo */}
          <div className="flex items-center justify-between px-2 pt-1 pb-2">
            <div 
              className="cursor-pointer" 
              onClick={() => handleNavClick('dashboard')}
            >
              <NexusLogo size="sm" badge="v2.4" />
            </div>
            <button 
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg" 
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick AI Launcher Pill */}
          <button
            onClick={() => handleNavClick('flow-ai')}
            className={`w-full px-3 py-2.5 rounded-xl border flex items-center justify-between transition-all duration-200 ${
              activePage === 'flow-ai'
                ? 'bg-[#818CF8]/15 border-[#818CF8]/40 text-[#818CF8] shadow-glow-primary'
                : 'bg-[#101827] border-white/[0.08] text-[#F8FAFC] hover:border-white/20 hover:bg-[#151F32]'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-[#818CF8] to-[#2DD4BF] flex items-center justify-center text-[#080B14]">
                <Sparkles className="w-3 h-3 text-[#080B14] fill-current" />
              </div>
              <span className="text-xs font-semibold tracking-tight">FlowAI Assistant</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-[#94A3B8] border border-white/[0.06]">
              ⌘K
            </span>
          </button>

          {/* Nav Categories */}
          <nav className="space-y-5">
            <div>
              <div className="px-3 mb-1.5 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                Core Platform
              </div>
              <div className="space-y-0.5">
                <NavItem icon={LayoutDashboard} label="Command Center" page="dashboard" activePage={activePage} setPage={handleNavClick} />
                <NavItem icon={BarChart3} label="Analytics Suite" page="analytics" activePage={activePage} setPage={handleNavClick} />
              </div>
            </div>

            <div>
              <div className="px-3 mb-1.5 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                CRM & Pipeline
              </div>
              <div className="space-y-0.5">
                <NavItem icon={Users} label="Leads & Prospects" page="leads" activePage={activePage} setPage={handleNavClick} badge={newLeadsCount > 0 ? newLeadsCount : undefined} />
                <NavItem icon={Briefcase} label="Sales Pipeline" page="sales-pipeline" activePage={activePage} setPage={handleNavClick} />
                <NavItem icon={Contact} label="Client Accounts" page="customers" activePage={activePage} setPage={handleNavClick} />
              </div>
            </div>

            <div>
              <div className="px-3 mb-1.5 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                Supply & Operations
              </div>
              <div className="space-y-0.5">
                <NavItem icon={Package} label="Inventory & SKUs" page="products" activePage={activePage} setPage={handleNavClick} badge={lowStockCount > 0 ? `${lowStockCount} alert` : undefined} />
                <NavItem icon={ShoppingCart} label="Orders & Fulfillment" page="orders" activePage={activePage} setPage={handleNavClick} />
              </div>
            </div>

            <div>
              <div className="px-3 mb-1.5 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                Finance & People
              </div>
              <div className="space-y-0.5">
                <NavItem icon={Receipt} label="Invoices & Billing" page="invoices" activePage={activePage} setPage={handleNavClick} />
                <NavItem icon={Wallet} label="Expenses" page="expenses" activePage={activePage} setPage={handleNavClick} />
                <NavItem icon={UserCheck} label="Team Directory" page="employees" activePage={activePage} setPage={handleNavClick} />
                <NavItem icon={Calendar} label="Attendance Punch" page="attendance" activePage={activePage} setPage={handleNavClick} />
              </div>
            </div>
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-3 border-t border-white/[0.08] space-y-1">
          <NavItem icon={Settings} label="System Settings" page="settings" activePage={activePage} setPage={handleNavClick} />
          
          <button 
            onClick={() => {
              logout();
              setPage('landing');
            }} 
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">v2.4</span>
          </button>
        </div>
      </aside>
    </>
  );
};

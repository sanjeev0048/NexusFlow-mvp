import React from 'react';
import { 
  Menu, Search, Bell, Clock, Sparkles, ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface NavbarProps {
  toggleSidebar: () => void;
  onOpenCommandPalette?: () => void;
  theme?: 'light' | 'dark';
  setTheme?: React.Dispatch<React.SetStateAction<'light' | 'dark'>> | ((t: 'light' | 'dark') => void);
}

export const Navbar: React.FC<NavbarProps> = ({ 
  toggleSidebar,
  onOpenCommandPalette
}) => {
  const { user } = useAuth();
  const { currentAttendance, toggleCheckIn } = useData();

  const isCheckedIn = !!currentAttendance?.checkIn && !currentAttendance?.checkOut;

  return (
    <header className="sticky top-0 z-30 bg-[#080B14]/85 backdrop-blur-md border-b border-white/[0.08] px-4 md:px-8 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar} 
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Command / Search Input */}
        <div 
          onClick={onOpenCommandPalette}
          className="relative hidden sm:flex items-center w-72 lg:w-96 px-3.5 py-1.5 bg-[#101827] border border-white/[0.08] rounded-xl text-xs text-[#94A3B8] cursor-pointer hover:border-[#818CF8]/40 hover:bg-[#131D2E] transition-all shadow-card-subtle group"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2.5 group-hover:text-[#818CF8] transition-colors" />
          <span className="flex-1 truncate">Search leads, inventory, invoices...</span>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/[0.06] border border-white/[0.08] rounded">⌘K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Quick Shift Attendance Punch */}
        <button
          onClick={toggleCheckIn}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition active:scale-95 ${
            isCheckedIn 
              ? 'bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 hover:bg-[#2DD4BF]/20 shadow-[0_0_15px_-3px_rgba(45,212,191,0.25)]' 
              : 'bg-[#151F32] hover:bg-white/[0.08] text-[#F8FAFC] border border-white/10'
          }`}
          title={isCheckedIn ? 'Click to Clock Out' : 'Click to Clock In for today'}
        >
          <span className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-[#2DD4BF] animate-ping' : 'bg-slate-500'}`} />
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">
            {isCheckedIn ? `In: ${currentAttendance.checkIn}` : 'Clock In'}
          </span>
          <span className="sm:hidden font-mono text-[11px]">
            {isCheckedIn ? 'Out' : 'In'}
          </span>
        </button>

        <div className="h-4 w-[1px] bg-white/[0.08] mx-1" />

        {/* Notifications */}
        <button 
          className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#818CF8] rounded-full ring-2 ring-[#080B14]" />
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-1 py-1 pr-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#818CF8] to-[#2DD4BF] text-[#080B14] flex items-center justify-center font-bold text-xs shadow-sm">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden lg:block text-left pr-1">
            <div className="text-xs font-semibold text-[#F8FAFC] leading-tight">
              {user?.name || 'Alex Morgan'}
            </div>
            <div className="text-[10px] text-[#94A3B8] font-mono capitalize">
              {user?.role || 'Admin'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

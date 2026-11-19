import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    info: <Info className="w-4 h-4 text-[#818CF8]" />
  };

  const borders = {
    success: 'border-[#2DD4BF]/30 shadow-[0_0_20px_-3px_rgba(45,212,191,0.2)]',
    error: 'border-rose-500/30 shadow-[0_0_20px_-3px_rgba(244,63,94,0.2)]',
    warning: 'border-amber-500/30 shadow-[0_0_20px_-3px_rgba(245,158,11,0.2)]',
    info: 'border-[#818CF8]/30 shadow-[0_0_20px_-3px_rgba(129,140,248,0.2)]'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none animate-slideDown">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 bg-[#151F32] border rounded-xl shadow-card-elevated backdrop-blur-md transition-all duration-300 ${borders[toast.type]}`}
        >
          <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-[#F8FAFC] leading-tight">{toast.title}</h4>
            {toast.message && (
              <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-normal">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/[0.08] transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

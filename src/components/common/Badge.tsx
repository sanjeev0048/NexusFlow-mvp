import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'accent';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className = '',
  dot = false
}) => {
  const styles: Record<string, { bg: string; text: string; border: string; dotColor: string }> = {
    default: {
      bg: 'bg-white/[0.04]',
      text: 'text-[#94A3B8]',
      border: 'border-white/[0.08]',
      dotColor: 'bg-slate-400'
    },
    success: {
      bg: 'bg-[#2DD4BF]/10',
      text: 'text-[#2DD4BF]',
      border: 'border-[#2DD4BF]/25',
      dotColor: 'bg-[#2DD4BF]'
    },
    warning: {
      bg: 'bg-amber-400/10',
      text: 'text-amber-300',
      border: 'border-amber-400/25',
      dotColor: 'bg-amber-400'
    },
    danger: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/25',
      dotColor: 'bg-rose-500'
    },
    info: {
      bg: 'bg-sky-500/10',
      text: 'text-sky-300',
      border: 'border-sky-500/25',
      dotColor: 'bg-sky-400'
    },
    purple: {
      bg: 'bg-[#818CF8]/10',
      text: 'text-[#818CF8]',
      border: 'border-[#818CF8]/25',
      dotColor: 'bg-[#818CF8]'
    },
    accent: {
      bg: 'bg-[#2DD4BF]/10',
      text: 'text-[#2DD4BF]',
      border: 'border-[#2DD4BF]/30',
      dotColor: 'bg-[#2DD4BF]'
    }
  };

  const current = styles[variant] || styles.default;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-tight ${current.bg} ${current.text} ${current.border} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${current.dotColor} animate-pulse`} />}
      {children}
    </span>
  );
};

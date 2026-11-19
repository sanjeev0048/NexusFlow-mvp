import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  elevated?: boolean;
  glowTop?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverable = false, 
  elevated = false,
  glowTop = false,
  ...props 
}) => (
  <div 
    className={`relative rounded-2xl border transition-all duration-200 ${
      elevated 
        ? 'bg-[#151F32] border-white/10 shadow-card-elevated' 
        : 'bg-[#101827] border-white/[0.08] shadow-card-subtle'
    } ${
      hoverable 
        ? 'hover:border-white/20 hover:shadow-card-elevated hover:bg-[#131D2E] transition-all' 
        : ''
    } ${className}`}
    {...props}
  >
    {/* Subtle top border illumination */}
    {glowTop && (
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#818CF8]/30 to-transparent pointer-events-none" />
    )}
    {children}
  </div>
);

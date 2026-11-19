import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverable = false, 
  elevated = false,
  ...props 
}) => (
  <div 
    className={`rounded-2xl border transition-all duration-200 ${
      elevated 
        ? 'bg-[#151F32] border-white/10 shadow-card-elevated' 
        : 'bg-[#101827] border-white/[0.07] shadow-card-subtle'
    } ${
      hoverable 
        ? 'hover:border-white/20 hover:shadow-card-elevated hover:bg-[#131D2E] transition-all' 
        : ''
    } ${className}`}
    {...props}
  >
    {children}
  </div>
);

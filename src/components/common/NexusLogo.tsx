import React from 'react';

interface NexusLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  badge?: string;
}

export const NexusLogo: React.FC<NexusLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '',
  badge
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  }[size];

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Minimal geometric N symbol */}
      <div className={`relative ${iconSizes} rounded-xl bg-[#101827] border border-white/10 shadow-card-subtle flex items-center justify-center p-1.5 transition-all duration-300 group-hover:border-[#818CF8]/40 group-hover:shadow-glow-primary`}>
        {/* Subtle interior glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#818CF8]/10 via-transparent to-[#2DD4BF]/10 pointer-events-none" />
        
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full relative z-10"
        >
          {/* Left vertical pillar */}
          <path 
            d="M5 4.5V19.5" 
            stroke="#818CF8" 
            strokeWidth="2.75" 
            strokeLinecap="round" 
          />
          {/* Diagonal connecting blade */}
          <path 
            d="M5 5.5L19 18.5" 
            stroke="url(#nexus-grad)" 
            strokeWidth="2.75" 
            strokeLinecap="round" 
          />
          {/* Right vertical pillar */}
          <path 
            d="M19 4.5V19.5" 
            stroke="#2DD4BF" 
            strokeWidth="2.75" 
            strokeLinecap="round" 
          />
          <defs>
            <linearGradient id="nexus-grad" x1="5" y1="5.5" x2="19" y2="18.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818CF8" />
              <stop offset="1" stopColor="#2DD4BF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-bold tracking-tight text-[#F8FAFC] font-sans ${textSizes}`}>
              Nexus<span className="text-[#818CF8]">Flow</span>
            </span>
            {badge && (
              <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/[0.06] text-[#94A3B8] border border-white/[0.08]">
                {badge}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

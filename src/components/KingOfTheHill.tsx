'use client';

import Link from 'next/link';

interface KOTHProps {
  token?: {
    symbol: string;
    name: string;
    logo: string;
    pairAddress: string;
    volume30m: number;
    maxVolume: number;
    priceChange: number;
  };
}

const defaultKOTH = {
  symbol: 'GIRAFFES',
  name: 'The Giraffes',
  logo: 'https://cdn.dexscreener.com/cms/images/oEITILHKIYrx6M45?width=800&height=800&quality=90',
  pairAddress: '2ZeRYWYPW8kUE4excbfWEWEQL2ia1TzDEn6x9j2Uu6yo',
  volume30m: 847000,
  maxVolume: 1000000,
  priceChange: 44.33,
};

export default function KingOfTheHill({ token = defaultKOTH }: KOTHProps) {
  const progress = Math.min((token.volume30m / token.maxVolume) * 100, 100);
  
  const formatVolume = (value: number) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="px-4 pt-1.5 pb-0.5 bg-[#0b0b0d]">
      <Link 
        href={`/token/${token.pairAddress}`}
        className="group block relative overflow-hidden rounded border border-[#D4AF37]/40 bg-gradient-to-r from-[#1a1505] via-[#141104] to-[#1a1505] hover:border-[#D4AF37]/60 transition-all cursor-pointer"
      >
        {/* Progress bar fill */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/25 via-[#FFD700]/20 to-[#D4AF37]/15 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        
        {/* Animated glow pulse */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/0 via-[#FFD700]/10 to-[#FFD700]/0 animate-koth-pulse" />
        
        {/* Shimmer sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/8 to-transparent animate-shimmer" />
        
        {/* Content - single compact row */}
        <div className="relative flex items-center justify-between px-3 py-1.5">
          {/* Left - Crown + Label + Token */}
          <div className="flex items-center gap-2">
            <span className="text-sm">👑</span>
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wide">KOTH</span>
            <div className="w-px h-3.5 bg-[#D4AF37]/20" />
            <img 
              src={token.logo}
              alt={token.symbol}
              className="w-5 h-5 rounded object-cover border border-[#D4AF37]/30"
            />
            <span className="text-[12px] font-bold text-[#FFD700]">{token.symbol}</span>
            <span className="text-[11px] text-[#8B7355]">/SOL</span>
          </div>
          
          {/* Right - Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#8B7355] uppercase">30m</span>
              <span className="text-[12px] font-bold text-[#FFD700]">{formatVolume(token.volume30m)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[12px] font-bold ${token.priceChange >= 0 ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
                {token.priceChange >= 0 ? '+' : ''}{token.priceChange.toFixed(1)}%
              </span>
            </div>
            <div className="w-16 h-1.5 bg-[#0f0d05] rounded-full overflow-hidden border border-[#D4AF37]/20">
              <div 
                className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#F0E68C] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

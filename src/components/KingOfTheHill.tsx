'use client';

import Link from 'next/link';

interface KOTHProps {
  token?: {
    symbol: string;
    name: string;
    logo: string;
    pairAddress: string;
    volume30m: number;
    maxVolume: number; // Target/threshold volume for progress bar
    priceChange: number;
  };
}

// Default KOTH token (will be replaced with live data later)
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
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="px-4 py-2 bg-[#0b0b0d]">
      <Link 
        href={`/token/${token.pairAddress}`}
        className="block relative overflow-hidden rounded-lg border border-[#8B6914] bg-gradient-to-r from-[#1a1608] via-[#1f1a0a] to-[#1a1608] hover:from-[#221c0a] hover:via-[#2a220c] hover:to-[#221c0a] transition-all cursor-pointer"
      >
        {/* Progress bar background */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 via-[#FFA500]/15 to-[#FFD700]/10 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/5 to-transparent animate-shimmer" />
        
        {/* Content */}
        <div className="relative flex items-center justify-between px-4 py-2.5">
          {/* Left side - Crown + Token info */}
          <div className="flex items-center gap-3">
            {/* Crown icon */}
            <div className="text-2xl">👑</div>
            
            {/* KOTH Label */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#FFD700] uppercase tracking-wider">
                King of the Hill
              </span>
              <span className="text-[10px] text-[#8B7355]">
                Highest 30m Volume
              </span>
            </div>
            
            {/* Divider */}
            <div className="w-px h-8 bg-[#8B6914]/30 mx-2" />
            
            {/* Token info */}
            <div className="flex items-center gap-2">
              <img 
                src={token.logo}
                alt={token.symbol}
                className="w-8 h-8 rounded-md object-cover border border-[#8B6914]/50"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#FFD700]">{token.symbol}</span>
                  <span className="text-[12px] text-[#8B7355]">/SOL</span>
                </div>
                <span className="text-[11px] text-[#6B5A3E] truncate max-w-[120px]">{token.name}</span>
              </div>
            </div>
          </div>
          
          {/* Right side - Volume + Change */}
          <div className="flex items-center gap-6">
            {/* 30m Volume */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-[#8B7355] uppercase">30m Vol</span>
              <span className="text-[15px] font-bold text-[#FFD700]">
                {formatVolume(token.volume30m)}
              </span>
            </div>
            
            {/* Price Change */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-[#8B7355] uppercase">Change</span>
              <span className={`text-[15px] font-bold ${token.priceChange >= 0 ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
                {token.priceChange >= 0 ? '+' : ''}{token.priceChange.toFixed(2)}%
              </span>
            </div>
            
            {/* Progress indicator */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-20 h-2 bg-[#1a1608] rounded-full overflow-hidden border border-[#8B6914]/30">
                <div 
                  className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[9px] text-[#8B7355]">{progress.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

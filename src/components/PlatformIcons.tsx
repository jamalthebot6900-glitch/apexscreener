'use client';

import { cn } from '@/lib/utils';

// DEX name mapping for clean display
const DEX_NAMES: Record<string, string> = {
  'raydium': 'Raydium',
  'raydium_cp': 'Raydium',
  'raydium_clmm': 'Raydium',
  'raydium_cpmm': 'Raydium',
  'orca': 'Orca',
  'orca_whirlpool': 'Orca',
  'whirlpool': 'Orca',
  'meteora': 'Meteora',
  'meteora_dlmm': 'Meteora',
  'pumpfun': 'Pump.fun',
  'pump': 'Pump.fun',
  'jupiter': 'Jupiter',
  'lifinity': 'Lifinity',
  'phoenix': 'Phoenix',
  'openbook': 'OpenBook',
};

// DEX colors
const DEX_COLORS: Record<string, { bg: string; text: string }> = {
  'raydium': { bg: 'bg-[#5AC4BE]/15', text: 'text-[#5AC4BE]' },
  'orca': { bg: 'bg-[#FFD15C]/15', text: 'text-[#FFD15C]' },
  'meteora': { bg: 'bg-[#FF6B35]/15', text: 'text-[#FF6B35]' },
  'pumpfun': { bg: 'bg-[#00D18C]/15', text: 'text-[#00D18C]' },
  'pump': { bg: 'bg-[#00D18C]/15', text: 'text-[#00D18C]' },
  'jupiter': { bg: 'bg-[#19FB9B]/15', text: 'text-[#19FB9B]' },
  'lifinity': { bg: 'bg-purple-500/15', text: 'text-purple-400' },
  'phoenix': { bg: 'bg-orange-500/15', text: 'text-orange-400' },
  'openbook': { bg: 'bg-blue-500/15', text: 'text-blue-400' },
};

// DEX Badge - text-based badge showing DEX name
export function DexBadge({ dexId }: { dexId: string }) {
  if (!dexId) return null;
  
  const dexLower = dexId.toLowerCase();
  
  // Find matching DEX name
  let displayName = 'DEX';
  let colorKey = 'default';
  
  for (const [key, name] of Object.entries(DEX_NAMES)) {
    if (dexLower.includes(key)) {
      displayName = name;
      colorKey = key.includes('raydium') ? 'raydium' 
        : key.includes('orca') || key.includes('whirl') ? 'orca'
        : key.includes('meteora') ? 'meteora'
        : key.includes('pump') ? 'pump'
        : key.includes('jupiter') ? 'jupiter'
        : key;
      break;
    }
  }
  
  const colors = DEX_COLORS[colorKey] || { bg: 'bg-white/10', text: 'text-text-muted' };
  
  return (
    <span className={cn(
      'inline-flex px-1 py-0 rounded text-[8px] font-medium uppercase tracking-wide',
      colors.bg,
      colors.text
    )}>
      {displayName}
    </span>
  );
}

export function PumpFunIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#00D18C" />
      <path 
        d="M12 5C12 5 8 8 8 12C8 14.5 9.5 16.5 12 17C12 17 10 15 10 12.5C10 10 12 8 12 8C12 8 14 10 14 12.5C14 15 12 17 12 17C14.5 16.5 16 14.5 16 12C16 8 12 5 12 5Z" 
        fill="white"
      />
      <circle cx="12" cy="19" r="1.5" fill="white" />
    </svg>
  );
}

export function RaydiumIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#5AC4BE" />
      <path 
        d="M7 8L12 5L17 8V16L12 19L7 16V8Z" 
        stroke="white" 
        strokeWidth="1.5" 
        fill="none"
      />
      <path d="M12 5V19" stroke="white" strokeWidth="1.2" />
      <path d="M7 8L17 16" stroke="white" strokeWidth="1.2" />
      <path d="M17 8L7 16" stroke="white" strokeWidth="1.2" />
    </svg>
  );
}

export function JupiterIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#19FB9B" />
      <circle cx="12" cy="12" r="6" stroke="#000" strokeWidth="1.5" fill="none" />
      <ellipse cx="12" cy="12" rx="9" ry="3" stroke="#000" strokeWidth="1.2" fill="none" />
      <circle cx="12" cy="12" r="2" fill="#000" />
    </svg>
  );
}

export function MeteoraIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#FF6B35" />
      <path 
        d="M12 4L14 10H20L15 14L17 20L12 16L7 20L9 14L4 10H10L12 4Z" 
        fill="white"
      />
    </svg>
  );
}

export function OrcaIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#FFD15C" />
      <ellipse cx="12" cy="13" rx="7" ry="5" fill="#1A1A2E" />
      <ellipse cx="9" cy="12" rx="1.5" ry="2" fill="white" />
      <ellipse cx="15" cy="12" rx="1.5" ry="2" fill="white" />
      <path d="M5 10C5 10 3 8 5 6" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 10C19 10 21 8 19 6" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Solana chain badge
export function SolanaBadge({ size = 14 }: { size?: number }) {
  const uniqueId = `solana-gradient-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id={uniqueId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FFA3" />
          <stop offset="50%" stopColor="#03E1FF" />
          <stop offset="100%" stopColor="#DC1FFF" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill="#111" stroke={`url(#${uniqueId})`} strokeWidth="1"/>
      <g transform="translate(7, 8)">
        <path d="M0.5 12.5L2.5 14.5C2.8 14.8 3.2 15 3.6 15H17C17.8 15 18.2 14 17.6 13.4L15.6 11.4C15.3 11.1 14.9 11 14.5 11H1C0.2 11 -0.2 12 0.5 12.5Z" fill={`url(#${uniqueId})`}/>
        <path d="M0.5 6.5L2.5 4.5C2.8 4.2 3.2 4 3.6 4H17C17.8 4 18.2 5 17.6 5.6L15.6 7.6C15.3 7.9 14.9 8 14.5 8H1C0.2 8 -0.2 7 0.5 6.5Z" fill={`url(#${uniqueId})`}/>
        <path d="M15.6 0.6L17.6 2.6C18.2 3.2 17.8 4 17 4H3.6C3.2 4 2.8 3.8 2.5 3.5L0.5 1.5C-0.2 0.9 0.2 0 1 0H14.5C14.9 0 15.3 0.2 15.6 0.6Z" fill={`url(#${uniqueId})`}/>
      </g>
    </svg>
  );
}

// Get platform icon by dexId or address
export function getPlatformBadge(dexId: string, address: string): React.ReactNode {
  if (address?.toLowerCase().endsWith('pump')) {
    return <PumpFunIcon size={14} />;
  }
  
  const dexLower = dexId?.toLowerCase() || '';
  
  if (dexLower.includes('raydium')) return <RaydiumIcon size={14} />;
  if (dexLower.includes('jupiter') || dexLower === 'jup') return <JupiterIcon size={14} />;
  if (dexLower.includes('meteora')) return <MeteoraIcon size={14} />;
  if (dexLower.includes('orca')) return <OrcaIcon size={14} />;
  
  return null;
}

// Platform badge wrapper with tooltip
export function PlatformBadge({ dexId, address }: { dexId: string; address: string }) {
  const badge = getPlatformBadge(dexId, address);
  
  if (!badge) return null;
  
  const platformName = address?.toLowerCase().endsWith('pump') 
    ? 'Pump.fun'
    : dexId?.charAt(0).toUpperCase() + dexId?.slice(1);
  
  return (
    <div 
      className="flex-shrink-0 opacity-90 hover:opacity-100 transition-opacity cursor-help"
      title={platformName}
    >
      {badge}
    </div>
  );
}

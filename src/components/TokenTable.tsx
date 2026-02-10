'use client';

import Link from 'next/link';

// Solana badge - gradient purple/green
function SolanaBadge() {
  return (
    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#9945FF] via-[#14F195] to-[#00FFA3] flex items-center justify-center flex-shrink-0">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="white">
        <path d="M4 17.5L8 13.5H20L16 17.5H4Z" />
        <path d="M4 6.5L8 10.5H20L16 6.5H4Z" />
        <path d="M4 12L8 8H20L16 12H4Z" />
      </svg>
    </div>
  );
}

// Raydium/Swap badge - teal
function SwapBadge() {
  return (
    <div className="w-5 h-5 rounded-full bg-[#3ee6c4] flex items-center justify-center flex-shrink-0">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#0e1118">
        <path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" stroke="#0e1118" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    </div>
  );
}

// Static token data - Token #1: Goyim
const tokens = [
  {
    rank: 1,
    symbol: 'Goyim',
    pair: 'SOL',
    name: 'Goyim',
    logo: null, // Will use placeholder
    logoColor: '#e91e8c', // Pink
    price: '$0.004372',
    age: '8d',
    txns: '49,709',
    volume: '$3.4M',
    makers: '10,862',
    change5m: { value: '5.22%', positive: true },
    change1h: { value: '-7.23%', positive: false },
    change6h: { value: '70.63%', positive: true },
    change24h: { value: '188%', positive: true },
    liquidity: '$271K',
    mcap: '$4.3M',
  },
];

export default function TokenTable() {
  return (
    <div className="overflow-x-auto bg-[#0d0d0f]">
      <table className="w-full min-w-[1200px]">
        {/* Header */}
        <thead>
          <tr className="bg-[#16161a] border-b border-[#2a2a2e]">
            <th className="pl-4 pr-2 py-3 text-[12px] font-bold text-[#8a8a8a] uppercase tracking-wide text-left w-[350px]">
              TOKEN
            </th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">
              <span className="inline-flex items-center gap-1">
                PRICE
                <svg className="w-3 h-3 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </span>
            </th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#8a8a8a] uppercase tracking-wide text-center">AGE</th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">TXNS</th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">VOLUME</th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">MAKERS</th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">5M</th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">1H</th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">6H</th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">24H</th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">LIQUIDITY</th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right pr-4">MCAP</th>
          </tr>
        </thead>
        
        {/* Body */}
        <tbody>
          {tokens.map((token) => (
            <tr key={token.rank} className="bg-[#111114] border-b border-[#1e1e22] hover:bg-[#16161a] transition-colors">
              {/* Token info */}
              <td className="pl-4 pr-2 py-3">
                <div className="flex items-center gap-2">
                  {/* Rank */}
                  <span className="text-[13px] text-[#6a6a6a] font-medium w-6">#{token.rank}</span>
                  
                  {/* Badges */}
                  <SolanaBadge />
                  <SwapBadge />
                  
                  {/* Token logo */}
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[14px] font-bold text-white"
                    style={{ backgroundColor: token.logoColor }}
                  >
                    {token.symbol.charAt(0)}
                  </div>
                  
                  {/* Token name */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-bold text-white">{token.symbol}</span>
                    <span className="text-[13px] text-[#6a6a6a]">/{token.pair}</span>
                    <span className="text-[13px] text-[#5a5a5a]">{token.name}</span>
                  </div>
                </div>
              </td>
              
              {/* Price */}
              <td className="px-4 py-3 text-right">
                <span className="text-[14px] font-semibold text-white">{token.price}</span>
              </td>
              
              {/* Age */}
              <td className="px-4 py-3 text-center">
                <span className="text-[14px] text-[#8a8a8a]">{token.age}</span>
              </td>
              
              {/* Txns */}
              <td className="px-4 py-3 text-right">
                <span className="text-[14px] text-white">{token.txns}</span>
              </td>
              
              {/* Volume */}
              <td className="px-4 py-3 text-right">
                <span className="text-[14px] font-semibold text-white">{token.volume}</span>
              </td>
              
              {/* Makers */}
              <td className="px-4 py-3 text-right">
                <span className="text-[14px] text-[#8a8a8a]">{token.makers}</span>
              </td>
              
              {/* 5M */}
              <td className="px-4 py-3 text-right">
                <span className={`text-[14px] font-semibold ${token.change5m.positive ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
                  {token.change5m.value}
                </span>
              </td>
              
              {/* 1H */}
              <td className="px-4 py-3 text-right">
                <span className={`text-[14px] font-semibold ${token.change1h.positive ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
                  {token.change1h.value}
                </span>
              </td>
              
              {/* 6H */}
              <td className="px-4 py-3 text-right">
                <span className={`text-[14px] font-semibold ${token.change6h.positive ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
                  {token.change6h.value}
                </span>
              </td>
              
              {/* 24H */}
              <td className="px-4 py-3 text-right">
                <span className={`text-[14px] font-semibold ${token.change24h.positive ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
                  {token.change24h.value}
                </span>
              </td>
              
              {/* Liquidity */}
              <td className="px-4 py-3 text-right">
                <span className="text-[14px] font-semibold text-[#00d395]">{token.liquidity}</span>
              </td>
              
              {/* MCap */}
              <td className="px-4 py-3 text-right pr-4">
                <span className="text-[14px] font-semibold text-white">{token.mcap}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

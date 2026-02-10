'use client';

import Link from 'next/link';

// Solana logo - official gradient
function SolanaLogo() {
  return (
    <img 
      src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
      alt="Solana"
      className="w-4 h-4 rounded-full"
    />
  );
}

// PumpSwap logo
function PumpSwapLogo() {
  return (
    <img 
      src="https://dd.dexscreener.com/ds-data/dexes/pumpswap.png"
      alt="PumpSwap"
      className="w-4 h-4 rounded-full"
    />
  );
}

// Static token data
const tokens = [
  {
    rank: 1,
    symbol: 'Goyim',
    pair: 'SOL',
    name: 'Goyim',
    pairAddress: 'ASCSDmpkbXDNRiPRKGAPiLU4Kukc6P8vgNBtNhGw3Hnf',
    logo: 'https://dd.dexscreener.com/ds-data/tokens/solana/9S8edqWxoWz5LYLnxWUmWBJnePg35WfdYQp7HQkUpump.png',
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
  {
    rank: 2,
    symbol: 'GIRAFFES',
    pair: 'SOL',
    name: 'The Giraffes',
    pairAddress: '2ZeRYWYPW8kUE4excbfWEWEQL2ia1TzDEn6x9j2Uu6yo',
    logo: 'https://cdn.dexscreener.com/cms/images/oEITILHKIYrx6M45?width=800&height=800&quality=90',
    price: '$0.001925',
    age: '3h',
    txns: '44,952',
    volume: '$3.0M',
    makers: '6,200',
    change5m: { value: '1.54%', positive: true },
    change1h: { value: '17.76%', positive: true },
    change6h: { value: '5,143%', positive: true },
    change24h: { value: '5,143%', positive: true },
    liquidity: '$119K',
    mcap: '$1.9M',
  },
  {
    rank: 3,
    symbol: 'SUBWAY',
    pair: 'SOL',
    name: 'Subway Queen',
    logo: 'https://cdn.dexscreener.com/cms/images/s7bk8qj6otd-czeR?width=800&height=800&quality=90',
    price: '$0.01149',
    age: '3h',
    txns: '28,750',
    volume: '$2.8M',
    makers: '3,800',
    change5m: { value: '1.69%', positive: true },
    change1h: { value: '48.67%', positive: true },
    change6h: { value: '21,762%', positive: true },
    change24h: { value: '21,762%', positive: true },
    liquidity: '$272K',
    mcap: '$11.5M',
  },
  {
    rank: 4,
    symbol: 'TúAnh',
    pair: 'SOL',
    name: 'Tú Anh',
    logo: 'https://cdn.dexscreener.com/cms/images/345300ed690347c326cc0cf22517d96100227455d899400b78c9eec46d9afd34?width=800&height=800&quality=90',
    price: '$0.0004514',
    age: '4d',
    txns: '3,913',
    volume: '$213K',
    makers: '2,400',
    change5m: { value: '-0.72%', positive: false },
    change1h: { value: '-1.72%', positive: false },
    change6h: { value: '30.44%', positive: true },
    change24h: { value: '-2.69%', positive: false },
    liquidity: '$56K',
    mcap: '$422K',
  },
  {
    rank: 5,
    symbol: '1234567891',
    pair: 'SOL',
    name: '01112131415161718192021222324252',
    logo: 'https://cdn.dexscreener.com/cms/images/UcWHOsHvME_t5aw1?width=800&height=800&quality=90',
    price: '$0.00009419',
    age: '9h',
    txns: '23,290',
    volume: '$1.4M',
    makers: '3,900',
    change5m: { value: '-4.63%', positive: false },
    change1h: { value: '-17.72%', positive: false },
    change6h: { value: '-47.70%', positive: false },
    change24h: { value: '155%', positive: true },
    liquidity: '$26K',
    mcap: '$94K',
  },
  {
    rank: 6,
    symbol: 'しずく',
    pair: 'SOL',
    name: 'Shizuku AI',
    logo: 'https://cdn.dexscreener.com/cms/images/B14wmZvuFQNiOl0_?width=800&height=800&quality=90',
    price: '$0.0002638',
    age: '7h',
    txns: '43,982',
    volume: '$3.0M',
    makers: '6,100',
    change5m: { value: '1.17%', positive: true },
    change1h: { value: '65.14%', positive: true },
    change6h: { value: '-0.97%', positive: false },
    change24h: { value: '633%', positive: true },
    liquidity: '$47K',
    mcap: '$264K',
  },
  {
    rank: 7,
    symbol: 'Zhdun',
    pair: 'SOL',
    name: 'The one who waits',
    logo: 'https://cdn.dexscreener.com/cms/images/punlBS_mWWW-3yLZ?width=800&height=800&quality=90',
    price: '$0.00009359',
    age: '2h',
    txns: '10,074',
    volume: '$373K',
    makers: '2,800',
    change5m: { value: '-16.09%', positive: false },
    change1h: { value: '159%', positive: true },
    change6h: { value: '159%', positive: true },
    change24h: { value: '159%', positive: true },
    liquidity: '$25K',
    mcap: '$94K',
  },
  {
    rank: 8,
    symbol: 'chud',
    pair: 'SOL',
    name: 'chud',
    logo: 'https://cdn.dexscreener.com/cms/images/JvRYfGlXmPyofsRc?width=800&height=800&quality=90',
    price: '$0.0001181',
    age: '6h',
    txns: '23,868',
    volume: '$1.4M',
    makers: '3,900',
    change5m: { value: '1.29%', positive: true },
    change1h: { value: '44.47%', positive: true },
    change6h: { value: '-24.17%', positive: false },
    change24h: { value: '222%', positive: true },
    liquidity: '$29K',
    mcap: '$118K',
  },
  {
    rank: 9,
    symbol: 'Buttcoin',
    pair: 'SOL',
    name: 'Buttcoin',
    logo: 'https://cdn.dexscreener.com/cms/images/baf3d4bdaac47ef59f32c8ddc11f83e995f351be1eef6d4d192d72ff8def0020?width=800&height=800&quality=90',
    price: '$0.02468',
    age: '1mo',
    txns: '14,335',
    volume: '$3.5M',
    makers: '2,600',
    change5m: { value: '0.85%', positive: true },
    change1h: { value: '-7.37%', positive: false },
    change6h: { value: '-21.52%', positive: false },
    change24h: { value: '-15.56%', positive: false },
    liquidity: '$725K',
    mcap: '$24.7M',
  },
  {
    rank: 10,
    symbol: 'Gentlemen',
    pair: 'SOL',
    name: 'This Is Gentlemen',
    logo: 'https://cdn.dexscreener.com/cms/images/1b70b48ea9ac2b8d57e38499270c2b8205ae2bc714295bc21b0383874d67e325?width=800&height=800&quality=90',
    price: '$0.00008761',
    age: '1d',
    txns: '48,838',
    volume: '$2.8M',
    makers: '9,700',
    change5m: { value: '0.38%', positive: true },
    change1h: { value: '29.35%', positive: true },
    change6h: { value: '-70.68%', positive: false },
    change24h: { value: '-50.45%', positive: false },
    liquidity: '$27K',
    mcap: '$88K',
  },
  {
    rank: 11,
    symbol: 'SHT',
    pair: 'SOL',
    name: 'ShitCoin',
    logo: 'https://cdn.dexscreener.com/cms/images/nDJ1q2w8poI2QSk_?width=800&height=800&quality=90',
    price: '$0.0007523',
    age: '2d',
    txns: '10,042',
    volume: '$1.0M',
    makers: '2,300',
    change5m: { value: '0.72%', positive: true },
    change1h: { value: '-4.30%', positive: false },
    change6h: { value: '-21.42%', positive: false },
    change24h: { value: '22.78%', positive: true },
    liquidity: '$84K',
    mcap: '$752K',
  },
  {
    rank: 12,
    symbol: 'Company',
    pair: 'SOL',
    name: 'Company',
    logo: 'https://cdn.dexscreener.com/cms/images/5_kJNDVFDfRBgMyi?width=800&height=800&quality=90',
    price: '$0.003670',
    age: '8h',
    txns: '21,365',
    volume: '$2.0M',
    makers: '2,800',
    change5m: { value: '-23.28%', positive: false },
    change1h: { value: '-32.76%', positive: false },
    change6h: { value: '-63.94%', positive: false },
    change24h: { value: '633%', positive: true },
    liquidity: '$48K',
    mcap: '$220K',
  },
  {
    rank: 13,
    symbol: 'BigTrout',
    pair: 'SOL',
    name: 'The Big Trout',
    logo: 'https://cdn.dexscreener.com/cms/images/fb4524d6044e50452afdbcc7b79b9b8b4a03ce8b7c4244cb330e294e8ea6056b?width=800&height=800&quality=90',
    price: '$0.001801',
    age: '5d',
    txns: '10,201',
    volume: '$1.2M',
    makers: '2,500',
    change5m: { value: '-0.01%', positive: false },
    change1h: { value: '-10.83%', positive: false },
    change6h: { value: '-20.06%', positive: false },
    change24h: { value: '-4.42%', positive: false },
    liquidity: '$168K',
    mcap: '$1.7M',
  },
  {
    rank: 14,
    symbol: 'tortoise',
    pair: 'SOL',
    name: 'the tortoise',
    logo: 'https://cdn.dexscreener.com/cms/images/cbe645c2e3444110cbb2d80e76c0eb054aab80714f521930b8b8b0be89f8b874?width=800&height=800&quality=90',
    price: '$0.0002393',
    age: '15h',
    txns: '31,528',
    volume: '$2.1M',
    makers: '5,100',
    change5m: { value: '-3.91%', positive: false },
    change1h: { value: '15.14%', positive: true },
    change6h: { value: '71.08%', positive: true },
    change24h: { value: '581%', positive: true },
    liquidity: '$43K',
    mcap: '$239K',
  },
  {
    rank: 15,
    symbol: 'PENGUIN',
    pair: 'SOL',
    name: 'Nietzschean Penguin',
    logo: 'https://cdn.dexscreener.com/cms/images/c059ef5be405aaafea88427519c0d0c52456e21f1fdeaab2df90b4a5d3304089?width=800&height=800&quality=90',
    price: '$0.02248',
    age: '4d',
    txns: '7,513',
    volume: '$1.8M',
    makers: '1,800',
    change5m: { value: '1.73%', positive: true },
    change1h: { value: '2.54%', positive: true },
    change6h: { value: '-1.68%', positive: false },
    change24h: { value: '-22.16%', positive: false },
    liquidity: '$754K',
    mcap: '$22.5M',
  },
];

export default function TokenTable() {
  return (
    <div className="overflow-x-auto bg-[#0d0d0f]">
      <table className="w-full">
        {/* Header */}
        <thead>
          <tr className="bg-[#16161a] border-b border-[#2a2a2e]">
            <th className="pl-3 pr-2 py-2 text-[11px] font-bold text-[#8a8a8a] uppercase tracking-wide text-left">
              TOKEN
            </th>
            <th className="px-2 py-2 text-[11px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">
              <span className="inline-flex items-center gap-1">
                PRICE
                <svg className="w-2.5 h-2.5 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </span>
            </th>
            <th className="px-2 py-2 text-[11px] font-bold text-[#8a8a8a] uppercase tracking-wide text-center">AGE</th>
            <th className="px-2 py-2 text-[11px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">TXNS</th>
            <th className="px-2 py-2 text-[11px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">VOLUME</th>
            <th className="px-2 py-2 text-[11px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">MAKERS</th>
            <th className="px-2 py-2 text-[11px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">5M</th>
            <th className="px-2 py-2 text-[11px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">1H</th>
            <th className="px-2 py-2 text-[11px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">6H</th>
            <th className="px-2 py-2 text-[11px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">24H</th>
            <th className="px-2 py-2 text-[11px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right">LIQUIDITY</th>
            <th className="px-2 py-2 text-[11px] font-bold text-[#8a8a8a] uppercase tracking-wide text-right pr-3">MCAP</th>
          </tr>
        </thead>
        
        {/* Body */}
        <tbody>
          {tokens.map((token) => (
            <tr 
              key={token.rank} 
              className="bg-[#111114] border-b border-[#1e1e22] hover:bg-[#16161a] transition-colors cursor-pointer"
              onClick={() => token.pairAddress && (window.location.href = `/token/${token.pairAddress}`)}
            >
              {/* Token info */}
              <td className="pl-3 pr-2 py-2">
                <div className="flex items-center gap-1.5">
                  {/* Rank */}
                  <span className="text-[12px] text-[#6a6a6a] font-medium w-5">#{token.rank}</span>
                  
                  {/* Solana logo */}
                  <SolanaLogo />
                  
                  {/* PumpSwap logo */}
                  <PumpSwapLogo />
                  
                  {/* Token logo */}
                  <img 
                    src={token.logo}
                    alt={token.symbol}
                    className="w-6 h-6 rounded-sm object-cover"
                  />
                  
                  {/* Token name */}
                  <div className="flex items-center gap-1">
                    <span className="text-[13px] font-bold text-white">{token.symbol}</span>
                    <span className="text-[12px] text-[#6a6a6a]">/{token.pair}</span>
                    <span className="text-[12px] text-[#5a5a5a] truncate max-w-[100px]">{token.name}</span>
                  </div>
                </div>
              </td>
              
              {/* Price */}
              <td className="px-2 py-2 text-right">
                <span className="text-[13px] font-semibold text-white">{token.price}</span>
              </td>
              
              {/* Age */}
              <td className="px-2 py-2 text-center">
                <span className="text-[13px] text-[#8a8a8a]">{token.age}</span>
              </td>
              
              {/* Txns */}
              <td className="px-2 py-2 text-right">
                <span className="text-[13px] text-white">{token.txns}</span>
              </td>
              
              {/* Volume */}
              <td className="px-2 py-2 text-right">
                <span className="text-[13px] font-semibold text-white">{token.volume}</span>
              </td>
              
              {/* Makers */}
              <td className="px-2 py-2 text-right">
                <span className="text-[13px] text-[#8a8a8a]">{token.makers}</span>
              </td>
              
              {/* 5M */}
              <td className="px-2 py-2 text-right">
                <span className={`text-[13px] font-semibold ${token.change5m.positive ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
                  {token.change5m.value}
                </span>
              </td>
              
              {/* 1H */}
              <td className="px-2 py-2 text-right">
                <span className={`text-[13px] font-semibold ${token.change1h.positive ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
                  {token.change1h.value}
                </span>
              </td>
              
              {/* 6H */}
              <td className="px-2 py-2 text-right">
                <span className={`text-[13px] font-semibold ${token.change6h.positive ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
                  {token.change6h.value}
                </span>
              </td>
              
              {/* 24H */}
              <td className="px-2 py-2 text-right">
                <span className={`text-[13px] font-semibold ${token.change24h.positive ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
                  {token.change24h.value}
                </span>
              </td>
              
              {/* Liquidity */}
              <td className="px-2 py-2 text-right">
                <span className="text-[13px] font-semibold text-[#00d395]">{token.liquidity}</span>
              </td>
              
              {/* MCap */}
              <td className="px-2 py-2 text-right pr-3">
                <span className="text-[13px] font-semibold text-white">{token.mcap}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// Build 1770703848

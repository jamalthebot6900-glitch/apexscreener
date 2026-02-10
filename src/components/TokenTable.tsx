'use client';

// Solana logo - official gradient
function SolanaLogo() {
  return (
    <img 
      src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
      alt="Solana"
      className="w-5 h-5 rounded-full"
    />
  );
}

// PumpSwap logo
function PumpSwapLogo() {
  return (
    <img 
      src="https://dd.dexscreener.com/ds-data/dexes/pumpswap.png"
      alt="PumpSwap"
      className="w-5 h-5 rounded-full"
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
                  
                  {/* Solana logo */}
                  <SolanaLogo />
                  
                  {/* PumpSwap logo */}
                  <PumpSwapLogo />
                  
                  {/* Token logo */}
                  <img 
                    src={token.logo}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-sm object-cover"
                  />
                  
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

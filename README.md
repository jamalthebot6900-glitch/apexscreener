# SolScope - Solana Token Screener

A real-time Solana memecoin and token screener, similar to DexScreener.

## Features

- 🔥 **Trending Tokens** - See what's hot on Solana DEXes
- ✨ **New Pairs** - Discover newly created trading pairs
- 📈 **Top Gainers/Losers** - Track biggest movers
- 📊 **Price Charts** - Interactive candlestick charts
- 🔍 **Token Search** - Find any token by name or address
- 📱 **Mobile Responsive** - Works on all devices
- ⚡ **Real-time Updates** - Auto-refreshing data

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** TradingView Lightweight Charts
- **Data:** DexScreener API

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API

Data is fetched from the [DexScreener API](https://docs.dexscreener.com/api/reference):

- `/latest/dex/tokens/{address}` - Token pairs
- `/latest/dex/search?q={query}` - Search tokens
- `/latest/dex/pairs/solana/{pairAddress}` - Pair details

## Roadmap

- [ ] Real OHLC data from Birdeye API
- [ ] WebSocket for real-time price updates
- [x] Wallet connection (Phantom, Solflare)
- [x] Portfolio tracking
- [ ] Price alerts
- [x] Advanced filters (age, liquidity, volume)
- [ ] Token holder analysis
- [x] Rug pull detection

## License

MIT

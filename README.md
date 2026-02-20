# ApexScreener - Solana Token Screener

A real-time Solana memecoin and token screener with advanced analytics.

## Features

### Core Features
- 🔥 **Trending Tokens** - See what's hot on Solana DEXes
- ✨ **New Pairs** - Discover newly created trading pairs
- 📈 **Top Gainers/Losers** - Track biggest movers
- 📊 **Price Charts** - Interactive candlestick charts (TradingView Lightweight Charts)
- 🔍 **Token Search** - Find any token by name or address
- 📱 **Mobile Responsive** - Works on all devices
- ⚡ **Real-time Updates** - Auto-refreshing data

### Advanced Features
- 💼 **Wallet Connection** - Phantom, Solflare support
- 📂 **Portfolio Tracking** - Track your Solana holdings
- 🔔 **Price Alerts** - Browser notifications when prices hit targets
- 🎚️ **Advanced Filters** - Filter by age, liquidity, volume, and more
- 🛡️ **Rug Pull Detection** - Warning indicators for suspicious tokens
- ⌨️ **Keyboard Shortcuts** - Power user navigation
- ⭐ **Watchlist** - Save and export your favorite tokens

### Analytics (with Birdeye API)
- 👥 **Holder Analysis** - Top holders, concentration risk
- 📈 **OHLC Charts** - Real candlestick data
- 🔒 **Token Security** - Mint/freeze authority checks
- 📊 **Real-time WebSocket** - Live price streaming

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** TradingView Lightweight Charts
- **Wallet:** Solana Wallet Adapter
- **Database:** Supabase
- **Data:** DexScreener API + Birdeye API

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

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Required: Supabase (for auth & data persistence)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Required: NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Optional: Enhanced features (Birdeye)
NEXT_PUBLIC_BIRDEYE_API_KEY=your-birdeye-api-key

# Optional: Custom Solana RPC
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### Birdeye API

Get an API key from [birdeye.so](https://birdeye.so) to enable:
- Real-time WebSocket price updates
- OHLC candlestick data
- Holder statistics & top holders
- Token security analysis

## API Sources

**DexScreener API** (free, no key required):
- `/latest/dex/tokens/{address}` - Token pairs
- `/latest/dex/search?q={query}` - Search tokens
- `/latest/dex/pairs/solana/{pairAddress}` - Pair details
- `/token-boosts/top/v1` - Boosted tokens

**Birdeye API** (requires API key):
- `/defi/ohlcv` - OHLC candlestick data
- `/defi/token_holder_stat` - Holder statistics
- `/defi/token_holder` - Top holders list
- `/defi/token_security` - Security analysis
- WebSocket for real-time prices

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search |
| `1-5` | Quick filter presets |
| `w` | Toggle watchlist view |
| `p` | Toggle portfolio view |
| `a` | Toggle alerts view |
| `r` | Refresh data |
| `?` | Show shortcuts help |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── TokenTable.tsx      # Main token list
│   ├── Portfolio.tsx       # Portfolio view
│   ├── AlertsView.tsx      # Price alerts
│   ├── HolderAnalysis.tsx  # Holder statistics
│   └── ...
├── hooks/                  # Custom React hooks
│   ├── useAlerts.ts        # Price alerts logic
│   ├── usePortfolio.ts     # Portfolio data
│   ├── useRealtime.ts      # WebSocket/real-time
│   └── ...
├── lib/                    # API & utilities
│   ├── api.ts              # DexScreener API
│   ├── birdeye.ts          # Birdeye API
│   └── supabase.ts         # Supabase client
├── context/                # React context
└── types/                  # TypeScript types
```

## Roadmap

- [x] Wallet connection (Phantom, Solflare)
- [x] Portfolio tracking
- [x] Price alerts with notifications
- [x] Advanced filters (age, liquidity, volume)
- [x] Rug pull detection
- [x] Holder analysis component
- [x] Birdeye API integration (OHLC, holders)
- [x] Real-time WebSocket hook
- [ ] WebSocket real-time price streaming (needs Birdeye key)
- [ ] Token holder analysis page
- [ ] Trading integration (swap directly)
- [ ] Social sentiment analysis
- [ ] Multi-chain support

## License

MIT

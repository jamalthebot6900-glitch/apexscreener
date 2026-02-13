import { Token, PairData, OHLCData } from '@/types';

const DEX_SCREENER_BASE = 'https://api.dexscreener.com/latest/dex';
const DEX_SCREENER_BOOSTS = 'https://api.dexscreener.com/token-boosts/top/v1';
const DEX_SCREENER_PROFILES = 'https://api.dexscreener.com/token-profiles/latest/v1';

// Boosted token from the boosts API
interface BoostedToken {
  url: string;
  chainId: string;
  tokenAddress: string;
  description?: string;
  icon?: string;
  header?: string;
  links?: { type?: string; url: string; label?: string }[];
  totalAmount: number;
}

// Fetch top boosted tokens (tokens actively being promoted)
export async function fetchBoostedTokens(): Promise<Token[]> {
  try {
    const res = await fetch(DEX_SCREENER_BOOSTS, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch boosted tokens');
    
    const boostedTokens: BoostedToken[] = await res.json();
    
    // Filter to Solana only and get top 30
    const solanaTokens = boostedTokens
      .filter(t => t.chainId === 'solana')
      .slice(0, 30);
    
    if (solanaTokens.length === 0) return [];
    
    // Fetch full token data for each boosted token
    const tokenAddresses = solanaTokens.map(t => t.tokenAddress);
    const tokensWithData = await Promise.all(
      tokenAddresses.map(addr => fetchTokenByAddress(addr))
    );
    
    // Merge boost data with token data
    return tokensWithData
      .filter((t): t is Token => t !== null)
      .map((token, idx) => ({
        ...token,
        boosts: solanaTokens[idx]?.totalAmount || 0,
      }));
  } catch (error) {
    console.error('Error fetching boosted tokens:', error);
    return [];
  }
}

// Fetch latest token profiles (newly listed with profiles)
export async function fetchLatestProfiles(): Promise<Token[]> {
  try {
    const res = await fetch(`${DEX_SCREENER_PROFILES}?chainId=solana`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch latest profiles');
    
    const profiles = await res.json();
    const tokenAddresses = profiles
      .filter((p: any) => p.chainId === 'solana')
      .slice(0, 20)
      .map((p: any) => p.tokenAddress);
    
    if (tokenAddresses.length === 0) return [];
    
    const tokens = await Promise.all(
      tokenAddresses.map((addr: string) => fetchTokenByAddress(addr))
    );
    
    return tokens.filter((t): t is Token => t !== null);
  } catch (error) {
    console.error('Error fetching latest profiles:', error);
    return [];
  }
}

// Fetch token data by contract address
export async function fetchTokenByAddress(address: string): Promise<Token | null> {
  try {
    const res = await fetch(`${DEX_SCREENER_BASE}/tokens/${address}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    const solanaPairs = (data.pairs || []).filter((p: PairData) => p.chainId === 'solana');
    if (solanaPairs.length === 0) return null;
    
    // Get the pair with highest liquidity
    const bestPair = solanaPairs.reduce((best: PairData, current: PairData) => 
      (current.liquidity?.usd || 0) > (best.liquidity?.usd || 0) ? current : best
    );
    
    return parsePairToToken(bestPair);
  } catch (error) {
    console.error(`Error fetching token ${address}:`, error);
    return null;
  }
}

// Fetch multiple tokens by addresses
export async function fetchTokensByAddresses(addresses: string[]): Promise<Token[]> {
  const results = await Promise.all(
    addresses.map(addr => fetchTokenByAddress(addr))
  );
  return results.filter((token): token is Token => token !== null);
}

export async function fetchTrendingTokens(): Promise<Token[]> {
  try {
    const res = await fetch(`${DEX_SCREENER_BASE}/tokens/solana`, {
      next: { revalidate: 30 },
    });
    const data = await res.json();
    return parsePairsToTokens(data.pairs || []);
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    return [];
  }
}

export async function fetchNewPairs(): Promise<Token[]> {
  try {
    // DexScreener search for new Solana pairs
    const res = await fetch(
      `${DEX_SCREENER_BASE}/search?q=solana`,
      { next: { revalidate: 30 } }
    );
    const data = await res.json();
    const solanaPairs = (data.pairs || [])
      .filter((p: PairData) => p.chainId === 'solana')
      .sort((a: PairData, b: PairData) => b.pairCreatedAt - a.pairCreatedAt)
      .slice(0, 50);
    return parsePairsToTokens(solanaPairs);
  } catch (error) {
    console.error('Error fetching new pairs:', error);
    return [];
  }
}

export async function fetchTopGainers(): Promise<Token[]> {
  try {
    const tokens = await fetchTrendingTokens();
    return tokens
      .filter(t => t.priceChange24h > 0)
      .sort((a, b) => b.priceChange24h - a.priceChange24h)
      .slice(0, 20);
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    return [];
  }
}

export async function fetchTopLosers(): Promise<Token[]> {
  try {
    const tokens = await fetchTrendingTokens();
    return tokens
      .filter(t => t.priceChange24h < 0)
      .sort((a, b) => a.priceChange24h - b.priceChange24h)
      .slice(0, 20);
  } catch (error) {
    console.error('Error fetching top losers:', error);
    return [];
  }
}

export async function searchTokens(query: string): Promise<Token[]> {
  if (!query || query.length < 2) return [];
  try {
    const res = await fetch(`${DEX_SCREENER_BASE}/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    const solanaPairs = (data.pairs || []).filter((p: PairData) => p.chainId === 'solana');
    return parsePairsToTokens(solanaPairs);
  } catch (error) {
    console.error('Error searching tokens:', error);
    return [];
  }
}

export async function fetchTokenDetails(address: string): Promise<PairData | null> {
  try {
    const res = await fetch(`${DEX_SCREENER_BASE}/tokens/${address}`);
    const data = await res.json();
    const solanaPairs = (data.pairs || []).filter((p: PairData) => p.chainId === 'solana');
    return solanaPairs[0] || null;
  } catch (error) {
    console.error('Error fetching token details:', error);
    return null;
  }
}

export async function fetchPairDetails(pairAddress: string): Promise<PairData | null> {
  try {
    const res = await fetch(`${DEX_SCREENER_BASE}/pairs/solana/${pairAddress}`);
    const data = await res.json();
    return data.pair || null;
  } catch (error) {
    console.error('Error fetching pair details:', error);
    return null;
  }
}

// Mock OHLC data generator (DexScreener doesn't provide free OHLC API)
// In production, you'd use Birdeye or similar
export function generateMockOHLC(basePrice: number, count: number = 100): OHLCData[] {
  const data: OHLCData[] = [];
  let price = basePrice;
  const now = Math.floor(Date.now() / 1000);
  const interval = 300; // 5 min candles

  for (let i = count - 1; i >= 0; i--) {
    const volatility = 0.02 + Math.random() * 0.05;
    const change = (Math.random() - 0.48) * volatility;
    const open = price;
    price = price * (1 + change);
    const close = price;
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);

    data.push({
      time: now - i * interval,
      open,
      high,
      low,
      close,
    });
  }

  return data;
}

function parsePairToToken(pair: PairData): Token {
  const txns24h = pair.txns?.h24 || { buys: 0, sells: 0 };
  return {
    address: pair.baseToken.address,
    name: pair.baseToken.name,
    symbol: pair.baseToken.symbol,
    logo: pair.info?.imageUrl,
    priceUsd: parseFloat(pair.priceUsd) || 0,
    priceChange24h: pair.priceChange?.h24 || 0,
    priceChange6h: pair.priceChange?.h6 || 0,
    priceChange1h: pair.priceChange?.h1 || 0,
    priceChange5m: pair.priceChange?.m5 || 0,
    volume24h: pair.volume?.h24 || 0,
    liquidity: pair.liquidity?.usd || 0,
    fdv: pair.fdv || 0,
    marketCap: pair.marketCap || pair.fdv || 0,
    pairAddress: pair.pairAddress,
    pairCreatedAt: pair.pairCreatedAt || 0,
    txns24h: {
      buys: txns24h.buys || 0,
      sells: txns24h.sells || 0,
      total: (txns24h.buys || 0) + (txns24h.sells || 0),
    },
    makers: (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0), // Approximation
    boosts: pair.boosts?.active,
    dexId: pair.dexId,
    chainId: pair.chainId,
  };
}

function parsePairsToTokens(pairs: PairData[]): Token[] {
  return pairs.map((pair) => parsePairToToken(pair));
}

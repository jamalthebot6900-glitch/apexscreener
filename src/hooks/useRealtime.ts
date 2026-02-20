'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface PriceUpdate {
  address: string;
  priceUsd: number;
  priceChange5m: number;
  priceChange1h: number;
  volume: number;
  timestamp: number;
}

interface RealtimeState {
  prices: Map<string, PriceUpdate>;
  isConnected: boolean;
  error: string | null;
  lastUpdate: number | null;
}

const BIRDEYE_WS_URL = 'wss://public-api.birdeye.so/socket';

/**
 * Real-time price updates hook
 * Uses Birdeye WebSocket when API key is available, falls back to polling
 */
export function useRealtime(tokenAddresses: string[], enabled: boolean = true) {
  const [state, setState] = useState<RealtimeState>({
    prices: new Map(),
    isConnected: false,
    error: null,
    lastUpdate: null,
  });
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const addressesRef = useRef<string[]>(tokenAddresses);
  
  // Update addresses ref without reconnecting
  useEffect(() => {
    addressesRef.current = tokenAddresses;
  }, [tokenAddresses]);

  // Fetch prices via REST (fallback)
  const fetchPrices = useCallback(async () => {
    if (addressesRef.current.length === 0) return;
    
    try {
      const addresses = addressesRef.current.slice(0, 30).join(',');
      const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${addresses}`);
      if (!res.ok) throw new Error('Failed to fetch prices');
      
      const data = await res.json();
      const updates = new Map<string, PriceUpdate>();
      
      for (const pair of data.pairs || []) {
        if (pair.chainId !== 'solana') continue;
        
        const address = pair.baseToken?.address;
        if (!address) continue;
        
        updates.set(address, {
          address,
          priceUsd: parseFloat(pair.priceUsd) || 0,
          priceChange5m: pair.priceChange?.m5 || 0,
          priceChange1h: pair.priceChange?.h1 || 0,
          volume: pair.volume?.h24 || 0,
          timestamp: Date.now(),
        });
      }
      
      setState(prev => {
        const newPrices = new Map(prev.prices);
        updates.forEach((value, key) => newPrices.set(key, value));
        return {
          ...prev,
          prices: newPrices,
          lastUpdate: Date.now(),
          error: null,
        };
      });
    } catch (err) {
      console.error('Price fetch error:', err);
    }
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    // Check if Birdeye API key is available
    const apiKey = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
    
    if (!apiKey) {
      // Fall back to polling if no API key
      console.log('Birdeye API key not set, using polling fallback');
      fetchPrices();
      pollIntervalRef.current = setInterval(fetchPrices, 5000);
      return;
    }

    try {
      const ws = new WebSocket(`${BIRDEYE_WS_URL}?x-api-key=${apiKey}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Birdeye WebSocket connected');
        setState(prev => ({ ...prev, isConnected: true, error: null }));
        
        // Subscribe to price updates for tracked tokens
        if (addressesRef.current.length > 0) {
          ws.send(JSON.stringify({
            type: 'subscribe',
            data: {
              type: 'PRICE',
              chain: 'solana',
              addresses: addressesRef.current.slice(0, 100), // Limit to 100 tokens
            },
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'PRICE' && message.data) {
            const { address, priceUsd, priceChange5m, priceChange1h, volume } = message.data;
            
            setState(prev => {
              const newPrices = new Map(prev.prices);
              newPrices.set(address, {
                address,
                priceUsd,
                priceChange5m: priceChange5m || 0,
                priceChange1h: priceChange1h || 0,
                volume: volume || 0,
                timestamp: Date.now(),
              });
              
              return {
                ...prev,
                prices: newPrices,
                lastUpdate: Date.now(),
              };
            });
          }
        } catch (err) {
          console.error('WebSocket message parse error:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setState(prev => ({ ...prev, error: 'Connection error' }));
      };

      ws.onclose = () => {
        console.log('WebSocket closed, reconnecting...');
        setState(prev => ({ ...prev, isConnected: false }));
        
        // Reconnect after delay
        reconnectTimeoutRef.current = setTimeout(() => {
          if (enabled) connect();
        }, 3000);
      };
    } catch (err) {
      console.error('WebSocket connection error:', err);
      // Fall back to polling
      fetchPrices();
      pollIntervalRef.current = setInterval(fetchPrices, 5000);
    }
  }, [enabled, fetchPrices]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setState(prev => ({ ...prev, isConnected: false }));
  }, []);

  // Effect to manage connection
  useEffect(() => {
    if (enabled && tokenAddresses.length > 0) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  // Update subscriptions when addresses change
  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN && tokenAddresses.length > 0) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        data: {
          type: 'PRICE',
          chain: 'solana',
          addresses: tokenAddresses.slice(0, 100),
        },
      }));
    }
  }, [tokenAddresses]);

  // Get price for a specific token
  const getPrice = useCallback((address: string): PriceUpdate | undefined => {
    return state.prices.get(address);
  }, [state.prices]);

  return {
    ...state,
    getPrice,
    reconnect: connect,
    disconnect,
  };
}

'use client';

import { useState, useEffect } from 'react';
import { PriceAlert } from '@/hooks/useAlerts';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: {
    address: string;
    symbol: string;
    name: string;
    priceUsd: number;
  } | null;
  existingAlerts: PriceAlert[];
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  onRemoveAlert: (id: string) => void;
  notificationsEnabled: boolean;
  onEnableNotifications: () => Promise<boolean>;
}

export default function AlertModal({
  isOpen,
  onClose,
  token,
  existingAlerts,
  onAddAlert,
  onRemoveAlert,
  notificationsEnabled,
  onEnableNotifications,
}: AlertModalProps) {
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [targetPrice, setTargetPrice] = useState('');
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && token) {
      setTargetPrice('');
      setError('');
      // Default to 10% above/below current price
      const suggestedPrice = condition === 'above' 
        ? token.priceUsd * 1.1 
        : token.priceUsd * 0.9;
      setTargetPrice(suggestedPrice.toFixed(8));
    }
  }, [isOpen, token, condition]);

  if (!isOpen || !token) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price');
      return;
    }

    // Validate price makes sense
    if (condition === 'above' && price <= token.priceUsd) {
      setError('Target price must be above current price');
      return;
    }
    if (condition === 'below' && price >= token.priceUsd) {
      setError('Target price must be below current price');
      return;
    }

    onAddAlert({
      tokenAddress: token.address,
      tokenSymbol: token.symbol,
      tokenName: token.name,
      condition,
      targetPrice: price,
    });

    setTargetPrice('');
    // Don't close - let user add more alerts if needed
  };

  const formatPrice = (price: number) => {
    if (price < 0.00001) return price.toExponential(2);
    if (price < 0.01) return price.toFixed(8);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  };

  const percentChange = (target: number, current: number) => {
    const change = ((target - current) / current) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#1a1a1f] border border-[#333] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#333]">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-[#f7931a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Price Alert
            </h2>
            <p className="text-[13px] text-[#888] mt-0.5">{token.symbol} - ${formatPrice(token.priceUsd)}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-[#888] hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Notification permission banner */}
        {!notificationsEnabled && (
          <div className="mx-6 mt-4 p-3 bg-[#f7931a]/10 border border-[#f7931a]/20 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#f7931a] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div className="flex-1">
                <p className="text-[13px] text-[#f7931a] font-medium">Enable notifications</p>
                <p className="text-[12px] text-[#888] mt-0.5">Get browser alerts when prices hit your targets</p>
              </div>
              <button
                onClick={onEnableNotifications}
                className="px-3 py-1.5 bg-[#f7931a] text-black text-[12px] font-semibold rounded-lg hover:bg-[#f7931a]/80 transition-colors"
              >
                Enable
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Condition toggle */}
          <div>
            <label className="block text-[12px] text-[#888] uppercase tracking-wide mb-2">Alert when price goes</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCondition('above')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                  condition === 'above'
                    ? 'bg-[#00d395] text-black'
                    : 'bg-[#1e222d] text-[#888] hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Above
              </button>
              <button
                type="button"
                onClick={() => setCondition('below')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                  condition === 'below'
                    ? 'bg-[#ff6b6b] text-white'
                    : 'bg-[#1e222d] text-[#888] hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Below
              </button>
            </div>
          </div>

          {/* Target price */}
          <div>
            <label className="block text-[12px] text-[#888] uppercase tracking-wide mb-2">Target Price (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]">$</span>
              <input
                type="text"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="0.00000000"
                className="w-full bg-[#16161a] border border-[#2a2a30] rounded-lg pl-7 pr-20 py-2.5 text-white text-[14px] font-mono focus:outline-none focus:border-[#9455ff] transition-colors"
              />
              {targetPrice && !isNaN(parseFloat(targetPrice)) && (
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium ${
                  parseFloat(targetPrice) > token.priceUsd ? 'text-[#00d395]' : 'text-[#ff6b6b]'
                }`}>
                  {percentChange(parseFloat(targetPrice), token.priceUsd)}
                </span>
              )}
            </div>
            {error && (
              <p className="text-[12px] text-[#ff6b6b] mt-1.5">{error}</p>
            )}
          </div>

          {/* Quick set buttons */}
          <div className="flex gap-2">
            {condition === 'above' ? (
              <>
                {[10, 25, 50, 100].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setTargetPrice((token.priceUsd * (1 + pct/100)).toFixed(8))}
                    className="flex-1 py-1.5 bg-[#1e222d] hover:bg-[#252830] rounded text-[11px] text-[#888] hover:text-white transition-colors"
                  >
                    +{pct}%
                  </button>
                ))}
              </>
            ) : (
              <>
                {[10, 25, 50, 75].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setTargetPrice((token.priceUsd * (1 - pct/100)).toFixed(8))}
                    className="flex-1 py-1.5 bg-[#1e222d] hover:bg-[#252830] rounded text-[11px] text-[#888] hover:text-white transition-colors"
                  >
                    -{pct}%
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#9455ff] to-[#7c3aed] text-white font-semibold rounded-lg hover:from-[#a066ff] hover:to-[#8b5cf6] transition-all shadow-lg shadow-[#9455ff]/20"
          >
            Create Alert
          </button>
        </form>

        {/* Existing alerts for this token */}
        {existingAlerts.length > 0 && (
          <div className="border-t border-[#333]">
            <div className="px-6 py-3 bg-[#16161a]">
              <h3 className="text-[12px] text-[#888] uppercase tracking-wide">Active Alerts ({existingAlerts.length})</h3>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {existingAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className="flex items-center justify-between px-6 py-2.5 border-t border-[#2a2a30] first:border-t-0"
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-[12px] font-medium ${
                      alert.condition === 'above' ? 'text-[#00d395]' : 'text-[#ff6b6b]'
                    }`}>
                      {alert.condition === 'above' ? '↑' : '↓'} ${formatPrice(alert.targetPrice)}
                    </span>
                    <span className="text-[11px] text-[#666]">
                      ({percentChange(alert.targetPrice, token.priceUsd)})
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveAlert(alert.id)}
                    className="p-1 text-[#666] hover:text-[#ff6b6b] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

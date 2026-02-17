'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useCallback, useMemo, useState, useRef, useEffect } from 'react';

export default function WalletButton() {
  const { publicKey, wallet, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  
  const truncatedAddress = useMemo(() => {
    if (!base58) return null;
    return `${base58.slice(0, 4)}...${base58.slice(-4)}`;
  }, [base58]);

  const copyAddress = useCallback(async () => {
    if (base58) {
      await navigator.clipboard.writeText(base58);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [base58]);

  const handleConnect = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setShowDropdown(false);
  }, [disconnect]);

  // Not connected - show connect button
  if (!wallet || !publicKey) {
    return (
      <button
        onClick={handleConnect}
        disabled={connecting}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-semibold bg-gradient-to-r from-[#9455ff] to-[#7c3aed] text-white hover:from-[#a066ff] hover:to-[#8b5cf6] transition-all shadow-lg shadow-[#9455ff]/20 disabled:opacity-50"
      >
        {connecting ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Connect</span>
          </>
        )}
      </button>
    );
  }

  // Connected - show wallet info
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-semibold bg-[#1e222d] text-white hover:bg-[#252830] transition-all border border-[#333]"
      >
        {wallet.adapter.icon && (
          <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="w-4 h-4 rounded" />
        )}
        <span className="font-mono">{truncatedAddress}</span>
        <svg className={`w-3 h-3 text-[#888] transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1f] rounded-xl border border-[#333] shadow-xl overflow-hidden z-50">
          {/* Wallet info */}
          <div className="px-4 py-3 border-b border-[#333]">
            <div className="flex items-center gap-2 mb-1">
              {wallet.adapter.icon && (
                <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="w-5 h-5 rounded" />
              )}
              <span className="text-[13px] font-semibold text-white">{wallet.adapter.name}</span>
            </div>
            <div className="text-[11px] text-[#888] font-mono">{base58}</div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={copyAddress}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#ccc] hover:bg-[#252528] rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-[#00d395]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#00d395]">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy Address</span>
                </>
              )}
            </button>

            <a
              href={`https://solscan.io/account/${base58}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#ccc] hover:bg-[#252528] rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>View on Solscan</span>
            </a>

            <button
              onClick={handleConnect}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#ccc] hover:bg-[#252528] rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Change Wallet</span>
            </button>

            <div className="border-t border-[#333] mt-2 pt-2">
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#ff6b6b] hover:bg-[#ff6b6b]/10 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

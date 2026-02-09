'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { supabase, getOrCreateUser, createTokenClaim, uploadTokenImage, updateTokenProfile } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface ClaimTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
}

export function ClaimTokenModal({ isOpen, onClose, tokenAddress, tokenName, tokenSymbol }: ClaimTokenModalProps) {
  const { publicKey, signMessage, connected } = useWallet();
  const [step, setStep] = useState<'connect' | 'sign' | 'details' | 'uploading' | 'success'>('connect');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [discord, setDiscord] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const handleSign = useCallback(async () => {
    if (!publicKey || !signMessage) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Create message to sign
      const message = `Claim token ${tokenAddress} for Apexscreener\n\nWallet: ${publicKey.toBase58()}\nTimestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      // Request signature
      const signature = await signMessage(encodedMessage);
      const signatureBase64 = Buffer.from(signature).toString('base64');
      
      // Get or create user
      const user = await getOrCreateUser(publicKey.toBase58());
      
      // Create claim
      await createTokenClaim(tokenAddress, user.id, signatureBase64);
      
      setStep('details');
    } catch (err: any) {
      setError(err.message || 'Failed to sign message');
    } finally {
      setLoading(false);
    }
  }, [publicKey, signMessage, tokenAddress]);

  const handleSubmit = useCallback(async () => {
    if (!publicKey) return;
    
    setLoading(true);
    setStep('uploading');
    setError(null);
    
    try {
      let logoUrl: string | undefined;
      let bannerUrl: string | undefined;
      
      // Upload logo if provided
      if (logoFile) {
        const url = await uploadTokenImage(tokenAddress, logoFile, 'logo');
        if (url) logoUrl = url;
      }
      
      // Upload banner if provided
      if (bannerFile) {
        const url = await uploadTokenImage(tokenAddress, bannerFile, 'banner');
        if (url) bannerUrl = url;
      }
      
      // Update token profile
      await updateTokenProfile(tokenAddress, {
        name: tokenName,
        symbol: tokenSymbol,
        description: description || undefined,
        website: website || undefined,
        twitter: twitter || undefined,
        telegram: telegram || undefined,
        discord: discord || undefined,
        logo_url: logoUrl,
        banner_url: bannerUrl,
      });
      
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      setStep('details');
    } finally {
      setLoading(false);
    }
  }, [publicKey, tokenAddress, tokenName, tokenSymbol, description, website, twitter, telegram, discord, logoFile, bannerFile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold">Claim {tokenSymbol}</h2>
            <p className="text-sm text-text-dimmed mt-1">Manage your token's profile on Apexscreener</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-light rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-negative/10 border border-negative/20 rounded-lg text-negative text-sm">
              {error}
            </div>
          )}

          {/* Step: Connect Wallet */}
          {step === 'connect' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Connect Your Wallet</h3>
                <p className="text-sm text-text-dimmed mt-1">
                  Connect the wallet that deployed {tokenSymbol} to claim ownership
                </p>
              </div>
              <div className="flex justify-center">
                <WalletMultiButton />
              </div>
              {connected && (
                <button
                  onClick={() => setStep('sign')}
                  className="w-full py-3 bg-accent text-black font-semibold rounded-xl hover:bg-accent/90 transition-colors"
                >
                  Continue
                </button>
              )}
            </div>
          )}

          {/* Step: Sign Message */}
          {step === 'sign' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Sign to Verify</h3>
                <p className="text-sm text-text-dimmed mt-1">
                  Sign a message to prove wallet ownership. This doesn't cost any SOL.
                </p>
              </div>
              <button
                onClick={handleSign}
                disabled={loading}
                className={cn(
                  "w-full py-3 font-semibold rounded-xl transition-colors",
                  loading 
                    ? "bg-surface-light text-text-dimmed cursor-not-allowed"
                    : "bg-accent text-black hover:bg-accent/90"
                )}
              >
                {loading ? 'Signing...' : 'Sign Message'}
              </button>
            </div>
          )}

          {/* Step: Token Details */}
          {step === 'details' && (
            <div className="space-y-4">
              <h3 className="font-semibold">Token Details</h3>
              
              {/* Logo Upload */}
              <div>
                <label className="block text-sm text-text-dimmed mb-2">Logo (400x400 recommended)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-surface-light file:text-text-primary hover:file:bg-border"
                />
              </div>
              
              {/* Banner Upload */}
              <div>
                <label className="block text-sm text-text-dimmed mb-2">Banner (1200x400 recommended)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-surface-light file:text-text-primary hover:file:bg-border"
                />
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm text-text-dimmed mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about your token..."
                  className="w-full px-4 py-3 bg-surface-light border border-border rounded-xl focus:border-accent focus:outline-none resize-none"
                  rows={3}
                />
              </div>
              
              {/* Social Links */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-text-dimmed mb-2">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://"
                    className="w-full px-4 py-2.5 bg-surface-light border border-border rounded-xl focus:border-accent focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-dimmed mb-2">Twitter</label>
                  <input
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/..."
                    className="w-full px-4 py-2.5 bg-surface-light border border-border rounded-xl focus:border-accent focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-dimmed mb-2">Telegram</label>
                  <input
                    type="url"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="https://t.me/..."
                    className="w-full px-4 py-2.5 bg-surface-light border border-border rounded-xl focus:border-accent focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-dimmed mb-2">Discord</label>
                  <input
                    type="url"
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    placeholder="https://discord.gg/..."
                    className="w-full px-4 py-2.5 bg-surface-light border border-border rounded-xl focus:border-accent focus:outline-none text-sm"
                  />
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-accent text-black font-semibold rounded-xl hover:bg-accent/90 transition-colors"
              >
                Submit Claim
              </button>
            </div>
          )}

          {/* Step: Uploading */}
          {step === 'uploading' && (
            <div className="text-center space-y-4 py-8">
              <div className="w-12 h-12 mx-auto border-4 border-accent border-t-transparent rounded-full animate-spin" />
              <p className="text-text-dimmed">Uploading your token profile...</p>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-positive/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-positive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Claim Submitted!</h3>
                <p className="text-sm text-text-dimmed mt-1">
                  Your token profile has been submitted for review. We'll notify you once approved.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-surface-light font-semibold rounded-xl hover:bg-border transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClaimTokenModal;

import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Suspense } from 'react';
import { AppProvider } from '@/context/AppContext';
import AuthSessionProvider from '@/providers/SessionProvider';
import WalletProvider from '@/providers/WalletProvider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Apexscreener - Solana Token Screener',
  description: 'The apex of token screening. Track trending Solana tokens, discover new pairs, and find opportunities in real-time.',
  keywords: ['Solana', 'token screener', 'DexScreener', 'crypto', 'memecoin', 'trading'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-background text-text-primary min-h-screen flex flex-col antialiased">
        <AuthSessionProvider>
          <WalletProvider>
            <AppProvider>
              <Header />
              <div className="flex flex-1">
                <Suspense fallback={<div className="w-[200px] shrink-0 hidden lg:block" />}>
                  <Sidebar />
                </Suspense>
                <main className="flex-1 min-h-[calc(100vh-56px)] overflow-x-hidden w-full lg:w-auto flex flex-col">
                  <div className="flex-1">
                    {children}
                  </div>
                  <Footer />
                </main>
              </div>
            </AppProvider>
          </WalletProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

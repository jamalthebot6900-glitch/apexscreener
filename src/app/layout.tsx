import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Suspense } from 'react';
import { AppProvider } from '@/context/AppContext';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en">
      <body className={`${inter.className} bg-background text-text-primary min-h-screen`}>
        <AppProvider>
          <Header />
          <div className="flex">
            <Suspense fallback={<div className="w-[220px] shrink-0 hidden lg:block" />}>
              <Sidebar />
            </Suspense>
            <main className="flex-1 min-h-[calc(100vh-56px)] overflow-x-hidden w-full lg:w-auto">
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}

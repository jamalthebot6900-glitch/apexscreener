import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core backgrounds - DexScreener-like dark theme
        background: '#0a0a0a',
        surface: '#0f0f0f',
        'surface-light': '#141414',
        'surface-hover': '#1a1a1a',
        'surface-elevated': '#1f1f1f',
        
        // Borders
        border: '#1a1a1a',
        'border-light': '#262626',
        'border-subtle': '#151515',
        
        // Text hierarchy
        'text-primary': '#f5f5f5',
        'text-secondary': '#a1a1a1',
        'text-muted': '#6b6b6b',
        'text-dimmed': '#4a4a4a',
        
        // Accent - Solana-inspired
        accent: '#14F195',
        'accent-hover': '#10d884',
        'accent-muted': '#0ea570',
        
        // Semantic colors
        positive: '#00c853',
        'positive-muted': '#00a844',
        'positive-bg': 'rgba(0, 200, 83, 0.08)',
        
        negative: '#ff3b3b',
        'negative-muted': '#e53535',
        'negative-bg': 'rgba(255, 59, 59, 0.08)',
        
        warning: '#ffb300',
        'warning-muted': '#e6a200',
        
        // Brand
        brand: {
          purple: '#9945FF',
          teal: '#14F195',
          blue: '#03E1FF',
        },
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        '3xs': ['0.5625rem', { lineHeight: '0.75rem' }],
      },
      spacing: {
        '0.5': '2px',
        '1.5': '6px',
        '2.5': '10px',
        '3.5': '14px',
        '4.5': '18px',
        '18': '72px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-4px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 16px -4px rgba(0, 200, 83, 0.3)',
        'glow-red': '0 0 16px -4px rgba(255, 59, 59, 0.3)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'elevated': '0 4px 12px -2px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'sm': '3px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
    },
  },
  plugins: [],
}
export default config

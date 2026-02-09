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
        // Core backgrounds - deep, rich blacks
        background: '#09090b',
        surface: '#0c0c0e',
        'surface-light': '#111114',
        'surface-hover': '#16161a',
        'surface-elevated': '#1a1a1f',
        
        // Borders - subtle and refined
        border: '#1c1c21',
        'border-light': '#27272e',
        'border-subtle': '#18181c',
        
        // Text hierarchy
        'text-primary': '#fafafa',
        'text-secondary': '#a1a1aa',
        'text-muted': '#63636e',
        'text-dimmed': '#4a4a54',
        
        // Accent colors (Solana-inspired teal)
        accent: '#14F195',
        'accent-hover': '#10d884',
        'accent-muted': '#0ea570',
        
        // Semantic colors - refined, not too bright
        positive: '#10b981',
        'positive-muted': '#059669',
        'positive-bg': 'rgba(16, 185, 129, 0.08)',
        
        negative: '#ef4444',
        'negative-muted': '#dc2626',
        'negative-bg': 'rgba(239, 68, 68, 0.08)',
        
        warning: '#f59e0b',
        'warning-muted': '#d97706',
        
        // Brand accent (Solana-inspired)
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
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'number-pop': 'numberPop 0.3s ease-out',
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
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        numberPop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'glow-red': '0 0 20px -5px rgba(239, 68, 68, 0.3)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'elevated': '0 4px 12px -2px rgba(0, 0, 0, 0.4)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
      },
    },
  },
  plugins: [],
}
export default config

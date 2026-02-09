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
        // Core backgrounds - Pure black premium
        background: '#000000',
        surface: '#050505',
        'surface-light': '#0a0a0a',
        'surface-hover': '#0f0f0f',
        'surface-elevated': '#111111',
        
        // Borders - Subtle, refined
        border: '#151515',
        'border-light': '#1a1a1a',
        'border-subtle': '#0d0d0d',
        'border-glow': 'rgba(255, 255, 255, 0.06)',
        
        // Text hierarchy - High contrast whites
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        'text-muted': '#606060',
        'text-dimmed': '#383838',
        
        // Accent - Faint warm orange glow
        accent: '#ff6b35',
        'accent-hover': '#ff8255',
        'accent-muted': '#cc5529',
        'accent-glow': 'rgba(255, 107, 53, 0.15)',
        
        // Secondary accent - Pure white for CTAs
        'accent-white': '#ffffff',
        'accent-white-hover': '#f0f0f0',
        
        // Semantic colors - Refined
        positive: '#00d47e',
        'positive-muted': '#00b569',
        'positive-bg': 'rgba(0, 212, 126, 0.08)',
        'positive-glow': 'rgba(0, 212, 126, 0.2)',
        
        negative: '#ff4757',
        'negative-muted': '#e8414f',
        'negative-bg': 'rgba(255, 71, 87, 0.08)',
        'negative-glow': 'rgba(255, 71, 87, 0.2)',
        
        warning: '#ffa726',
        'warning-muted': '#fb8c00',
        
        // Premium gradient colors
        gradient: {
          orange: '#ff6b35',
          peach: '#ff8a5c',
          warm: '#ffb088',
          cream: '#ffd4c2',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'SF Mono', 'Monaco', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        '3xs': ['0.5625rem', { lineHeight: '0.75rem' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-sm': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
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
        'gradient-flow': 'gradientFlow 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
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
        gradientFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(255, 255, 255, 0.1)',
        'glow-orange': '0 0 30px -5px rgba(255, 107, 53, 0.25)',
        'glow-white': '0 0 20px -5px rgba(255, 255, 255, 0.15)',
        'glow-green': '0 0 20px -5px rgba(0, 212, 126, 0.3)',
        'glow-red': '0 0 20px -5px rgba(255, 71, 87, 0.3)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        'elevated': '0 8px 32px -8px rgba(0, 0, 0, 0.8)',
        'premium': '0 4px 24px -4px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03)',
        'btn-glow': '0 0 16px -2px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '14px',
        '2xl': '18px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-premium': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-glow': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
export default config

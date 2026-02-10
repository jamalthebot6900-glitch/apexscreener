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
        // Core backgrounds - Dark with better contrast
        background: '#0c0c0e',
        surface: '#121214',
        'surface-light': '#18181b',
        'surface-hover': '#1e1e22',
        'surface-elevated': '#242428',
        
        // Borders - More visible
        border: '#27272a',
        'border-light': '#303036',
        'border-subtle': '#1c1c20',
        'border-glow': 'rgba(255, 255, 255, 0.12)',
        
        // Text hierarchy - Bright and crisp
        'text-primary': '#ffffff',
        'text-secondary': '#b4b4b8',
        'text-muted': '#8c8c94',
        'text-dimmed': '#52525a',
        
        // Accent - Vibrant electric orange
        accent: '#ff7849',
        'accent-hover': '#ff9264',
        'accent-muted': '#e5693f',
        'accent-glow': 'rgba(255, 120, 73, 0.25)',
        
        // Secondary accent - Bright white
        'accent-white': '#ffffff',
        'accent-white-hover': '#f4f4f5',
        
        // Semantic colors - Vibrant neon
        positive: '#00e88c',
        'positive-muted': '#00cc7a',
        'positive-bg': 'rgba(0, 232, 140, 0.12)',
        'positive-glow': 'rgba(0, 232, 140, 0.35)',
        
        negative: '#ff5a6a',
        'negative-muted': '#f04858',
        'negative-bg': 'rgba(255, 90, 106, 0.12)',
        'negative-glow': 'rgba(255, 90, 106, 0.35)',
        
        warning: '#ffb940',
        'warning-muted': '#ffa420',
        
        // Vibrant gradient colors
        gradient: {
          orange: '#ff7849',
          peach: '#ff9a70',
          warm: '#ffc4a8',
          cream: '#ffe4d4',
        },
        
        // Additional bright colors
        electric: {
          blue: '#3b82f6',
          purple: '#a855f7',
          cyan: '#06b6d4',
          pink: '#ec4899',
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
        'glow': '0 0 24px -4px rgba(255, 255, 255, 0.18)',
        'glow-orange': '0 0 40px -6px rgba(255, 120, 73, 0.45)',
        'glow-white': '0 0 28px -4px rgba(255, 255, 255, 0.25)',
        'glow-green': '0 0 32px -4px rgba(0, 232, 140, 0.45)',
        'glow-red': '0 0 32px -4px rgba(255, 90, 106, 0.45)',
        'subtle': '0 2px 4px 0 rgba(0, 0, 0, 0.4)',
        'elevated': '0 12px 40px -10px rgba(0, 0, 0, 0.7)',
        'premium': '0 6px 32px -6px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'btn-glow': '0 0 24px -2px rgba(255, 255, 255, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'card-glow': '0 0 48px -12px rgba(255, 120, 73, 0.2)',
        'neon-green': '0 0 20px rgba(0, 232, 140, 0.5), 0 0 40px rgba(0, 232, 140, 0.3)',
        'neon-red': '0 0 20px rgba(255, 90, 106, 0.5), 0 0 40px rgba(255, 90, 106, 0.3)',
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

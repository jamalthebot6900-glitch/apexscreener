'use client';

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div className="absolute inset-0 blur-lg bg-gradient-to-r from-violet-500/40 via-fuchsia-500/40 to-cyan-500/40 rounded-full" />
      
      {/* Main logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative shrink-0"
      >
        {/* Background glow circle */}
        <defs>
          <linearGradient id="apex-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#D946EF" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <filter id="apex-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Outer ring */}
        <circle cx="24" cy="24" r="22" stroke="url(#apex-gradient)" strokeWidth="2" fill="none" opacity="0.3" />
        
        {/* Apex peak shape */}
        <path
          d="M24 8L10 36h28L24 8z"
          stroke="url(#apex-gradient)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          fill="none"
          filter="url(#apex-glow)"
        />
        
        {/* Inner peak */}
        <path
          d="M24 16L16 32h16L24 16z"
          fill="url(#apex-gradient)"
          opacity="0.3"
        />
        
        {/* Center highlight */}
        <path
          d="M24 20L20 28h8L24 20z"
          fill="white"
          opacity="0.8"
        />
        
        {/* Horizontal line through apex */}
        <line x1="14" y1="28" x2="34" y2="28" stroke="url(#apex-gradient)" strokeWidth="1.5" opacity="0.5" />
      </svg>
    </div>
  );
}

export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="apex-mark-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#D946EF" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      
      {/* Simple apex peak */}
      <path
        d="M16 4L4 26h24L16 4z"
        stroke="url(#apex-mark-gradient)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M16 10L10 22h12L16 10z"
        fill="url(#apex-mark-gradient)"
        opacity="0.4"
      />
      <path
        d="M16 14L12 20h8L16 14z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );
}

export function LogoFull({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark size={28} />
      <div className="flex flex-col">
        <span className="text-[15px] font-bold tracking-tight">
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            APEX
          </span>
          <span className="text-white/90">SCREENER</span>
        </span>
        <span className="text-[9px] text-white/40 font-medium tracking-widest uppercase -mt-0.5">
          Token Analytics
        </span>
      </div>
    </div>
  );
}

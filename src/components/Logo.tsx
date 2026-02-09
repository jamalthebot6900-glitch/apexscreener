'use client';

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Predator (Yautja) Bio-Mask with Dreadlocks - Iconic silhouette */}
      
      {/* Dreadlocks - left side (flowing down) */}
      <path
        d="M9 26C8.5 30 8 34 8.5 38C9 41 9.5 45 9.5 45"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 25C11 29 10 33 10.5 37C11 40 11.5 45 11.5 45"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M15 24C14 28 13 32 13.5 36C14 39 14.5 45 14.5 45"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M18 24C17 27 16.5 31 17 35C17.5 38 18 44 18 44"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Dreadlocks - right side (flowing down) */}
      <path
        d="M39 26C39.5 30 40 34 39.5 38C39 41 38.5 45 38.5 45"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M36 25C37 29 38 33 37.5 37C37 40 36.5 45 36.5 45"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M33 24C34 28 35 32 34.5 36C34 39 33.5 45 33.5 45"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M30 24C31 27 31.5 31 31 35C30.5 38 30 44 30 44"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Main head/mask outline - distinct angular bio-mask shape */}
      <path
        d="M24 3C19 3 14 6 12 11C10.5 15 10.5 19 12 23C13 25.5 15 27 18 28C21 29 24 29 24 29C24 29 27 29 30 28C33 27 35 25.5 36 23C37.5 19 37.5 15 36 11C34 6 29 3 24 3Z"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
      />
      
      {/* Crown ridge - distinctive forehead crest */}
      <path
        d="M14 9C17 6 20 5 24 5C28 5 31 6 34 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Bio-mask eye sockets - angular, menacing */}
      <path
        d="M14 14C14 14 16 13 18 14C20 15 20 17 19 18C18 19 16 19 15 18C13 17 13 15 14 14Z"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M34 14C34 14 32 13 30 14C28 15 28 17 29 18C30 19 32 19 33 18C35 17 35 15 34 14Z"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Center face ridge */}
      <path
        d="M24 11V18"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Lower mandible area - the iconic Predator jaw */}
      <path
        d="M17 22C19 24 21 25 24 25C27 25 29 24 31 22"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M19 21L21 23M29 21L27 23"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
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
      {/* Simplified Predator mark - just the mask face */}
      <path
        d="M16 2C12 2 8 5 7 9C6 12 6 15 7 18C8 20 10 22 13 23C15 24 16 24 16 24C16 24 17 24 19 23C22 22 24 20 25 18C26 15 26 12 25 9C24 5 20 2 16 2Z"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      {/* Eyes */}
      <ellipse cx="11" cy="12" rx="2.5" ry="2" stroke="white" strokeWidth="1.5" fill="none" />
      <ellipse cx="21" cy="12" rx="2.5" ry="2" stroke="white" strokeWidth="1.5" fill="none" />
      {/* Center ridge */}
      <path d="M16 7V13" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      {/* Mouth */}
      <path d="M11 18C13 20 16 20.5 16 20.5C16 20.5 19 20 21 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

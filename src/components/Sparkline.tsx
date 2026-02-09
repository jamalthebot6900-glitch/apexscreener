'use client';

import { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: 'positive' | 'negative' | 'auto';
  strokeWidth?: number;
  className?: string;
}

export default function Sparkline({ 
  data, 
  width = 80, 
  height = 24, 
  color = 'auto',
  strokeWidth = 1.5,
  className = ''
}: SparklineProps) {
  const { path, gradientId, strokeColor, fillColor } = useMemo(() => {
    if (!data || data.length < 2) {
      return { path: '', gradientId: '', strokeColor: '#6b7280', fillColor: 'transparent' };
    }

    const id = `sparkline-${Math.random().toString(36).substr(2, 9)}`;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    // Normalize data to fit in height
    const padding = 4;
    const normalizedData = data.map(
      (val) => height - padding - ((val - min) / range) * (height - padding * 2)
    );
    
    // Create SVG path
    const stepX = (width - padding * 2) / (data.length - 1);
    const points = normalizedData.map((y, i) => `${padding + i * stepX},${y}`);
    
    // Line path
    const linePath = `M${points.join(' L')}`;
    
    // Area path (for gradient fill)
    const areaPath = `${linePath} L${width - padding},${height - padding} L${padding},${height - padding} Z`;
    
    // Determine color based on first vs last value
    const trend = data[data.length - 1] >= data[0] ? 'positive' : 'negative';
    const actualColor = color === 'auto' ? trend : color;
    
    return {
      path: linePath,
      areaPath,
      gradientId: id,
      strokeColor: actualColor === 'positive' ? '#10b981' : '#ef4444',
      fillColor: actualColor === 'positive' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    };
  }, [data, width, height, color]);

  if (!data || data.length < 2) {
    return (
      <div 
        className={`flex items-center justify-center text-text-dimmed ${className}`}
        style={{ width, height }}
      >
        <span className="text-[9px]">—</span>
      </div>
    );
  }

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Filled area under the line */}
      <path
        d={`${path} L${width - 4},${height - 4} L4,${height - 4} Z`}
        fill={`url(#${gradientId})`}
      />
      
      {/* Main line */}
      <path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* End point dot */}
      {data.length > 0 && (
        <circle
          cx={width - 4}
          cy={height - 4 - ((data[data.length - 1] - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * (height - 8)}
          r={2}
          fill={strokeColor}
        />
      )}
    </svg>
  );
}

// Generate mock sparkline data based on price changes
export function generateSparklineData(
  priceChange5m: number,
  priceChange1h: number, 
  priceChange6h: number,
  priceChange24h: number,
  points: number = 12
): number[] {
  // Create a rough price history from the changes we have
  // This is an approximation since we don't have actual historical data
  const data: number[] = [];
  const basePrice = 100;
  
  // Work backwards from current price
  const currentPrice = basePrice;
  const price24hAgo = currentPrice / (1 + priceChange24h / 100);
  const price6hAgo = currentPrice / (1 + priceChange6h / 100);
  const price1hAgo = currentPrice / (1 + priceChange1h / 100);
  const price5mAgo = currentPrice / (1 + priceChange5m / 100);
  
  // Interpolate between these points
  const keyPoints = [
    { time: 0, price: price24hAgo },
    { time: 0.25, price: (price24hAgo + price6hAgo) / 2 },
    { time: 0.75, price: price6hAgo },
    { time: 0.96, price: price1hAgo },
    { time: 0.996, price: price5mAgo },
    { time: 1, price: currentPrice },
  ];
  
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    
    // Find the two keypoints we're between
    let lower = keyPoints[0];
    let upper = keyPoints[keyPoints.length - 1];
    
    for (let j = 0; j < keyPoints.length - 1; j++) {
      if (t >= keyPoints[j].time && t <= keyPoints[j + 1].time) {
        lower = keyPoints[j];
        upper = keyPoints[j + 1];
        break;
      }
    }
    
    // Interpolate
    const localT = (t - lower.time) / (upper.time - lower.time || 1);
    const price = lower.price + (upper.price - lower.price) * localT;
    
    // Add some noise
    const noise = (Math.random() - 0.5) * 0.5;
    data.push(price * (1 + noise / 100));
  }
  
  return data;
}

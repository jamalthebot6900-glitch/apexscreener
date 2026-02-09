'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, CandlestickData, Time } from 'lightweight-charts';
import { OHLCData, TimeFrame } from '@/types';

interface PriceChartProps {
  data: OHLCData[];
  height?: number;
}

const timeFrames: { label: string; value: TimeFrame }[] = [
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' },
];

export default function PriceChart({ data, height = 400 }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>('5m');

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0a0a0a' },
        textColor: '#71717a',
      },
      grid: {
        vertLines: { color: '#1f1f1f' },
        horzLines: { color: '#1f1f1f' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#ffffff',
          width: 1,
          style: 2,
          labelBackgroundColor: '#ffffff',
        },
        horzLine: {
          color: '#ffffff',
          width: 1,
          style: 2,
          labelBackgroundColor: '#ffffff',
        },
      },
      rightPriceScale: {
        borderColor: '#1f1f1f',
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: '#1f1f1f',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: { vertTouchDrag: false },
    });

    chartRef.current = chart;

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    const chartData: CandlestickData<Time>[] = data.map((d) => ({
      time: d.time as Time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    candleSeries.setData(chartData);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex gap-1">
          {timeFrames.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setActiveTimeFrame(tf.value)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeTimeFrame === tf.value
                  ? 'bg-white text-black'
                  : 'text-text-muted hover:text-text-secondary hover:bg-surface-light'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
        <div className="text-2xs text-text-muted">
          Chart data simulated
        </div>
      </div>
      <div ref={chartContainerRef} style={{ height }} />
    </div>
  );
}

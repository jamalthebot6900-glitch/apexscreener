'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

interface DropdownOption {
  label: string;
  value: number | null;
}

const liquidityOptions: DropdownOption[] = [
  { label: 'Any', value: null },
  { label: '$1K+', value: 1000 },
  { label: '$10K+', value: 10000 },
  { label: '$50K+', value: 50000 },
  { label: '$100K+', value: 100000 },
  { label: '$500K+', value: 500000 },
  { label: '$1M+', value: 1000000 },
];

const volumeOptions: DropdownOption[] = [
  { label: 'Any', value: null },
  { label: '$1K+', value: 1000 },
  { label: '$10K+', value: 10000 },
  { label: '$50K+', value: 50000 },
  { label: '$100K+', value: 100000 },
  { label: '$500K+', value: 500000 },
];

const ageOptions: DropdownOption[] = [
  { label: 'Any Age', value: null },
  { label: '< 1 hour', value: 1 },
  { label: '< 6 hours', value: 6 },
  { label: '< 24 hours', value: 24 },
  { label: '< 7 days', value: 168 },
  { label: '< 30 days', value: 720 },
];

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: DropdownOption[];
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value) || options[0];
  const hasValue = value !== null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all',
          'border min-w-[120px] justify-between',
          hasValue
            ? 'bg-accent/10 border-accent/30 text-accent'
            : 'bg-surface-light border-border text-text-secondary hover:border-border-light hover:text-text-primary'
        )}
      >
        <span className="text-text-muted text-[10px] uppercase tracking-wider mr-1">{label}:</span>
        <span>{selectedOption.label}</span>
        <svg
          className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[140px] bg-surface-light border border-border rounded-lg shadow-xl z-50 py-1 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.label}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                'w-full px-3 py-2 text-left text-xs font-medium transition-colors',
                option.value === value
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilterDropdowns() {
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useApp();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterDropdown
        label="Liq"
        options={liquidityOptions}
        value={filters.minLiquidity}
        onChange={(v) => updateFilter('minLiquidity', v)}
      />
      <FilterDropdown
        label="Vol"
        options={volumeOptions}
        value={filters.minVolume}
        onChange={(v) => updateFilter('minVolume', v)}
      />
      <FilterDropdown
        label="Age"
        options={ageOptions}
        value={filters.maxAge}
        onChange={(v) => updateFilter('maxAge', v)}
      />

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-text-muted hover:text-negative transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
}

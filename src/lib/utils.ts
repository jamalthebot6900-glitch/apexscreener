export function formatNumber(num: number, decimals: number = 2): string {
  if (num === 0) return '0';
  if (Math.abs(num) < 0.000001) return num.toExponential(2);
  if (Math.abs(num) < 1) return num.toFixed(6);
  
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(decimals) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(decimals) + 'K';
  }
  return num.toFixed(decimals);
}

export function formatPrice(price: number): string {
  if (price === 0) return '$0';
  if (price < 0.000001) return '$' + price.toExponential(2);
  if (price < 0.01) return '$' + price.toFixed(8);
  if (price < 1) return '$' + price.toFixed(4);
  return '$' + formatNumber(price);
}

export function formatUsd(value: number): string {
  if (value === 0) return '$0.00';
  if (value < 0.01) return '<$0.01';
  if (value < 1000) return '$' + value.toFixed(2);
  return '$' + formatNumber(value, 2);
}

export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return sign + percent.toFixed(2) + '%';
}

export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function timeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

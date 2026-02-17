'use client';

import { useApp } from '@/context/AppContext';
import { PriceAlert } from '@/hooks/useAlerts';

function AlertRow({ alert, onRemove }: { alert: PriceAlert; onRemove: () => void }) {
  const isTriggered = alert.triggered;
  
  const formatPrice = (price: number) => {
    if (price < 0.00001) return price.toExponential(2);
    if (price < 0.01) return price.toFixed(8);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  };

  const timeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={`flex items-center gap-4 px-4 py-3 border-b border-white/[0.04] ${
      isTriggered ? 'bg-[#f7931a]/5' : 'hover:bg-[#1a1a1f]'
    } transition-colors`}>
      {/* Status indicator */}
      <div className={`w-2 h-2 rounded-full ${
        isTriggered ? 'bg-[#f7931a]' : 'bg-[#00d395]'
      }`} />

      {/* Token info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-[13px]">{alert.tokenSymbol}</span>
          <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium ${
            alert.condition === 'above' 
              ? 'bg-[#00d395]/10 text-[#00d395]' 
              : 'bg-[#ff6b6b]/10 text-[#ff6b6b]'
          }`}>
            {alert.condition === 'above' ? '↑' : '↓'} ${formatPrice(alert.targetPrice)}
          </span>
          {isTriggered && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#f7931a]/20 text-[#f7931a]">
              TRIGGERED
            </span>
          )}
        </div>
        <div className="text-[11px] text-[#666] mt-0.5">
          {alert.tokenName} • Created {timeAgo(alert.createdAt)}
          {isTriggered && alert.triggeredAt && (
            <span className="text-[#f7931a]"> • Triggered {timeAgo(alert.triggeredAt)}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <a
          href={`/token/${alert.tokenAddress}`}
          className="p-1.5 text-[#888] hover:text-white hover:bg-[#1e222d] rounded-lg transition-colors"
          title="View token"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <button
          onClick={onRemove}
          className="p-1.5 text-[#888] hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/10 rounded-lg transition-colors"
          title="Remove alert"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-[#1e222d] flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      </div>
      <h3 className="text-white font-semibold text-[15px] mb-2">No Alerts Set</h3>
      <p className="text-[#888] text-[13px] text-center max-w-xs">
        Set price alerts on any token to get notified when prices hit your targets. Click the bell icon on any token row.
      </p>
    </div>
  );
}

export default function AlertsView() {
  const { alerts, removeAlert, clearAlerts, notificationsEnabled, enableNotifications } = useApp();

  const activeAlerts = alerts.filter(a => !a.triggered);
  const triggeredAlerts = alerts.filter(a => a.triggered);

  if (alerts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-[#131318] rounded-xl border border-white/[0.04] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
        <div>
          <span className="text-[12px] text-[#888] uppercase tracking-wide">
            {activeAlerts.length} Active • {triggeredAlerts.length} Triggered
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!notificationsEnabled && (
            <button
              onClick={enableNotifications}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f7931a]/10 text-[#f7931a] rounded-lg text-[12px] font-medium hover:bg-[#f7931a]/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Enable Notifications
            </button>
          )}
          {alerts.length > 0 && (
            <button
              onClick={clearAlerts}
              className="px-3 py-1.5 text-[12px] text-[#888] hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/10 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Active alerts */}
      {activeAlerts.length > 0 && (
        <div>
          <div className="px-4 py-2 bg-[#0d0d0f]">
            <span className="text-[11px] text-[#00d395] font-medium uppercase tracking-wide">Active</span>
          </div>
          {activeAlerts.map(alert => (
            <AlertRow key={alert.id} alert={alert} onRemove={() => removeAlert(alert.id)} />
          ))}
        </div>
      )}

      {/* Triggered alerts */}
      {triggeredAlerts.length > 0 && (
        <div>
          <div className="px-4 py-2 bg-[#0d0d0f]">
            <span className="text-[11px] text-[#f7931a] font-medium uppercase tracking-wide">Triggered</span>
          </div>
          {triggeredAlerts.map(alert => (
            <AlertRow key={alert.id} alert={alert} onRemove={() => removeAlert(alert.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

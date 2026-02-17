'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PriceAlert {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  condition: 'above' | 'below';
  targetPrice: number;
  createdAt: number;
  triggered?: boolean;
  triggeredAt?: number;
}

const STORAGE_KEY = 'solscope-price-alerts';
const SOUND_KEY = 'solscope-alert-sound';

// Play alert sound
function playAlertSound() {
  try {
    // Create a simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 880; // A5 note
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Play a second beep
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 1100; // Higher pitch
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.3);
    }, 200);
  } catch (err) {
    console.error('Failed to play alert sound:', err);
  }
}

// Request notification permission
async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

// Show browser notification
function showNotification(alert: PriceAlert, currentPrice: number) {
  if (Notification.permission !== 'granted') return;
  
  const direction = alert.condition === 'above' ? '📈 Above' : '📉 Below';
  const title = `${alert.tokenSymbol} Price Alert!`;
  const body = `${direction} $${alert.targetPrice.toFixed(8)}\nCurrent: $${currentPrice.toFixed(8)}`;
  
  new Notification(title, {
    body,
    icon: '/favicon.ico',
    tag: alert.id,
  });
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load alerts and preferences from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAlerts(parsed);
      }
      
      // Load sound preference
      const soundPref = localStorage.getItem(SOUND_KEY);
      if (soundPref !== null) {
        setSoundEnabled(soundPref === 'true');
      }
    } catch (err) {
      console.error('Error loading alerts:', err);
    }
    
    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch (err) {
      console.error('Error saving alerts:', err);
    }
  }, [alerts]);

  // Add new alert
  const addAlert = useCallback((alert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    setAlerts(prev => [...prev, newAlert]);
    return newAlert;
  }, []);

  // Remove alert
  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  // Clear all alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Clear triggered alerts
  const clearTriggeredAlerts = useCallback(() => {
    setAlerts(prev => prev.filter(a => !a.triggered));
  }, []);

  // Check alerts against current prices
  const checkAlerts = useCallback((prices: Map<string, number>) => {
    let soundPlayed = false;
    
    setAlerts(prev => {
      let hasChanges = false;
      const updated = prev.map(alert => {
        if (alert.triggered) return alert;
        
        const currentPrice = prices.get(alert.tokenAddress);
        if (!currentPrice) return alert;
        
        const shouldTrigger = 
          (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
          (alert.condition === 'below' && currentPrice <= alert.targetPrice);
        
        if (shouldTrigger) {
          hasChanges = true;
          showNotification(alert, currentPrice);
          
          // Play sound once for all triggered alerts
          if (soundEnabled && !soundPlayed) {
            playAlertSound();
            soundPlayed = true;
          }
          
          return { ...alert, triggered: true, triggeredAt: Date.now() };
        }
        
        return alert;
      });
      
      return hasChanges ? updated : prev;
    });
  }, [soundEnabled]);

  // Get alerts for specific token
  const getAlertsForToken = useCallback((address: string) => {
    return alerts.filter(a => a.tokenAddress === address);
  }, [alerts]);

  // Enable notifications
  const enableNotifications = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    return granted;
  }, []);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const newValue = !prev;
      try {
        localStorage.setItem(SOUND_KEY, String(newValue));
      } catch (err) {
        console.error('Error saving sound preference:', err);
      }
      return newValue;
    });
  }, []);

  // Test sound
  const testSound = useCallback(() => {
    playAlertSound();
  }, []);

  return {
    alerts,
    activeAlerts: alerts.filter(a => !a.triggered),
    triggeredAlerts: alerts.filter(a => a.triggered),
    addAlert,
    removeAlert,
    clearAlerts,
    clearTriggeredAlerts,
    checkAlerts,
    getAlertsForToken,
    notificationsEnabled,
    enableNotifications,
    soundEnabled,
    toggleSound,
    testSound,
    count: alerts.filter(a => !a.triggered).length,
  };
}

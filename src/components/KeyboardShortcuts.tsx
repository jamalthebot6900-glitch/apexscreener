'use client';

import { useState, useEffect } from 'react';

interface Shortcut {
  key: string;
  description: string;
  modifier?: string;
}

const shortcuts: Shortcut[] = [
  { key: '/', description: 'Focus search' },
  { key: 'Esc', description: 'Close search / modal' },
  { key: '?', description: 'Show keyboard shortcuts' },
  { key: '1', description: 'All tokens view' },
  { key: '2', description: 'New pairs view' },
  { key: '3', description: 'Hot tokens view' },
  { key: '4', description: 'Pumping view' },
  { key: '5', description: 'Safe tokens view' },
  { key: '6', description: 'Watchlist view' },
  { key: 'P', description: 'Portfolio view' },
  { key: 'A', description: 'Alerts view' },
  { key: 'R', description: 'Refresh data' },
];

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="relative bg-[#1a1a1f] border border-[#333] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#333]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-[#9455ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Keyboard Shortcuts
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 text-[#888] hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            {shortcuts.map((shortcut) => (
              <div 
                key={shortcut.key}
                className="flex items-center justify-between py-2 border-b border-[#2a2a30] last:border-0"
              >
                <span className="text-[14px] text-[#ccc]">{shortcut.description}</span>
                <kbd className="px-2 py-1 text-[12px] font-mono font-bold text-white bg-[#252528] border border-[#3a3a40] rounded-lg shadow-sm">
                  {shortcut.modifier && <span className="text-[#888]">{shortcut.modifier} + </span>}
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-3 bg-[#16161a] border-t border-[#333]">
          <p className="text-[12px] text-[#666] text-center">
            Press <kbd className="px-1.5 py-0.5 text-[11px] bg-[#252528] rounded border border-[#3a3a40]">?</kbd> to toggle this modal
          </p>
        </div>
      </div>
    </div>
  );
}

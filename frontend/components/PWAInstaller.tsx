'use client';

import { useEffect, useState } from 'react';
import { Bell, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(
    typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches
  );

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New Service Worker version available');
                  // Could show update notification here
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      const beforeInstallPromptEvent = e as BeforeInstallPromptEvent;
      beforeInstallPromptEvent.preventDefault();
      setDeferredPrompt(beforeInstallPromptEvent);
      setShowPrompt(true);
    });

    // Check if already installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleNotificationPermission = async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        // Already granted
        new Notification('TechStore', {
          body: 'Notifications enabled! You&apos;ll receive updates about your orders.',
          icon: '/icons/icon-192x192.png',
        });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('TechStore', {
            body: 'Notifications enabled! You&apos;ll receive updates about your orders.',
            icon: '/icons/icon-192x192.png',
          });
        }
      }
    }
  };

  if (isInstalled) {
    return null;
  }

  if (!showPrompt) {
    return (
      <button
        onClick={handleNotificationPermission}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition flex items-center gap-2 z-40"
        title="Enable notifications"
      >
        <Bell size={18} />
        <span className="hidden sm:inline">Notifications</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl p-4 max-w-sm z-50 border border-gray-200">
      <div className="flex items-start gap-3">
        <Download size={24} className="text-blue-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">Install TechStore App</h3>
          <p className="text-sm text-gray-700 mb-3">Get fast access and offline support. Install our app now!</p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded transition text-sm"
            >
              Install
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-3 rounded transition text-sm"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PWAOfflineIndicator() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white py-2 px-4 text-center font-semibold z-50">
      📡 You&apos;re offline - Some features may be limited. Sync will occur when you&apos;re back online.
    </div>
  );
}

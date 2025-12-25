'use client';

import { useEffect } from 'react';

/**
 * Service Worker Registration Component
 * Registers the service worker and handles updates
 */
export function ServiceWorkerRegistry() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('[SW] Registered successfully:', registration);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute

        // Handle new service worker waiting
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is ready
              console.log('[SW] New version available');
              
              // Notify user or automatically update
              handleServiceWorkerUpdate();
            }
          });
        });
      } catch (error) {
        console.error('[SW] Registration failed:', error);
      }
    };

    // Register after page load
    if (document.readyState === 'complete') {
      registerServiceWorker();
    } else {
      window.addEventListener('load', registerServiceWorker);
    }
  }, []);

  return null; // This component doesn't render anything
}

/**
 * Handle service worker update
 */
function handleServiceWorkerUpdate() {
  // Option 1: Auto-update
  // navigator.serviceWorker.ready.then(registration => {
  //   if (registration.waiting) {
  //     registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  //   }
  // });

  // Option 2: Notify user
  if (typeof window !== 'undefined') {
    // Dispatch custom event that can be listened to by the app
    const event = new CustomEvent('service-worker-update');
    window.dispatchEvent(event);
  }
}

/**
 * Hook to listen for service worker updates
 */
export const useServiceWorkerUpdate = (callback: () => void) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('service-worker-update', callback);
    return () => window.removeEventListener('service-worker-update', callback);
  }, [callback]);
};

/**
 * Clear all caches
 */
export const clearServiceWorkerCache = async () => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  registrations.forEach((registration) => {
    registration.active?.postMessage({ type: 'CLEAR_CACHE' });
  });
};

/**
 * Unregister service worker
 */
export const unregisterServiceWorker = async () => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    await registration.unregister();
  }
};

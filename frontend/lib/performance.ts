/**
 * Performance Optimization Utilities
 * Includes image optimization, code splitting, caching strategies, and metrics
 */

/**
 * Image optimization configuration for next/image
 * Enables WebP format, responsive sizing, and lazy loading
 */
export const imageOptimizationConfig = {
  // Device sizes for responsive images
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  // Image sizes for different breakpoints
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  // Supported formats in priority order
  formats: ['image/avif', 'image/webp'],
  // Loading placeholder strategy
  placeholder: 'blur',
  // Priority for above-the-fold images
  priority: true,
};

/**
 * Get optimized image loader for Cloudinary or CDN
 */
export const cloudinaryLoader = ({
  src,
  width,
  quality = 75,
}: {
  src: string;
  width: number;
  quality?: number;
}): string => {
  const params = [
    `w_${width}`,
    `q_${quality}`,
    'f_auto', // Auto format selection
    'c_fill', // Cover mode
  ];
  return `https://res.cloudinary.com/ecom/image/fetch/${params.join(',')}/f_auto/${src}`;
};

/**
 * Preload critical resources for faster initial load
 */
export const preloadResources = (urls: string[]) => {
  if (typeof window === 'undefined') return;

  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    // Determine resource type
    if (url.includes('.woff') || url.includes('.woff2')) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    } else if (url.includes('.js')) {
      link.as = 'script';
    } else if (url.includes('.css')) {
      link.as = 'style';
    }
    
    document.head.appendChild(link);
  });
};

/**
 * DNS prefetch for external domains to reduce latency
 */
export const dnsPrefetch = (domains: string[]) => {
  if (typeof window === 'undefined') return;

  domains.forEach((domain) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
};

/**
 * Performance metrics tracking
 */
export class PerformanceMetrics {
  private metrics: Map<string, number> = new Map();

  /**
   * Mark the start of a performance measurement
   */
  mark(name: string): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.performance.mark(`${name}-start`);
    }
  }

  /**
   * Measure the time elapsed since mark() was called
   */
  measure(name: string): number {
    if (typeof window === 'undefined' || !('performance' in window)) return 0;

    try {
      window.performance.measure(name, `${name}-start`);
      const measure = window.performance.getEntriesByName(name)[0];
      const duration = (measure as PerformanceMeasure).duration;
      this.metrics.set(name, duration);
      return duration;
    } catch (error) {
      console.error(`Error measuring ${name}:`, error);
      return 0;
    }
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Report metrics to analytics service
   */
  reportMetrics(endpoint: string): void {
    const metrics = this.getMetrics();
    if (Object.keys(metrics).length === 0) return;

    // Use sendBeacon for reliable delivery even on page unload
    navigator.sendBeacon(endpoint, JSON.stringify(metrics));
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }
}

/**
 * Cache strategy implementations for Service Worker
 */
export const cacheStrategies = {
  /**
   * Cache first: Use cached version if available, fallback to network
   */
  cacheFirst: async (
    cacheName: string,
    request: Request
  ): Promise<Response> => {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(request);
      // Cache successful responses
      if (response.status === 200) {
        const clonedResponse = response.clone();
        cache.put(request, clonedResponse);
      }
      return response;
    } catch (error) {
      throw new Error(`Network error: ${error}`);
    }
  },

  /**
   * Network first: Try network first, fallback to cache
   */
  networkFirst: async (
    cacheName: string,
    request: Request,
    timeout = 5000
  ): Promise<Response> => {
    const cache = await caches.open(cacheName);

    try {
      // Fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(request, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Cache successful responses
      if (response.status === 200) {
        const clonedResponse = response.clone();
        cache.put(request, clonedResponse);
      }

      return response;
    } catch (error) {
      // Fallback to cache on network error or timeout
      const cached = await cache.match(request);
      if (cached) {
        return cached;
      }
      throw error;
    }
  },

  /**
   * Stale while revalidate: Return cache immediately, update in background
   */
  staleWhileRevalidate: async (
    cacheName: string,
    request: Request
  ): Promise<Response> => {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request).then((response) => {
      if (response.status === 200) {
        const clonedResponse = response.clone();
        cache.put(request, clonedResponse);
      }
      return response;
    });

    return cached || fetchPromise;
  },
};

/**
 * Code splitting utilities for dynamic imports
 */
export const codeSpitting = {
  /**
   * Dynamically import a module with error handling
   */
  importWithFallback: async <T,>(
    importFn: () => Promise<{ default: T }>,
    fallbackComponent: T
  ): Promise<T> => {
    try {
      const module = await importFn();
      return module.default;
    } catch (error) {
      console.error('Failed to dynamically import module:', error);
      return fallbackComponent;
    }
  },

  /**
   * Prefetch a module for faster loading
   */
  prefetchModule: (src: string): void => {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = src;
    link.as = 'script';
    document.head.appendChild(link);
  },
};

/**
 * Lazy load intersection observer utility
 */
export class LazyLoadObserver {
  private observer: IntersectionObserver | null = null;

  constructor(
    private callback: (element: Element) => void,
    private options: IntersectionObserverInit = {
      rootMargin: '50px',
      threshold: 0.01,
    }
  ) {}

  /**
   * Start observing elements
   */
  observe(elements: Element[]): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Fallback: immediately call callback for all elements
      elements.forEach((el) => this.callback(el));
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.callback(entry.target);
          // Stop observing after element is visible
          this.observer?.unobserve(entry.target);
        }
      });
    }, this.options);

    elements.forEach((el) => this.observer?.observe(el));
  }

  /**
   * Stop observing all elements
   */
  disconnect(): void {
    this.observer?.disconnect();
  }
}

/**
 * Debounce utility for performance-sensitive operations
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Throttle utility for high-frequency events
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Request idle callback polyfill for older browsers
 */
export const requestIdleCallback =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? window.requestIdleCallback
    : (callback: IdleRequestCallback) => {
        const start = Date.now();
        return setTimeout(() => {
          callback({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
          } as IdleDeadline);
        }, 1);
      };

/**
 * Cancel idle callback with fallback
 */
export const cancelIdleCallback =
  typeof window !== 'undefined' && 'cancelIdleCallback' in window
    ? window.cancelIdleCallback
    : (id: number) => clearTimeout(id);

/**
 * Memory-efficient batch processing
 */
export const batchProcess = async <T, R>(
  items: T[],
  processor: (item: T) => R,
  batchSize = 10
): Promise<R[]> => {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    // Process batch
    const batchResults = await Promise.all(
      batch.map((item) =>
        new Promise<R>((resolve) => {
          requestIdleCallback(() => {
            resolve(processor(item));
          });
        })
      )
    );

    results.push(...batchResults);

    // Allow UI to update between batches
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  return results;
};

/**
 * Memory leak prevention utilities
 */
export class ResourceCleaner {
  private resources: (() => void)[] = [];

  /**
   * Register a cleanup function
   */
  register(cleanup: () => void): void {
    this.resources.push(cleanup);
  }

  /**
   * Register event listener with automatic cleanup
   */
  addEventListener(
    target: EventTarget,
    event: string,
    handler: EventListener
  ): void {
    target.addEventListener(event, handler);
    this.register(() => target.removeEventListener(event, handler));
  }

  /**
   * Register interval with automatic cleanup
   */
  setInterval(callback: () => void, interval: number): void {
    const id = setInterval(callback, interval);
    this.register(() => clearInterval(id));
  }

  /**
   * Register timeout with automatic cleanup
   */
  setTimeout(callback: () => void, delay: number): void {
    const id = setTimeout(callback, delay);
    this.register(() => clearTimeout(id));
  }

  /**
   * Clean up all registered resources
   */
  cleanup(): void {
    this.resources.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    });
    this.resources = [];
  }
}

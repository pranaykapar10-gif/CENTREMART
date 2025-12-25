/**
 * React hooks for performance optimization
 */

import { useEffect, useRef, useState } from 'react';
import { LazyLoadObserver, ResourceCleaner, debounce } from '@/lib/performance';

/**
 * Hook for lazy loading elements
 */
export const useLazyLoad = (
  callback: (element: Element) => void,
  options?: IntersectionObserverInit
) => {
  const elementsRef = useRef<Set<Element>>(new Set());

  useEffect(() => {
    const observer = new LazyLoadObserver(callback, options);
    const elements = Array.from(elementsRef.current);
    observer.observe(elements);

    return () => observer.disconnect();
  }, [callback, options]);

  const observe = (element: Element) => {
    if (element) {
      elementsRef.current.add(element);
    }
  };

  return observe;
};

/**
 * Hook for tracking performance metrics
 */
export const usePerformanceMetrics = (name: string) => {
  useEffect(() => {
    const start = performance.now();

    return () => {
      const duration = performance.now() - start;
      console.log(`${name} took ${duration.toFixed(2)}ms`);

      // Report to analytics if available
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as Record<string, unknown>).gtag as (
          event: string,
          action: string,
          params: Record<string, unknown>
        ) => void;
        gtag('event', 'page_view', {
          metric_name: name,
          metric_duration: duration,
        });
      }
    };
  }, [name]);
};

/**
 * Hook for debounced resize events
 */
export const useWindowResize = (callback: (size: { width: number; height: number }) => void, delay = 250) => {
  useEffect(() => {
    const handleResize = debounce(() => {
      callback({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, delay);

    window.addEventListener('resize', handleResize);

    // Call once on mount
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [callback, delay]);
};

/**
 * Hook for managing resource cleanup
 */
export const useResourceCleanup = () => {
  const [cleaner] = useState(() => new ResourceCleaner());

  useEffect(() => {
    return () => cleaner.cleanup();
  }, [cleaner]);

  return cleaner;
};

/**
 * Hook for prefetching resources on hover
 */
export const usePrefetch = (href: string) => {
  const prefetchRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const link = prefetchRef.current;
    if (!link) return;

    const handleMouseEnter = () => {
      const prefetchableLink = link as HTMLAnchorElement & { prefetch?: () => void };
      if ('prefetch' in prefetchableLink && typeof prefetchableLink.prefetch === 'function') {
        prefetchableLink.prefetch();
      }
    };

    link.addEventListener('mouseenter', handleMouseEnter);

    return () => link.removeEventListener('mouseenter', handleMouseEnter);
  }, [href]);

  return prefetchRef;
};

/**
 * Hook for observing element visibility
 */
export const useIntersectionObserver = (
  ref: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit
): boolean => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isVisible;
};

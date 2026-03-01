/**
 * Performance monitoring utility for tracking Web Vitals
 * Integrates with Google Analytics
 */

interface VitalsMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  navigationType: string
}

export function reportWebVitals(metric: VitalsMetric) {
  if (typeof window !== 'undefined') {
    // Skip in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', metric);
      return;
    }

    // Send to Google Analytics
    if ((window as any).gtag) {
      const { name, delta, id, rating } = metric;
      (window as any).gtag('event', name, {
        value: Math.round(delta),
        event_category: 'Web Vitals',
        event_label: id,
        non_interaction: true,
        ...(rating && { metric_rating: rating }),
      });
    }

    // Send to custom analytics endpoint
    if (process.env.NEXT_PUBLIC_API_URL) {
      navigator.sendBeacon(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/vitals`,
        JSON.stringify({
          metric,
          timestamp: new Date().toISOString(),
          url: window.location.pathname,
        })
      );
    }
  }
}

/**
 * Monitors performance metrics on page load
 */
export function performanceObserver() {
  if (typeof window === 'undefined') return;

  try {
    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('Performance entry:', entry);
        }
      });

      observer.observe({
        entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint'],
      });
    }

    // Log page load time
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log('Page load time:', pageLoadTime, 'ms');
    });
  } catch (error) {
    console.warn('Performance observer error:', error);
  }
}

/**
 * Preloads critical resources
 */
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  }
}

/**
 * Prefetches resources for anticipated navigation
 */
export function prefetchResource(href: string) {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
}

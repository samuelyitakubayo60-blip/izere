/**
 * Centralized utility to send event tracking to Google Analytics (GA4).
 * Checks if window.gtag exists before sending. Logs to console in development.
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else if (import.meta.env.DEV) {
    console.log(`[Analytics DEV] Event: ${eventName}`, params);
  }
};

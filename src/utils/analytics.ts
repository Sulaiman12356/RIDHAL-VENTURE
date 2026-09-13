/**
 * RIDHAL VENTURES Analytics Event Utility
 * Prepares and dispatches structured ecommerce events for Google Analytics (GA4),
 * Meta Pixel, or local console debugging.
 */

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  price: number;
  item_category?: string;
  quantity?: number;
}

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  try {
    // 1. Google Tag Manager / GA4 DataLayer
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        ...params,
        timestamp: new Date().toISOString()
      });

      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
      }

      // 2. Meta / Facebook Pixel
      if (typeof window.fbq === 'function') {
        if (eventName === 'purchase') {
          window.fbq('track', 'Purchase', {
            value: params.value,
            currency: params.currency || 'NGN'
          });
        } else if (eventName === 'add_to_cart') {
          window.fbq('track', 'AddToCart', {
            content_name: params.item_name,
            value: params.value,
            currency: 'NGN'
          });
        }
      }
    }

    // Development event log
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics Event: ${eventName}]`, params);
    }
  } catch (err) {
    console.warn('Analytics tracking notice:', err);
  }
};

export const trackPageView = (pagePath: string, pageTitle: string) => {
  trackEvent('page_view', {
    page_location: pagePath,
    page_title: pageTitle
  });
};

export const trackViewItem = (item: AnalyticsItem) => {
  trackEvent('view_item', {
    currency: 'NGN',
    value: item.price,
    items: [item]
  });
};

export const trackAddToCart = (item: AnalyticsItem) => {
  trackEvent('add_to_cart', {
    currency: 'NGN',
    value: (item.price || 0) * (item.quantity || 1),
    items: [item]
  });
};

export const trackBeginCheckout = (value: number, items: AnalyticsItem[]) => {
  trackEvent('begin_checkout', {
    currency: 'NGN',
    value,
    items
  });
};

export const trackPurchase = (orderId: string, value: number, items: AnalyticsItem[]) => {
  trackEvent('purchase', {
    transaction_id: orderId,
    value,
    currency: 'NGN',
    items
  });
};

export const trackSearch = (searchQuery: string, resultsCount: number) => {
  trackEvent('search', {
    search_term: searchQuery,
    results_count: resultsCount
  });
};

import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { env } from './env';

/**
 * Lazy-loading Stripe service
 * Only loads Stripe.js when explicitly requested (e.g., on checkout pages)
 */
class LazyStripeService {
  private stripePromise: Promise<Stripe | null> | null = null;
  private isLoading = false;

  /**
   * Load Stripe.js lazily - only when needed
   * This should be called on checkout-related pages only
   */
  async loadStripe(): Promise<Stripe | null> {
    // Return existing promise if already loading/loaded
    if (this.stripePromise) {
      return await this.stripePromise;
    }

    // Prevent multiple simultaneous loads
    if (this.isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.loadStripe();
    }

    this.isLoading = true;

    try {
      console.log('🔄 Lazy loading Stripe.js...');

      const publishableKey = env.stripePublishableKey;

      if (!publishableKey) {
        console.error('Stripe publishable key not found');
        return null;
      }

      this.stripePromise = loadStripe(publishableKey, {
        apiVersion: '2023-10-16', // Use stable API version
      });

      const stripe = await this.stripePromise;

      if (stripe) {
        console.log('✅ Stripe.js loaded successfully');
      } else {
        console.error('❌ Failed to load Stripe.js');
      }

      return stripe;
    } catch (error) {
      console.error('❌ Error loading Stripe.js:', error);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Check if Stripe has been loaded
   */
  isStripeLoaded(): boolean {
    return this.stripePromise !== null;
  }

  /**
   * Get Stripe instance if already loaded, otherwise return null
   * Use this for non-critical features that can work without Stripe
   */
  getStripeIfLoaded(): Promise<Stripe | null> | null {
    return this.stripePromise;
  }

  /**
   * Reset the lazy loader (useful for testing)
   */
  reset(): void {
    this.stripePromise = null;
    this.isLoading = false;
  }

  /**
   * Preload Stripe.js in the background (for better UX)
   * Call this when user starts showing checkout intent
   */
  preloadStripe(): void {
    if (!this.stripePromise && !this.isLoading) {
      // Preload in background without waiting
      this.loadStripe().catch(error => {
        console.warn('Stripe preload failed:', error);
      });
    }
  }
}

// Export singleton instance
export const lazyStripeService = new LazyStripeService();

// Helper function to check if we're on a checkout-related page
export const isCheckoutPage = (): boolean => {
  if (typeof window === 'undefined') return false;

  const checkoutRoutes = ['/checkout', '/cart', '/payment'];
  return checkoutRoutes.some(route =>
    window.location.pathname.includes(route)
  );
};

// Helper function to preload Stripe when user shows checkout intent
export const preloadStripeOnIntent = () => {
  // Common actions that indicate checkout intent
  const intentActions = [
    'add-to-cart-clicked',
    'checkout-button-hovered',
    'cart-opened'
  ];

  // You can call this function when these actions occur
  lazyStripeService.preloadStripe();
};

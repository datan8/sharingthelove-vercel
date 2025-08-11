import { productsService, type ProductsResponse } from './products';

/**
 * Product prefetching service for improved performance
 * Starts loading products in the background as soon as possible
 */
class ProductsPrefetchService {
  private prefetchPromise: Promise<ProductsResponse> | null = null;
  private prefetchStarted = false;

  /**
   * Start prefetching products in the background
   * This can be called multiple times safely
   */
  startPrefetch(): void {
    if (this.prefetchStarted) {
      return;
    }

    this.prefetchStarted = true;

    // Start prefetching with a small delay to not interfere with initial page load
    setTimeout(() => {
      this.prefetchPromise = productsService.fetchProducts(false);
      console.log('🚀 Product prefetch started');
    }, 100);
  }

  /**
   * Get prefetched products, or start fetching if not already started
   * Returns cached data immediately if available, or the prefetch promise
   */
  async getPrefetchedProducts(): Promise<ProductsResponse> {
    // If prefetch was started, wait for it
    if (this.prefetchPromise) {
      console.log('📦 Using prefetched products');
      return await this.prefetchPromise;
    }

    // If no prefetch was started, fetch normally
    console.log('📦 Fetching products (no prefetch available)');
    return await productsService.fetchProducts(false);
  }

  /**
   * Check if products are likely already cached/prefetched
   */
  isPrefetchReady(): boolean {
    const cacheStatus = productsService.getCacheStatus();
    return cacheStatus.cached || this.prefetchPromise !== null;
  }

  /**
   * Reset prefetch state (useful for testing)
   */
  reset(): void {
    this.prefetchPromise = null;
    this.prefetchStarted = false;
  }
}

// Export singleton instance
export const productsPrefetchService = new ProductsPrefetchService();

// Auto-start prefetching when module loads (in browser only)
if (typeof window !== 'undefined') {
  // Start prefetching after a brief delay to ensure app is initializing
  setTimeout(() => {
    productsPrefetchService.startPrefetch();
  }, 500);
}

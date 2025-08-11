export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  category: string;
  organic: boolean;
  featured: boolean;
  active: boolean;
  metadata: Record<string, string>;
  stripe_product_id?: string;
  stripe_price_id?: string;
}

export interface ProductsResponse {
  products: Product[];
  warning?: string;
  success?: boolean;
  source?: string;
  count?: number;
  message?: string;
  stripeConfigured?: boolean;
  error?: string;
  details?: string;
}

class ProductsService {
  private cache: ProductsResponse | null = null;
  private cacheTimestamp = 0;
  private readonly CACHE_DURATION = 1 * 60 * 1000; // 1 minute

  // Clear cache on initialization to ensure fresh data
  constructor() {
    this.clearCache();
  }

  async fetchProducts(forceRefresh = false): Promise<ProductsResponse> {
    // Return cached data if it's still valid
    if (!forceRefresh && this.cache && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
      console.log('Returning cached products');
      return this.cache;
    }

    try {
      console.log('Fetching products from Stripe API...');

      // Use Vercel API routes for all environments
      const apiEndpoint = '/api/stripe-products';

      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();

      // Handle both Netlify function format and Vercel API format
      let data: ProductsResponse;
      if ('success' in rawData) {
        // Netlify function format - convert to our format
        data = {
          products: rawData.products || [],
          warning: rawData.error || (!rawData.success ? rawData.message : undefined),
          success: rawData.success,
          source: rawData.source,
          count: rawData.count,
          message: rawData.message,
          stripeConfigured: rawData.stripeConfigured,
          error: rawData.error,
          details: rawData.details,
        };
      } else {
        // Vercel API format - use as is
        data = rawData as ProductsResponse;
      }

      // Log warning if present
      if (data.warning) {
        console.warn('API Warning:', data.warning);
      }

      // Cache the response
      this.cache = data;
      this.cacheTimestamp = Date.now();

      console.log(`Successfully fetched ${data.products.length} products${data.warning ? ' (with warning)' : ''}`);
      return data;

    } catch (error) {
      console.error('Error fetching products from API:', error);

      // Return empty products if API call fails
      const errorResponse: ProductsResponse = {
        products: [],
        warning: `API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };

      // Cache the error response briefly
      this.cache = errorResponse;
      this.cacheTimestamp = Date.now();

      return errorResponse;
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await this.fetchProducts();
    return response.products.filter(product => product.featured && product.active);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await this.fetchProducts();
    return response.products.filter(
      product => product.category.toLowerCase() === category.toLowerCase() && product.active
    );
  }

  async getProductById(id: string): Promise<Product | null> {
    const response = await this.fetchProducts();
    return response.products.find(product => product.id === id) || null;
  }

  // Clear cache to force refresh
  clearCache(): void {
    this.cache = null;
    this.cacheTimestamp = 0;
  }

  // Get cache status
  getCacheStatus(): { cached: boolean; age: number } {
    return {
      cached: this.cache !== null,
      age: this.cache ? Date.now() - this.cacheTimestamp : 0,
    };
  }
}

// Export singleton instance
export const productsService = new ProductsService();

// Helper function for formatting price
export function formatPrice(price: number, currency = 'nzd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(price);
}

// Helper function to get primary product image
export function getProductImage(product: Product): string {
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }

  // Fallback to a placeholder image
  return '/images/hero-bg.jpg';
}

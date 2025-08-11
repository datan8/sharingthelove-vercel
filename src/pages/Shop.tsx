import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductGridSkeleton } from "@/components/ui/product-skeleton";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Plus, Heart, RefreshCw, AlertCircle } from "lucide-react";
import { productsService, type Product, formatPrice, getProductImage } from "@/services/products";
import { productsPrefetchService } from "@/services/productsPrefetch";
import { useCart } from "@/contexts/CartContext";

interface CartItem extends Product {
  quantity: number;
}

const Shop = () => {
  const { state: cartState, addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  const [stripeConfigured, setStripeConfigured] = useState<boolean>(false);
  const [apiMessage, setApiMessage] = useState<string>('');

  // Check for payment status in URL
  const urlParams = new URLSearchParams(window.location.search);
  const paymentSuccess = urlParams.get('success') === 'true';
  const paymentCanceled = urlParams.get('canceled') === 'true';
  const paymentAmount = urlParams.get('amount');

  // Load products from Stripe API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Shop: Loading products from Stripe API...');

      const response = await productsPrefetchService.getPrefetchedProducts();
      console.log('🛍️ SHOP: Products response:', response);

      // Debug: Check product structures
      console.log('🛍️ SHOP: Product structures:', response.products.map(product => ({
        id: product.id,
        name: product.name,
        stripe_price_id: product.stripe_price_id,
        stripe_product_id: product.stripe_product_id,
        price: product.price,
        hasStripeIds: !!(product.stripe_price_id && product.stripe_product_id),
        allFields: Object.keys(product)
      })));

      setProducts(response.products);
      setDataSource(response.source || "unknown");
      setStripeConfigured(response.stripeConfigured || false);
      setApiMessage(response.message || '');

      if (response.error) {
        console.warn('🛍️ SHOP: API warning:', response.error);
      }

      console.log(`🛍️ SHOP: Successfully loaded ${response.count} products from ${response.source}`);
    } catch (err) {
      console.error('Shop: Error loading products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log('Shop: Manual refresh triggered');
    productsService.clearCache(); // Clear cache to force fresh data
    loadProducts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      {/* Payment Status Messages */}
      {paymentSuccess && (
        <div className="bg-emerald-100 border border-emerald-500 text-emerald-700 px-4 py-3 text-center">
          🎉 Payment successful{paymentAmount ? ` for ${paymentAmount}` : ''}! Thank you for supporting communities in Vietnam. You'll receive an email confirmation shortly.
        </div>
      )}
      {paymentCanceled && (
        <div className="bg-amber-100 border border-amber-500 text-amber-700 px-4 py-3 text-center">
          Payment was canceled. Your cart items are still here when you're ready to checkout.
        </div>
      )}

      {/* Header */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl font-bold text-emerald-800 mb-6">
            Our Healing Products
          </h1>
          <p className="text-xl text-emerald-700 mb-8">
            Organic wellness products crafted with love for your wellbeing and Vietnam's future
          </p>

          {/* Data Source and Refresh Info */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full text-sm">
              <div className={`w-2 h-2 rounded-full ${
                dataSource === 'stripe' ? 'bg-emerald-500' :
                dataSource === 'fallback' ? 'bg-amber-500' : 'bg-red-500'
              }`} />
              <span className="text-emerald-800">
                {dataSource === 'stripe' ? 'Live Stripe Data' :
                 dataSource === 'fallback' ? 'Fallback Products' : 'Cached Data'}
              </span>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <ProductGridSkeleton count={6} />
          </div>
        </section>
      )}
      {error && !loading && (
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Products</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={handleRefresh} className="bg-red-600 hover:bg-red-700 text-white">
                Try Again
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-emerald-700">No products available at the moment.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map(product => (
                    <Card key={product.id} className="border-emerald-200 hover:shadow-lg transition-all duration-300 group">
                      <CardHeader className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <OptimizedImage
                            src={getProductImage(product)}
                            alt={product.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            lazy={true}
                          />
                          <div className="absolute top-4 right-4">
                            <Button size="sm" variant="outline" className="bg-white/80 hover:bg-white">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs">
                              {product.category}
                            </span>
                            {product.organic && (
                              <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                                Organic
                              </span>
                            )}
                            <span className="bg-brandGold text-white px-2 py-1 rounded-full text-xs font-medium">
                              Funds Orphans' Care
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <CardTitle className="text-xl text-emerald-800 mb-2">
                          {product.name}
                        </CardTitle>
                        <p className="text-gray-600 mb-2 text-sm">
                          {product.description}
                        </p>
                        <p className="text-brandGold text-xs mb-4 font-medium">
                          Every item you buy helps pay for food, school fees and medical needs in our orphanage programme.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-emerald-700">
                            {formatPrice(product.price, product.currency)}
                          </span>
                          <Button
                            onClick={() => {
                              console.log('🛍️ SHOP: Adding product to cart:', {
                                id: product.id,
                                name: product.name,
                                stripe_price_id: product.stripe_price_id,
                                stripe_product_id: product.stripe_product_id,
                                price: product.price,
                                hasStripeIds: !!(product.stripe_price_id && product.stripe_product_id)
                              });
                              addItem(product);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <p className="text-sm text-emerald-600">
                    Showing {products.length} product{products.length !== 1 ? 's' : ''} •
                    Data source: {dataSource === 'stripe' ? 'Live Stripe API' :
                                dataSource === 'fallback' ? 'Fallback Products' : 'Error Fallback'}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Impact Banner */}
      <section className="py-16 px-4 bg-emerald-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Shop with Purpose - Transform Lives
          </h2>
          <p className="text-xl mb-6">
            100% of our profits fund food, education and healthcare for sixty-four orphans in Viet Nam
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold mb-2">Education</div>
              <p>Supporting children's schooling and learning opportunities</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Healthcare</div>
              <p>Providing essential medical care and health resources</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Economic Growth</div>
              <p>Creating jobs and business opportunities for families</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stripe Configuration Status */}
      {!loading && dataSource && (
        <div className={`px-4 py-3 text-center text-sm ${
          stripeConfigured && dataSource === 'stripe'
            ? 'bg-emerald-100 border border-emerald-500 text-emerald-700'
            : 'bg-blue-100 border border-blue-500 text-blue-700'
        }`}>
          {stripeConfigured && dataSource === 'stripe' ? (
            <>
              ✅ <strong>Live Stripe Integration:</strong> Products loaded from your Stripe dashboard
            </>
          ) : (
            <>
              ℹ️ <strong>Demo Mode:</strong> {apiMessage || 'Using demo products. Configure Stripe API keys to load real products.'}
              {!stripeConfigured && (
                <>
                  <a
                    href="https://dashboard.stripe.com/test/apikeys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 underline hover:text-blue-800"
                  >
                    Get Stripe API Keys →
                  </a>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;

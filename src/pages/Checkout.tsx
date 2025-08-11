import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, getProductImage } from "@/services/products";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { lazyStripeService } from "@/lib/stripe-lazy";
import { ArrowLeft, CreditCard, Lock, Heart, ExternalLink } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "NZ",
  });

  // Redirect if cart is empty
  useEffect(() => {
    // Preload Stripe.js when checkout page loads
    lazyStripeService.preloadStripe();
    if (state.items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [state.items.length, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate form data
    if (!formData.name || !formData.email) {
      setError('Please fill in your name and email address.');
      return;
    }

    // Ensure we have valid cart data
    if (state.items.length === 0 || state.total <= 0) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Creating Stripe Checkout Session...');
      console.log('Cart items:', state.items.map(item => `${item.product.name} x${item.quantity}`));
      console.log('Total amount:', state.total, 'NZD');

      // Use the new checkout API endpoint
      const apiEndpoint = '/api/checkout';

      // Format line items correctly for Stripe Checkout
      const formattedLineItems = state.items.map(item => ({
        price: item.product.stripe_price_id, // This should be the Stripe price ID
        quantity: item.quantity,
      }));

      // Prepare checkout data with correct format
      const checkoutData = {
        lineItems: formattedLineItems,
        customerEmail: formData.email,
      };

      console.log('Calling checkout API:', apiEndpoint);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Checkout session creation failed:', errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const result = await response.json();

      if (!result.sessionId || !result.url) {
        throw new Error('Invalid checkout session response');
      }

      console.log('Checkout session created successfully:', result.sessionId);
      console.log('Redirecting to Stripe Checkout:', result.url);

      // Redirect to Stripe Checkout
      window.location.href = result.url;

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (state.items.length === 0) {
    return null; // Will redirect to cart
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/cart')}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
            <h1 className="text-4xl font-bold text-emerald-800 mb-2">
              Secure Checkout
            </h1>
            <div className="flex items-center gap-2 text-emerald-700">
              <Lock className="h-4 w-4" />
              <span>SSL encrypted and secure</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 mb-2">
                <Lock className="h-4 w-4" />
                <span className="font-semibold">Checkout Error</span>
              </div>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div>
              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Customer Information */}
                <Card className="border-emerald-200">
                  <CardHeader>
                    <CardTitle className="text-emerald-800">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="border-emerald-200 focus:border-emerald-500"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="border-emerald-200 focus:border-emerald-500"
                        placeholder="Your full name"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Billing Address (Optional - Stripe will collect this) */}
                <Card className="border-emerald-200">
                  <CardHeader>
                    <CardTitle className="text-emerald-800">Billing Information</CardTitle>
                    <p className="text-sm text-gray-600">
                      Optional - Stripe will collect complete billing details securely
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address (Optional)</Label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="border-emerald-200 focus:border-emerald-500"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City (Optional)</Label>
                        <Input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="border-emerald-200 focus:border-emerald-500"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code (Optional)</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          type="text"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="border-emerald-200 focus:border-emerald-500"
                          placeholder="1234"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-emerald-200 rounded-md focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="NZ">New Zealand</option>
                        <option value="AU">Australia</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="VN">Vietnam</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information Notice */}
                <Card className="border-emerald-200">
                  <CardHeader>
                    <CardTitle className="text-emerald-800 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Secure Payment with Stripe
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Lock className="h-4 w-4" />
                        <span className="text-sm">Your payment details are securely processed by Stripe</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700">
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-sm">You'll be redirected to Stripe's secure checkout</span>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 text-sm font-medium mb-1">Test Mode Active</p>
                        <p className="text-blue-700 text-xs">
                          Use test card: 4242 4242 4242 4242 with any future date and CVC
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Checkout Session...
                    </div>
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Continue to Stripe Checkout • {formatPrice(state.total)}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="border-emerald-200 sticky top-20">
                <CardHeader>
                  <CardTitle className="text-emerald-800">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {state.items.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3">
                        <img
                          src={getProductImage(item.product)}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/hero-bg.jpg';
                          }}
                        />
                        <div className="flex-grow">
                          <h4 className="font-medium text-sm">{item.product.name}</h4>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-emerald-200 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatPrice(state.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-emerald-600">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-emerald-800">Total</span>
                      <span className="text-emerald-800">{formatPrice(state.total)}</span>
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-500 pt-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-emerald-600" />
                      <span>Supporting 64 orphans in Vietnam</span>
                    </div>
                    <p>100% of profits fund food, education & healthcare</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

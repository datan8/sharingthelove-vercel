import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, getProductImage } from "@/services/products";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Heart, Lock } from "lucide-react";
import { useState } from "react";

const Cart = () => {
  const { state, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  // New state for email and checkout
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCheckout = async () => {
    setError(null);

    // Validation
    if (state.items.length === 0) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Check if products have required Stripe data
    const invalidItems = state.items.filter(item =>
      !item.product.stripe_price_id || !item.product.stripe_product_id
    );

    if (invalidItems.length > 0) {
      setError('Some items in your cart are not available for purchase. Please refresh and try again.');
      return;
    }

    setIsLoading(true);

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
        customerEmail: email.trim(),
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <ShoppingBag className="h-24 w-24 text-emerald-300 mx-auto mb-8" />
              <h1 className="text-4xl font-bold text-emerald-800 mb-6">
                Your Cart is Empty
              </h1>
              <p className="text-xl text-emerald-700 mb-8 max-w-2xl mx-auto">
                Discover our beautiful organic products that help heal bodies and communities.
                Every purchase supports orphans in Vietnam.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Heart className="h-5 w-5 mr-2" />
                    Browse Organics
                  </Button>
                </Link>
                <Link to="/">
                  <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-emerald-800 mb-2">
              Your Cart
            </h1>
            <p className="text-emerald-700">
              {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'} • Shipping the love worldwide
            </p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {state.items.map((item) => (
                  <Card key={item.product.id} className="border-emerald-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={getProductImage(item.product)}
                            alt={item.product.name}
                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/hero-bg.jpg';
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-semibold text-emerald-800">
                              {item.product.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.product.id)}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <p className="text-gray-600 text-sm mb-4">
                            {item.product.description}
                          </p>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-emerald-200 rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                className="h-10 w-10 p-0 hover:bg-emerald-50"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                className="h-10 w-10 p-0 hover:bg-emerald-50"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-lg font-bold text-emerald-700">
                                {formatPrice(item.product.price * item.quantity, item.product.currency)}
                              </div>
                              {item.quantity > 1 && (
                                <div className="text-sm text-gray-500">
                                  {formatPrice(item.product.price, item.product.currency)} each
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-emerald-200 sticky top-20">
                <CardHeader>
                  <CardTitle className="text-emerald-800">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(state.total)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-emerald-600">Free</span>
                  </div>

                  <div className="border-t border-emerald-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-emerald-800">Total</span>
                      <span className="text-emerald-800">{formatPrice(state.total)}</span>
                    </div>
                  </div>

                  {/* Email Collection */}
                  <div className="border-t border-emerald-200 pt-4">
                    <Label htmlFor="checkout-email" className="text-emerald-800 font-medium">
                      Email Address
                    </Label>
                    <div className="mt-2">
                      <Input
                        id="checkout-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="border-emerald-200 focus:border-emerald-500"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Required for order confirmation and receipts
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleCheckout}
                      disabled={isLoading || state.items.length === 0}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                      size="lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating Checkout...
                        </div>
                      ) : (
                        <>
                          <Lock className="h-5 w-5 mr-2" />
                          Secure Checkout • {formatPrice(state.total)}
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-500 pt-2">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Lock className="h-3 w-3 text-emerald-600" />
                      <span>SSL encrypted & secure payment</span>
                    </div>
                    <p className="text-xs">Powered by Stripe</p>
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

export default Cart;

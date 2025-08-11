import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CreditCard, ExternalLink } from "lucide-react";
import { useCart, type CartItem } from "@/contexts/CartContext";
import { formatPrice } from "@/services/products";
import { lazyStripeService } from "@/lib/stripe-lazy";

interface ProgressiveCheckoutProps {
  onCheckoutStart?: () => void;
  onCheckoutComplete?: (sessionId: string) => void;
  onCheckoutError?: (error: string) => void;
}

export function ProgressiveCheckout({
  onCheckoutStart,
  onCheckoutComplete,
  onCheckoutError,
}: ProgressiveCheckoutProps) {
  const { state } = useCart();
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  // Progressive enhancement - detect if JavaScript is available
  useEffect(() => {
    setIsEnhanced(true);
    // Preload Stripe when component mounts
    lazyStripeService.preloadStripe();
  }, []);

  const totalAmount = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEnhanced) {
      // Fallback: redirect to a server-side checkout form
      window.location.href = `/api/checkout-fallback?email=${encodeURIComponent(email)}`;
      return;
    }

    try {
      setIsLoading(true);
      onCheckoutStart?.();

      // Validate inputs
      if (!email) {
        throw new Error("Email is required");
      }

      if (state.items.length === 0) {
        throw new Error("Cart is empty");
      }

      // Enhanced checkout with Stripe
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineItems: state.items.map(item => ({
            price: item.product.stripe_price_id, // This should be the Stripe price ID
            quantity: item.quantity,
          })),
          customerEmail: email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Checkout failed');
      }

      const { url, sessionId } = await response.json();

      if (url) {
        onCheckoutComplete?.(sessionId);
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Checkout failed';
      onCheckoutError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Secure Checkout
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCheckout} className="space-y-4">
          {/* Email field */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="mt-1"
            />
            <p className="text-sm text-gray-600 mt-1">
              You'll receive order confirmation and updates here
            </p>
          </div>

          {/* Order summary */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            {state.items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm mb-1">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Progressive enhancement notice */}
          {!isEnhanced && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Basic checkout mode</p>
                  <p>You'll be redirected to complete your purchase securely.</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading || state.items.length === 0}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {isEnhanced ? <CreditCard className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                Pay {formatPrice(totalAmount)} Securely
              </div>
            )}
          </Button>

          {/* Security notice */}
          <p className="text-xs text-gray-500 text-center">
            🔒 Payments processed securely by Stripe. Your card details are never stored on our servers.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

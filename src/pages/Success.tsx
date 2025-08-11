import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Heart, Home } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart from localStorage when the success page loads
    clearCart();

    // Also clear any localStorage cart data directly as a backup
    localStorage.removeItem('shopping-cart');
  }, [clearCart]);

  // Format the session_id for display as order number
  const orderNumber = sessionId ? sessionId.slice(-8).toUpperCase() : 'UNKNOWN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-emerald-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-emerald-800 mb-4">
              Thank you for your order!
            </h1>
            <p className="text-xl text-emerald-700 max-w-2xl mx-auto">
              Your order has been successfully processed and you'll receive a confirmation email shortly.
            </p>
          </div>

          {/* Order Details */}
          {sessionId && (
            <Card className="border-emerald-200 mb-8 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-emerald-800">Order Confirmation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-medium text-lg text-emerald-800">#{orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Session ID</p>
                    <p className="font-medium text-xs text-gray-700 break-all">{sessionId}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-4 border-t border-emerald-200">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-emerald-600 font-medium">
                    Order Confirmed
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Impact Message */}
          <Card className="border-emerald-200 bg-emerald-50 mb-8 max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
                <h2 className="text-2xl font-bold text-emerald-800">
                  You're Making a Difference!
                </h2>
              </div>
              <p className="text-emerald-700 text-lg leading-relaxed">
                Your purchase directly supports 64 orphans in Vietnam with food, education, and healthcare.
                100% of our profits go towards their care and wellbeing. Thank you for sharing the love!
              </p>
            </CardContent>
          </Card>

          {/* Return to Home Button */}
          <div className="flex justify-center">
            <Link to="/">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Home className="h-5 w-5 mr-2" />
                Return to Home
              </Button>
            </Link>
          </div>

          {/* Additional Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link to="/shop">
              <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                <Heart className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                Contact Support
              </Button>
            </Link>
          </div>

          {/* Thank You Note */}
          <div className="mt-12 pt-8 border-t border-emerald-200">
            <p className="text-gray-600 text-lg">
              Thank you for choosing to share the love and make a positive impact!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;

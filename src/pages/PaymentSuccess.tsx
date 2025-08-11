import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Heart, ArrowRight, Mail, Download } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const paymentIntentId = searchParams.get('payment_intent'); // For backward compatibility
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Handle both Stripe Checkout Session and legacy Payment Intent
    const orderId = sessionId || paymentIntentId;

    if (orderId) {
      setOrderDetails({
        id: orderId,
        date: new Date().toLocaleDateString(),
        email: 'customer@example.com', // This would come from your backend
        type: sessionId ? 'checkout_session' : 'payment_intent',
      });
    }
  }, [sessionId, paymentIntentId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-emerald-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-emerald-800 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-emerald-700 max-w-2xl mx-auto">
              Thank you for your purchase! Your order has been confirmed and you'll receive
              an email confirmation shortly.
            </p>
          </div>

          {/* Order Details */}
          {orderDetails && (
            <Card className="border-emerald-200 mb-8 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-emerald-800">Order Confirmation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-medium">#{orderDetails.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{orderDetails.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {orderDetails.type === 'checkout_session' ? 'Session ID' : 'Payment ID'}
                    </p>
                    <p className="font-medium text-xs">{orderDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium text-emerald-600">Confirmed</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-4 border-t border-emerald-200">
                  <Mail className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-gray-600">
                    Confirmation email sent to your inbox
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-800 mb-2">64</div>
                  <p className="text-emerald-600">Orphans Supported</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-800 mb-2">100%</div>
                  <p className="text-emerald-600">Profits to Care</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-800 mb-2">10+</div>
                  <p className="text-emerald-600">Years of Service</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="border-emerald-200 mb-8 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-emerald-800">What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800">Order Processing</h4>
                  <p className="text-gray-600 text-sm">
                    We'll prepare your organic products with love and care within 1-2 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800">Shipping</h4>
                  <p className="text-gray-600 text-sm">
                    Your order will be shipped with tracking information sent to your email.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800">Enjoy & Share</h4>
                  <p className="text-gray-600 text-sm">
                    Experience our healing products and share your story with our community!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Heart className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/blog">
              <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                Read Our Stories
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Contact Support */}
          <div className="mt-12 pt-8 border-t border-emerald-200">
            <p className="text-gray-600 mb-4">
              Questions about your order? We're here to help!
            </p>
            <Link to="/contact">
              <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

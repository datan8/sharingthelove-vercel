import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, Heart, ArrowRight, RefreshCw, CreditCard } from "lucide-react";

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const paymentIntentId = searchParams.get('payment_intent');

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'card_declined':
        return 'Your card was declined. Please try a different payment method.';
      case 'insufficient_funds':
        return 'Insufficient funds. Please check your account balance or try a different card.';
      case 'expired_card':
        return 'Your card has expired. Please use a different payment method.';
      case 'incorrect_cvc':
        return 'The security code (CVC) is incorrect. Please check and try again.';
      case 'processing_error':
        return 'There was an error processing your payment. Please try again.';
      default:
        return 'We encountered an issue processing your payment. Please try again or contact support.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <XCircle className="h-24 w-24 text-red-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Payment Unsuccessful
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {getErrorMessage(error)}
            </p>
          </div>

          {/* Error Details */}
          {paymentIntentId && (
            <Card className="border-red-200 bg-red-50 mb-8 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-red-800">Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-left space-y-2">
                  <div>
                    <p className="text-sm text-red-600">Payment ID</p>
                    <p className="font-mono text-xs text-red-800">{paymentIntentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-red-600">Status</p>
                    <p className="font-medium text-red-800">Failed</p>
                  </div>
                  <div>
                    <p className="text-sm text-red-600">Time</p>
                    <p className="font-medium text-red-800">{new Date().toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Troubleshooting */}
          <Card className="border-emerald-200 mb-8 max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-emerald-800">Common Solutions</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-emerald-800 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Card Issues
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Check your card number and expiry date</li>
                    <li>• Verify the security code (CVC)</li>
                    <li>• Ensure sufficient funds are available</li>
                    <li>• Try a different card or payment method</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-emerald-800 flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Technical Issues
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Check your internet connection</li>
                    <li>• Clear your browser cache</li>
                    <li>• Try a different browser</li>
                    <li>• Contact your bank if issues persist</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission Reminder */}
          <Card className="border-emerald-200 bg-emerald-50 mb-8 max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
                <h2 className="text-2xl font-bold text-emerald-800">
                  Your Support Still Matters
                </h2>
              </div>
              <p className="text-emerald-700 text-lg leading-relaxed mb-6">
                Don't let this setback discourage you! 64 orphans in Vietnam are counting on
                supporters like you. Every purchase helps provide food, education, and healthcare.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-800 mb-2">64</div>
                  <p className="text-emerald-600">Orphans Waiting</p>
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/checkout">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Payment Again
              </Button>
            </Link>
            <Link to="/cart">
              <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                <ArrowRight className="h-5 w-5 mr-2" />
                Review Cart
              </Button>
            </Link>
          </div>

          {/* Alternative Actions */}
          <div className="space-y-4">
            <p className="text-gray-600">
              Or explore other ways to support our mission:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Browse Products
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Learn Our Story
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Get Support
                </Button>
              </Link>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Still having trouble? Our support team is here to help!
            </p>
            <Link to="/contact">
              <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                Contact Support Team
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              Reference ID: {paymentIntentId || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;

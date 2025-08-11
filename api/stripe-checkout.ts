import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const isStripeConfigured = stripeSecretKey &&
  stripeSecretKey !== 'sk_test_REPLACE_WITH_YOUR_ACTUAL_SECRET_KEY' &&
  !stripeSecretKey.includes('TYooMQauvdEDq54NiTphI7jx') &&
  (stripeSecretKey.startsWith('sk_test_') || stripeSecretKey.startsWith('sk_live_'));

let stripe: Stripe | null = null;

if (isStripeConfigured) {
  try {
    stripe = new Stripe(stripeSecretKey!, {
      apiVersion: '2023-10-16',
    });
    console.log(`[${new Date().toISOString()}] Stripe initialized for checkout sessions`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Failed to initialize Stripe:`, error);
  }
} else {
  console.warn(`[${new Date().toISOString()}] Stripe not configured for checkout sessions`);
}

interface CheckoutRequestBody {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    currency: string;
  }>;
  customer: {
    email: string;
    name: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  metadata?: Record<string, string>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed - only POST requests are supported'
    });
  }

  console.log(`[${new Date().toISOString()}] Checkout session request received`);

  // Check if Stripe is configured
  if (!stripe || !isStripeConfigured) {
    console.error(`[${new Date().toISOString()}] Stripe not configured for checkout`);
    return res.status(500).json({
      error: 'Payment system not configured. Please contact support.'
    });
  }

  try {
    const body: CheckoutRequestBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Validate request body
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({
        error: 'Cart items are required'
      });
    }

    if (!body.customer || !body.customer.email || !body.customer.name) {
      return res.status(400).json({
        error: 'Customer email and name are required'
      });
    }

    console.log(`[${new Date().toISOString()}] Creating checkout session for ${body.customer.email}`);
    console.log(`[${new Date().toISOString()}] Items: ${body.items.length} products`);

    // Create line items for Stripe Checkout
    const lineItems = body.items.map(item => {
      // Convert price from dollars to cents
      const unitAmount = Math.round(item.price * 100);

      return {
        price_data: {
          currency: item.currency || 'nzd',
          unit_amount: unitAmount,
          product_data: {
            name: item.name,
            metadata: {
              product_id: item.id,
            },
          },
        },
        quantity: item.quantity,
      };
    });

    // Calculate total for logging
    const total = body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log(`[${new Date().toISOString()}] Total amount: ${total.toFixed(2)} ${body.items[0]?.currency || 'NZD'}`);

    // Determine success and cancel URLs
    const baseUrl = req.headers.origin as string ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');

    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/cart`;

    console.log(`[${new Date().toISOString()}] Success URL: ${successUrl}`);
    console.log(`[${new Date().toISOString()}] Cancel URL: ${cancelUrl}`);

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: body.customer.email,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['NZ', 'AU', 'US', 'CA', 'GB', 'DE', 'FR', 'VN'],
      },
      metadata: {
        customer_name: body.customer.name,
        customer_email: body.customer.email,
        customer_country: body.customer.country || 'NZ',
        order_timestamp: new Date().toISOString(),
        session_source: 'website_checkout',
        ...body.metadata,
      },
      custom_text: {
        submit: {
          message: 'Supporting 64 orphans in Vietnam with every purchase!'
        }
      }
    });

    console.log(`[${new Date().toISOString()}] Checkout session created successfully: ${checkoutSession.id}`);
    console.log(`[${new Date().toISOString()}] Session URL: ${checkoutSession.url}`);

    return res.status(200).json({
      sessionId: checkoutSession.id,
      sessionUrl: checkoutSession.url,
      success: true
    });

  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] Checkout session creation error:`, error);

    // Provide specific error messages for common issues
    let errorMessage = 'Failed to create checkout session';

    if (error.type === 'StripeCardError') {
      errorMessage = 'Card error occurred';
    } else if (error.type === 'StripeRateLimitError') {
      errorMessage = 'Too many requests. Please try again in a moment.';
    } else if (error.type === 'StripeInvalidRequestError') {
      errorMessage = 'Invalid checkout data provided';
    } else if (error.type === 'StripeAPIError') {
      errorMessage = 'Payment system temporarily unavailable';
    } else if (error.type === 'StripeConnectionError') {
      errorMessage = 'Network error. Please check your connection.';
    } else if (error.type === 'StripeAuthenticationError') {
      errorMessage = 'Payment configuration error';
    }

    return res.status(500).json({
      error: errorMessage,
      details: error.message,
      success: false
    });
  }
}

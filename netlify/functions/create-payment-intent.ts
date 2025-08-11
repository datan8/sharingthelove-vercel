import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

// Initialize Stripe with STRICT environment variable usage (NO fallbacks)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Comprehensive environment debugging
console.log('🔍 Environment Debug Info:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- Available env vars:', Object.keys(process.env).filter(key => key.includes('STRIPE')));
console.log('- STRIPE_SECRET_KEY exists:', !!STRIPE_SECRET_KEY);
console.log('- STRIPE_SECRET_KEY length:', STRIPE_SECRET_KEY?.length || 0);

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is missing!');
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

const backendAccountId = STRIPE_SECRET_KEY.substring(8, 25);
console.log('🔑 Backend Stripe Key Account ID:', backendAccountId);

let stripe: Stripe;
try {
  stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });

  console.log('✅ Backend Stripe initialized with key:', STRIPE_SECRET_KEY.substring(0, 20) + '...');
  console.log('✅ Backend account ID:', backendAccountId);
  console.log('✅ Backend key format:', STRIPE_SECRET_KEY.substring(0, 7) + '...' + STRIPE_SECRET_KEY.substring(-4));
} catch (error) {
  console.error('❌ Failed to initialize Stripe:', error);
  throw error;
}

interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Check if Stripe is properly initialized
  if (!stripe) {
    console.error('❌ Stripe not initialized - missing STRIPE_SECRET_KEY environment variable');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Payment system configuration error - missing secret key',
        code: 'STRIPE_SECRET_KEY_MISSING'
      }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const { amount, currency = 'nzd', metadata = {}, items }: PaymentIntentRequest = JSON.parse(event.body);

    // Validate request
    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid amount is required' }),
      };
    }

    if (!items || items.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Cart items are required' }),
      };
    }

    // Calculate amount in cents
    const amountInCents = Math.round(amount * 100);

    // For amounts under $0.50, set minimum
    const minimumAmount = 50; // 50 cents minimum
    const finalAmount = Math.max(amountInCents, minimumAmount);

    // Create payment intent metadata with cart items
    const paymentMetadata = {
      ...metadata,
      cart_items: JSON.stringify(items),
      item_count: items.length.toString(),
      order_source: 'sharingthelove_website',
      original_amount: amountInCents.toString(),
      adjusted_amount: finalAmount.toString(),
    };

    console.log(`🚀 Creating NEW payment intent for ${finalAmount} cents (${currency})`);
    console.log('📦 Items:', items.map(item => `${item.name} x${item.quantity} @ ${item.price}`).join(', '));
    console.log('🔑 Using Stripe key account:', STRIPE_SECRET_KEY.substring(8, 25));

    // Add timestamp to ensure unique PaymentIntent
    const uniqueMetadata = {
      ...paymentMetadata,
      created_timestamp: Date.now().toString(),
      session_id: `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // Create payment intent with explicit card payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: currency.toLowerCase(),
      metadata: uniqueMetadata,
      payment_method_types: ['card'],
      description: `Sharing the Love - Order ${uniqueMetadata.session_id}`,
    });

    console.log(`✅ Payment intent created successfully: ${paymentIntent.id}`);
    const piAccountId = paymentIntent.id.substring(3, 20);
    console.log(`🔍 PaymentIntent account: ${piAccountId}`);
    console.log(`🔍 Backend account ID: ${backendAccountId}`);
    console.log(`🔍 Account IDs match: ${backendAccountId === piAccountId}`);
    console.log(`📊 PaymentIntent status: ${paymentIntent.status}`);
    console.log(`💰 Amount: ${paymentIntent.amount} ${paymentIntent.currency}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      }),
    };

  } catch (error) {
    console.error('Error creating payment intent:', error);

    // Handle Stripe errors specifically
    if (error instanceof Stripe.errors.StripeError) {
      console.error('Stripe error details:', {
        type: error.type,
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
      });

      // Provide user-friendly error messages for common Stripe errors
      let userMessage = error.message;
      if (error.type === 'StripeAuthenticationError') {
        userMessage = 'Payment system configuration error. Please contact support.';
      } else if (error.type === 'StripeAPIError') {
        userMessage = 'Payment service temporarily unavailable. Please try again later.';
      } else if (error.type === 'StripeConnectionError') {
        userMessage = 'Unable to connect to payment processor. Please check your connection and try again.';
      }

      return {
        statusCode: error.statusCode || 400,
        headers,
        body: JSON.stringify({
          error: userMessage,
          type: error.type,
          code: error.code,
          stripe_error: true,
        }),
      };
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid request format',
          code: 'INVALID_JSON',
        }),
      };
    }

    // Handle generic errors
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'INTERNAL_ERROR',
      }),
    };
  }
};

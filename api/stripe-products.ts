import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Check if Stripe secret key is properly configured
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const isStripeConfigured = stripeSecretKey &&
  stripeSecretKey !== 'sk_test_REPLACE_WITH_YOUR_ACTUAL_SECRET_KEY' &&
  !stripeSecretKey.includes('TYooMQauvdEDq54NiTphI7jx') &&
  (stripeSecretKey.startsWith('sk_test_') || stripeSecretKey.startsWith('sk_live_'));

let stripe: Stripe | null = null;

// Only initialize Stripe if we have valid keys
if (isStripeConfigured) {
  try {
    stripe = new Stripe(stripeSecretKey!, {
      apiVersion: '2023-10-16',
    });
    console.log('Stripe initialized successfully with key starting:', stripeSecretKey!.substring(0, 12) + '...');
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
  }
} else {
  console.warn('Stripe not configured - no products will be available. Key status:', {
    hasKey: !!stripeSecretKey,
    isPlaceholder: stripeSecretKey === 'sk_test_REPLACE_WITH_YOUR_ACTUAL_SECRET_KEY',
    keyPrefix: stripeSecretKey ? stripeSecretKey.substring(0, 7) + '...' : 'missing'
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // If Stripe is not configured, return empty products
  if (!stripe || !isStripeConfigured) {
    console.log('Stripe not configured - returning empty products');
    return res.status(200).json({
      success: true,
      products: [],
      source: 'empty',
      count: 0,
      message: 'No products available. Configure Stripe API keys to load products.',
      stripeConfigured: false,
    });
  }

  try {
    console.log('Fetching products from Stripe API...');

    // Fetch products from Stripe
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
      limit: 100,
    });

    console.log(`Found ${products.data.length} products in Stripe`);

    // Transform Stripe products to our format
    const transformedProducts = products.data
      .filter(product => product.default_price) // Only include products with prices
      .map(product => {
        const price = product.default_price as Stripe.Price;

        return {
          id: product.id,
          name: product.name,
          description: product.description || '',
          images: product.images || [],
          price: price.unit_amount ? price.unit_amount / 100 : 0,
          currency: price.currency || 'usd',
          category: product.metadata?.category || 'Organic Products',
          organic: product.metadata?.organic === 'true',
          featured: product.metadata?.featured === 'true',
          active: product.active,
          metadata: product.metadata || {},
          stripe_product_id: product.id,
          stripe_price_id: price.id,
        };
      });

    // Return products from Stripe (empty array if none found)
    const message = transformedProducts.length > 0
      ? `Successfully loaded ${transformedProducts.length} products from Stripe`
      : 'No products found in Stripe - add products to your Stripe dashboard';

    console.log(`Returning ${transformedProducts.length} products from Stripe`);

    return res.status(200).json({
      success: true,
      products: transformedProducts,
      source: 'stripe',
      count: transformedProducts.length,
      message,
      stripeConfigured: true,
    });

  } catch (error: any) {
    console.error('Error fetching products from Stripe:', error);

    // Provide specific error messages for common issues
    let errorMessage = 'Stripe API error';
    if (error.type === 'StripeAuthenticationError') {
      errorMessage = 'Invalid Stripe API key - please check your credentials';
    } else if (error.type === 'StripeAPIError') {
      errorMessage = 'Stripe API temporarily unavailable';
    } else if (error.message?.includes('api_key')) {
      errorMessage = 'Stripe API key configuration issue';
    }

    // Return empty products with error details
    return res.status(200).json({
      success: false,
      products: [],
      source: 'error',
      count: 0,
      error: errorMessage,
      stripeConfigured: isStripeConfigured,
      details: error.message,
    });
  }
}

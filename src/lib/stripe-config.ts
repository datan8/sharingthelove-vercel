import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { env } from './env';

// Stripe instance
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Validates the Stripe publishable key format
 */
function validateStripePublishableKey(key: string): boolean {
  if (!key) {
    console.warn('Stripe publishable key is missing');
    return false;
  }

  if (!key.startsWith('pk_')) {
    console.error('Invalid Stripe publishable key format. Must start with "pk_"');
    return false;
  }

  if (key.length < 50) {
    console.error('Stripe publishable key appears to be incomplete');
    return false;
  }

  return true;
}

/**
 * Gets or creates the Stripe instance
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = env.stripePublishableKey;

    if (!validateStripePublishableKey(publishableKey)) {
      console.error('Cannot initialize Stripe: Invalid publishable key');
      return Promise.resolve(null);
    }

    console.log('Initializing Stripe with key:', publishableKey.substring(0, 12) + '...');

    stripePromise = loadStripe(publishableKey, {
      // Stripe.js configuration options
      apiVersion: '2024-12-18.acacia',
      stripeAccount: undefined, // Use default account
    }).catch((error) => {
      console.error('Failed to load Stripe:', error);
      return null;
    });
  }

  return stripePromise;
};

/**
 * Checks if Stripe is properly configured
 */
export const isStripeAvailable = (): boolean => {
  return env.isStripeConfigured && !!env.stripePublishableKey;
};

/**
 * Gets Stripe configuration info for debugging
 */
export const getStripeConfig = () => {
  return {
    isConfigured: env.isStripeConfigured,
    hasPublishableKey: !!env.stripePublishableKey,
    keyPrefix: env.stripePublishableKey?.substring(0, 12) + '...',
    isTest: env.stripePublishableKey?.includes('test'),
  };
};

/**
 * Validates Stripe configuration on startup
 */
export const validateStripeConfig = (): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];

  if (!env.stripePublishableKey) {
    issues.push('Stripe publishable key is missing');
  } else if (!validateStripePublishableKey(env.stripePublishableKey)) {
    issues.push('Stripe publishable key format is invalid');
  }

  // Check if we're in test mode
  if (env.stripePublishableKey?.includes('test')) {
    console.info('Stripe is running in TEST mode');
  } else if (env.stripePublishableKey?.includes('live')) {
    console.info('Stripe is running in LIVE mode');
  }

  return {
    valid: issues.length === 0,
    issues
  };
};

// Validate configuration on module load
const validation = validateStripeConfig();
if (!validation.valid) {
  console.warn('Stripe configuration issues:', validation.issues);
} else {
  console.log('Stripe configuration is valid');
}

export default getStripe;

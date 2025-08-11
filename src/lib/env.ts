// Environment variable validation
function validateStripeKeys() {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.warn('No Stripe publishable key found. Stripe functionality will be disabled.');
    return false;
  }

  if (!publishableKey.startsWith('pk_')) {
    console.error('Invalid Stripe publishable key format. Must start with "pk_"');
    return false;
  }

  return true;
}

// Debug log to check environment variables
console.log('Environment variables in env.ts:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_AZURE_FUNCTION_KEY: import.meta.env.VITE_AZURE_FUNCTION_KEY ? '***' : undefined,
  STRIPE_PUBLISHABLE_KEY: (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)?.substring(0, 12) + '...',
  MODE: import.meta.env.MODE,
});

if (!import.meta.env.VITE_API_BASE_URL) {
  console.error('VITE_API_BASE_URL is not defined in environment variables!');
}

// Validate Stripe configuration
const isStripeConfigured = validateStripeKeys();

// Environment configuration
export const env = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '', // Remove trailing slash if present
  azureFunctionKey: import.meta.env.VITE_AZURE_FUNCTION_KEY || '',

  // Email Configuration
  sendGridFromEmail: import.meta.env.VITE_SENDGRID_FROM_EMAIL || 'noreply@example.com',
  sendGridToEmail: import.meta.env.VITE_SENDGRID_TO_EMAIL || 'admin@example.com',

  // WordPress Configuration
  wordPressSite: import.meta.env.VITE_WORDPRESS_SITE || 'your-site',
  wordPressApiBase: import.meta.env.VITE_WORDPRESS_API_BASE || 'https://your-wordpress-site.com',
  wordPressPostsPerPage: Number.parseInt(import.meta.env.VITE_WORDPRESS_POSTS_PER_PAGE || '10'),

  // Feature Flags
  enableNewsletter: import.meta.env.VITE_ENABLE_NEWSLETTER === 'true',
  enableFaq: import.meta.env.VITE_ENABLE_FAQ === 'true',

  // Contact Information
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'info@example.com',
  contactPhone: import.meta.env.VITE_CONTACT_PHONE || '+1 (234) 567-890',
  contactAddress: {
    line1: import.meta.env.VITE_CONTACT_ADDRESS_LINE1 || '123 Main Street',
    suburb: import.meta.env.VITE_CONTACT_ADDRESS_SUBURB || 'Suite 100',
    city: import.meta.env.VITE_CONTACT_ADDRESS_CITY || 'City',
    postcode: import.meta.env.VITE_CONTACT_ADDRESS_POSTCODE || '12345',
  },

  // Stripe Configuration (supports both VITE_ and NEXT_PUBLIC_ prefixes)
  stripePublishableKey: import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  isStripeConfigured,
} as const;

// Debug log to check environment variables
console.log('Environment Variables:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  NODE_ENV: import.meta.env.MODE,
});

// Type-safe environment variables
declare global {
  interface ImportMetaEnv {
    VITE_API_BASE_URL?: string;
    VITE_AZURE_FUNCTION_KEY?: string;
    VITE_SENDGRID_FROM_EMAIL?: string;
    VITE_SENDGRID_TO_EMAIL?: string;
    VITE_WORDPRESS_SITE?: string;
    VITE_WORDPRESS_API_BASE?: string;
    VITE_WORDPRESS_POSTS_PER_PAGE?: string;
    VITE_ENABLE_NEWSLETTER?: string;
    VITE_ENABLE_FAQ?: string;
    VITE_CONTACT_EMAIL?: string;
    VITE_CONTACT_PHONE?: string;
    VITE_CONTACT_ADDRESS_LINE1?: string;
    VITE_CONTACT_ADDRESS_SUBURB?: string;
    VITE_CONTACT_ADDRESS_CITY?: string;
    VITE_CONTACT_ADDRESS_POSTCODE?: string;
    VITE_STRIPE_PUBLISHABLE_KEY?: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
    NEXT_PUBLIC_DOMAIN?: string;
  }
}

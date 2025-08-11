import { getStripe, isStripeAvailable, getStripeConfig } from './stripe-config';

// Export the Stripe promise for backward compatibility
export const stripePromise = getStripe();

// Export Stripe utilities
export { isStripeAvailable, getStripeConfig };

// Stripe product configuration for the charity store
export const products = [
  {
    id: 'vietnamese-coffee',
    name: 'Premium Vietnamese Coffee',
    price: 2499, // $24.99 in cents
    currency: 'usd',
    description: 'Ethically sourced Vietnamese coffee beans supporting local farmers',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop',
  },
  {
    id: 'organic-tea-blend',
    name: 'Organic Tea Blend',
    price: 1899, // $18.99 in cents
    currency: 'usd',
    description: 'Healing herbal tea blend made with traditional Vietnamese ingredients',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  },
  {
    id: 'handmade-wellness-oil',
    name: 'Handmade Wellness Oil',
    price: 3299, // $32.99 in cents
    currency: 'usd',
    description: 'Traditional Vietnamese wellness oil crafted by local artisans',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=500&fit=crop',
  },
  {
    id: 'natural-skincare-set',
    name: 'Natural Skincare Set',
    price: 4599, // $45.99 in cents
    currency: 'usd',
    description: 'Complete skincare set with natural ingredients from Vietnam',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop',
  },
];

// Helper function to format price for display
export const formatPrice = (priceInCents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceInCents / 100);
};

// Helper function to create checkout session (this would typically call your backend)
export const createCheckoutSession = async (items: { id: string; quantity: number }[]) => {
  // For now, we'll redirect to Stripe Checkout
  // In production, you'd call your backend API to create a checkout session

  const lineItems = items.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) throw new Error(`Product ${item.id} not found`);

    return {
      price_data: {
        currency: product.currency,
        product_data: {
          name: product.name,
          description: product.description,
          images: [product.image],
        },
        unit_amount: product.price,
      },
      quantity: item.quantity,
    };
  });

  return {
    lineItems,
    mode: 'payment',
    success_url: `${window.location.origin}/shop?success=true`,
    cancel_url: `${window.location.origin}/shop?canceled=true`,
  };
};

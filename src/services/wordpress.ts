import type { BlogPost } from '../types/blog';
import { env } from '../lib/env';

// Get environment variables from centralized config
const WORDPRESS_API_BASE = env.wordPressApiBase;
const WORDPRESS_SITE = env.wordPressSite;
const POSTS_PER_PAGE = env.wordPressPostsPerPage;

// Minimal fallback categories when WordPress is unavailable
const fallbackCategories = ['All', 'Mission Stories', 'Community Impact'];

// Debug log to check environment variables
console.log('WordPress API Configuration:', {
  WORDPRESS_API_BASE,
  WORDPRESS_SITE,
  POSTS_PER_PAGE,
  NODE_ENV: import.meta.env.MODE,
  BASE_URL: import.meta.env.BASE_URL
});

// Helper function to get the correct image URL
function getImageUrl(media: any): string {
  if (!media) return 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';

  // Try to get the medium size image first, fallback to full size
  const imageUrl = media.media_details?.sizes?.medium?.source_url ||
                  media.media_details?.sizes?.large?.source_url ||
                  media.source_url;

  // If the image URL is relative, prepend the WordPress API base URL
  if (imageUrl && !imageUrl.startsWith('http')) {
    return `${WORDPRESS_API_BASE}${imageUrl}`;
  }

  return imageUrl || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
}

export async function fetchBlogPosts(page = 1): Promise<BlogPost[]> {
  // Add cache busting parameter to force fresh data
  const cacheBuster = new Date().getTime();
  const apiUrl = `${WORDPRESS_API_BASE}/wp-json/wp/v2/posts?page=${page}&per_page=${POSTS_PER_PAGE}&_embed&_t=${cacheBuster}`;
  console.log('Fetching blog posts from WordPress API:', apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    console.log('WordPress API response status:', response.status);
    console.log('WordPress API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.warn(`WordPress API not available (${response.status} ${response.statusText}), returning empty array`);
      return [];
    }

    const posts = await response.json();
    console.log('Raw posts from WordPress:', posts.length, 'posts received');

    // If no posts or empty array, return empty array
    if (!posts || posts.length === 0) {
      console.warn('No posts returned from WordPress API, returning empty array');
      return [];
    }

    console.log('Sample WordPress post:', {
      id: posts[0]?.id,
      title: posts[0]?.title?.rendered,
      date: posts[0]?.date,
      author: posts[0]?._embedded?.author?.[0]?.name,
      featured_media: posts[0]?.featured_media,
    });

    const transformedPosts = posts.map((post: any) => {
      const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
      console.log(`Processing post ${post.id}: ${post.title?.rendered}`);

      // Get category name from embedded data
      const categories = post._embedded?.['wp:term']?.[0] || [];
      const categoryName = categories.length > 0 ? categories[0].name : 'Mission Stories';

      // Calculate read time based on content length
      const contentText = post.content.rendered.replace(/<[^>]*>/g, '');
      const wordCount = contentText.split(/\s+/).filter((word: string) => word.length > 0).length;
      const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} minute read`;

      // Clean excerpt
      const cleanExcerpt = post.excerpt.rendered
        .replace(/<[^>]*>/g, '')
        .replace(/\[&hellip;\]/g, '...')
        .substring(0, 200)
        .trim();

      return {
        id: post.id.toString(),
        title: post.title.rendered,
        slug: post.slug,
        excerpt: cleanExcerpt + (cleanExcerpt.length < 200 ? '' : '...'),
        content: post.content.rendered,
        author: post._embedded?.author?.[0]?.name || 'Sharing the Love Team',
        date: new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        readTime,
        category: categoryName,
        image: getImageUrl(featuredMedia),
      };
    });

    console.log('Successfully transformed WordPress posts:', transformedPosts.length);
    return transformedPosts;

  } catch (error) {
    console.error('Error fetching blog posts from WordPress API:', error);
    console.log('Returning empty array due to API error');
    return [];
  }
}

export async function fetchCategories(): Promise<string[]> {
  // Add cache busting parameter
  const cacheBuster = new Date().getTime();
  const apiUrl = `${WORDPRESS_API_BASE}/wp-json/wp/v2/categories?_t=${cacheBuster}`;
  console.log('Fetching categories from WordPress API:', apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    console.log('WordPress categories API response status:', response.status);

    if (!response.ok) {
      console.warn(`WordPress categories API not available (${response.status}), using fallback categories`);
      return fallbackCategories;
    }

    const categories = await response.json();
    console.log('WordPress categories received:', categories.length);

    if (!categories || categories.length === 0) {
      console.warn('No categories returned from WordPress API, using fallback categories');
      return fallbackCategories;
    }

    const categoryNames = ['All', ...categories.map((cat: any) => cat.name)];
    console.log('WordPress categories transformed:', categoryNames);
    return categoryNames;

  } catch (error) {
    console.error('Error fetching categories:', error);
    console.log('Using fallback categories due to API error');
    return fallbackCategories;
  }
}

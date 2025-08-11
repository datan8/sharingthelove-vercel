import type { BlogPost } from "@/types/blog";
import { env } from "@/lib/env";

// WordPress configuration
export const WORDPRESS_API_BASE = env.wordPressApiBase;
export const WORDPRESS_SITE = env.wordPressSite;

// Fallback blog data matching the services/wordpress.ts data
const fallbackBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: '30 Day Transformation Series Day 1',
    slug: '30-day-transformation-series-day-1',
    excerpt: 'Welcome, beautiful soul. If you\'ve landed here, maybe you\'ve been feeling it too — that heavy stuckness, the lack of motivation, the quiet knowing that something has to shift. You\'re not alone.',
    content: `<p><strong>Day 1: Recommitting to Myself – A 30-Day Challenge Begins</strong></p>

    <p>Welcome, beautiful soul. If you've landed here, maybe you've been feeling it too — that heavy stuckness, the lack of motivation, the quiet knowing that something has to shift. You're not alone.</p>

    <p>Today marks <strong>Day 1 of my 30-day challenge</strong> — a personal commitment to show up for myself, reconnect with my purpose, and prioritise my health, mindset, and wellbeing. This isn't about perfection or pressure. It's about creating <em>momentum</em>, one step at a time.</p>

    <h3>Why I'm Doing This</h3>

    <p>Lately, I've been feeling flat. A bit disconnected. Unmotivated. And instead of spiralling or waiting for the "right moment," I've decided to do something powerful: <strong>take action anyway.</strong></p>

    <p>Sometimes we wait for motivation to arrive before we start — but the truth is, <em>momentum creates motivation</em>. So this challenge is my way of gently but firmly moving forward again, even through the resistance.</p>

    <h3>What This Challenge Is About</h3>

    <p>Over the next 30 days, I'll be sharing the real journey — the ups, the hard days, the breakthroughs, and the small wins that make it all worth it. Each day, I'll commit to showing up for my growth, whether that's through mindset work, nourishing choices, movement, or moments of reflection.</p>

    <p>Today, I'm focusing on <strong>setting clear intentions</strong>, getting honest about what I truly want, and reconnecting with my <strong>WHY</strong> — that deep inner reason that fuels lasting change.</p>

    <h3>Join Me</h3>

    <p>If you're feeling stuck too, this is your invitation. It's not too late. You don't have to do everything at once — <strong>just one small promise to yourself each day</strong> can begin to shift everything.</p>

    <p>So, I'll ask you this: <strong>What's ONE thing you want to commit to for the next 30 days?</strong> Something just for you — something that nourishes your soul and brings you closer to the version of yourself you're becoming.</p>

    <p>Let's walk this path together. Subscribe, check back in, or follow along on my socials. We're just getting started 🌟</p>

    <p>With love and Belief,</p>

    <p><strong>Lisa Cerise</strong></p>

    <p>xo</p>`,
    author: 'Lisa Cerise',
    date: 'July 1, 2025',
    readTime: '4 minute read',
    category: 'Personal Growth',
    image: 'https://ext.same-assets.com/3511000673/1524587081.jpeg'
  },
  {
    id: '2',
    title: 'Sharing the Love Vietnam: compassion in action from Hà Nội to Aotearoa',
    slug: 'sharing-the-love-vietnam-compassion-in-action-from-ha-noi-to-aotearoa',
    excerpt: 'When we talk about "grass-roots" charity work, Sharing the Love Vietnam is a textbook example. Founded in 2017 by Aucklander Wendi Pavlovich and her Vietnamese friend Dung Nguyến, the volunteer-run organisation set out to brighten life for orphans, street children, and rough-sleepers in Hà Nội.',
    content: `<p>When we talk about "grass-roots" charity work, Sharing the Love Vietnam is a textbook example. Founded in 2017 by Aucklander <strong>Wendi Pavlovich</strong> and her Vietnamese friend <strong>Dung Nguyen</strong>, the volunteer-run organisation set out to brighten life for orphans, street children, and rough-sleepers in Hà Nội. Their guiding idea is simple: every act of kindness matters, and every dollar donated should reach the people who need it.</p>

    <h3>A grass-roots beginning</h3>

    <p>Wendi first visited <strong>Bồ Đề Pagoda</strong>, an eighteenth-century Buddhist temple in Long Biên District that doubles as a refuge for abandoned children and destitute adults. The visit was life-changing. Within months she resigned from her full-time job in Tāmaki Makaurau, moved back to Việt Nam, and teamed up with Dung to register.</p>

    <p>The pair insisted on a transparent model: no paid staff, no administration fees, and public accounting for every gift. That pledge still stands.</p>

    <h3>Where the magic happens</h3>

    <p>Bồ Đề Pagoda now shelters <strong>more than fifty children</strong>, and at times the number has risen to <strong>well over one hundred</strong>. It also provides space for about twenty elderly and homeless adults.</p>

    <p>Space is tight. Three small dormitories serve as bedroom, classroom, and play area. Food is grown on site or bought daily at dawn markets, and the children's clothes sit in a communal pile.</p>

    <h3>More than meals: nurturing body, mind, and soul</h3>

    <ul>
      <li><strong>Daily nourishment</strong> – Volunteers shop at first light, cook in the pagoda kitchen, and serve hot, protein-rich meals to every resident. When funds allow they fill motorbike panniers with extra rice boxes and fan out across Hà Nội to reach rough-sleepers under bridges and beside railway tracks</li>
      <li><strong>Education first</strong> – School fees average <strong>US$60 a month per child</strong>, a huge burden for the pagoda, so the charity covers tuition, textbooks, and lunchtime meals</li>
      <li><strong>Special days</strong> – From Children's Day picnics to simple birthday cakes, Sharing the Love stages small celebrations that remind each child he or she is valued</li>
      <li><strong>Early-years care</strong> – Two double push-chairs, bought with donor funds, now let carers wheel babies into the courtyard for sunshine and fresh air</li>
    </ul>

    <h3>A model of transparency</h3>

    <p>Because the team is entirely volunteer-based, <strong>every cent</strong> donated buys food, nappies, medicine, school supplies, or shelter upgrades. Wendi publishes spending records and photographs after each supply run to keep supporters in the loop.</p>

    <h3>How you can share the love</h3>

    <ol>
      <li><strong>Donate</strong> – The original Givealittle campaign is closed, but the organisation still receives direct transfers and local cash gifts.</li>
      <li><strong>Volunteer on the ground</strong> – Travellers with a week or more to spare can cook, teach English, or organise craft sessions. Contact Dung in Hà Nội on <strong>+84 (0) 169 959 6167</strong> for current needs</li>
      <li><strong>Spread the word</strong> – Follow <em>Sharing the Love Vietnam</em> on Facebook, share their posts, and tell friends about community-driven aid that works.</li>
    </ol>

    <h3>Final thoughts</h3>

    <p>Sharing the Love Vietnam reminds us that effective charity need not be huge, corporate, or complicated. It can be two friends, a borrowed kitchen, and a promise that kindness will travel further than we imagine. From a centuries-old pagoda on the banks of the Red River to kitchens and classrooms across Hà Nội, the organisation proves that when we share what we have, hope multiplies.</p>

    <p>Whether you give five dollars, a fortnight of your time, or simply a social-media share, you become part of a quiet revolution of empathy. And that is worth celebrating.</p>`,
    author: 'Sharing the Love Team',
    date: 'June 26, 2025',
    readTime: '6 minute read',
    category: 'Mission Stories',
    image: 'https://ext.same-assets.com/3511000673/3941382460.jpeg'
  }
];

export async function fetchWordPressAPI(endpoint: string) {
  try {
    const response = await fetch(`${WORDPRESS_API_BASE}/wp-json/wp/v2/${endpoint}`);
    if (!response.ok) {
      console.warn(`WordPress API not available for ${endpoint} (${response.status})`);
      throw new Error(`Failed to fetch ${endpoint}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching WordPress API ${endpoint}:`, error);
    throw error;
  }
}

function getImageUrl(post: any): string {
  console.log('Getting image URL for post:', post.title?.rendered);
  console.log('Post featured media:', post._embedded?.['wp:featuredmedia']);

  // Try to get the featured image URL
  if (post._embedded?.['wp:featuredmedia']?.[0]) {
    const media = post._embedded['wp:featuredmedia'][0];
    console.log('Media object:', media);
    console.log('Media details:', media.media_details);
    console.log('Media sizes:', media.media_details?.sizes);

    // Try different possible image URL locations
    const possibleUrls = [
      media.source_url,
      media.media_details?.sizes?.full?.source_url,
      media.media_details?.sizes?.large?.source_url,
      media.media_details?.sizes?.medium_large?.source_url,
      media.media_details?.sizes?.medium?.source_url,
      media.guid?.rendered,
      media.link,
      // Try direct URL from media_details
      media.media_details?.file ? `${WORDPRESS_API_BASE}/wp-content/uploads/${media.media_details.file}` : null
    ];

    console.log('Possible URLs:', possibleUrls);

    // Find the first valid URL
    const imageUrl = possibleUrls.find(url => url && typeof url === 'string');
    if (imageUrl) {
      console.log('Found image URL:', imageUrl);
      return imageUrl;
    }
  } else {
    console.log('No featured media found in post');
    // Try to find image in content
    const content = post.content?.rendered || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      console.log('Found image in content:', imgMatch[1]);
      return imgMatch[1];
    }
  }

  // If no image found, return the placeholder
  console.log('No image found, using placeholder');
  return '/images/hero-bg.jpg';
}

function transformPost(post: any): BlogPost {
  console.log('Transforming post:', post.title?.rendered);

  const transformedPost = {
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    excerpt: post.excerpt.rendered,
    content: post.content.rendered,
    date: new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    readTime: `${Math.ceil(post.content.rendered.split(' ').length / 200)} min read`,
    author: post._embedded?.author?.[0]?.name || 'Unknown Author',
    image: getImageUrl(post),
    category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized'
  };

  console.log('Transformed post:', transformedPost);
  return transformedPost;
}

export async function getPosts(page = 1, perPage = env.wordPressPostsPerPage): Promise<{ posts: BlogPost[]; totalPages: number }> {
  try {
    const posts = await fetchWordPressAPI(`posts?page=${page}&per_page=${perPage}&_embed`);
    const totalPages = Number.parseInt(posts.headers?.get('X-WP-TotalPages') || '1');

    return {
      posts: posts.map((post: any) => ({
        id: post.id.toString(),
        title: post.title.rendered,
        slug: post.slug,
        excerpt: stripHtml(post.excerpt.rendered),
        content: post.content.rendered,
        date: new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        readTime: `${Math.ceil(post.content.rendered.split(' ').length / 200)} minute read`,
        author: post._embedded?.author?.[0]?.name || 'Sharing the Love Team',
        image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || getImageUrl(post),
        category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized',
      })),
      totalPages,
    };
  } catch (error) {
    console.error('Error fetching WordPress posts, using fallback data:', error);
    return {
      posts: fallbackBlogPosts,
      totalPages: 1
    };
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await fetchWordPressAPI(`posts?slug=${slug}&_embed`);
    if (posts.length === 0) {
      // Try to find in fallback data
      const fallbackPost = fallbackBlogPosts.find(post => post.slug === slug);
      return fallbackPost || null;
    }

    const post = posts[0];
    return {
      id: post.id.toString(),
      title: post.title.rendered,
      slug: post.slug,
      excerpt: stripHtml(post.excerpt.rendered),
      content: post.content.rendered,
      date: new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      readTime: `${Math.ceil(post.content.rendered.split(' ').length / 200)} minute read`,
      author: post._embedded?.author?.[0]?.name || 'Sharing the Love Team',
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || getImageUrl(post),
      category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized',
    };
  } catch (error) {
    console.error(`Error fetching WordPress post ${slug}, checking fallback data:`, error);
    // Return from fallback data if WordPress API fails
    const fallbackPost = fallbackBlogPosts.find(post => post.slug === slug);
    return fallbackPost || null;
  }
}

export async function getPages() {
  try {
    return await fetchWordPressAPI('pages');
  } catch (error) {
    console.error('Error fetching WordPress pages:', error);
    return [];
  }
}

export async function getPage(slug: string) {
  try {
    const pages = await fetchWordPressAPI(`pages?slug=${slug}`);
    return pages[0];
  } catch (error) {
    console.error('Error fetching WordPress page:', error);
    return null;
  }
}

// Helper function to strip HTML tags
function stripHtml(html: string): string {
  if (typeof document !== 'undefined') {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
  // Fallback for server-side rendering
  return html.replace(/<[^>]*>/g, '');
}

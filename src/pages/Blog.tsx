import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Clock, User, BookOpen, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BlogPost, FAQ } from "../types/blog";
import { fetchBlogPosts, fetchCategories } from "../services/wordpress";
import { Link } from "react-router-dom";
import { env } from "@/lib/env";

const faqs: FAQ[] = [
  {
    question: "How do I get started with Sharing the Love?",
    answer: "Getting started is easy! Browse our organic healing products on our shop page, or contact us to learn more about our mission. Every purchase supports vulnerable communities in Vietnam."
  },
  {
    question: "What products do you offer?",
    answer: "We offer a range of organic healing products including body balms, candles, room sprays, and wellness products. All our products are crafted with natural ingredients and created with love to support your wellbeing."
  },
  {
    question: "How long does shipping typically take?",
    answer: "We process orders within 1-2 business days and shipping typically takes 3-7 business days depending on your location. We'll provide tracking information so you can follow your order's journey to you."
  },
  {
    question: "How can I learn more about your mission in Vietnam?",
    answer: "We'd love to share more about our impact! Visit our About page to learn about the communities we support, or contact us directly. We're transparent about how 100% of our profits create positive change."
  },
  {
    question: "What makes Sharing the Love different from other organizations?",
    answer: "Our commitment to 100% transparency and donating all profits to vulnerable Vietnamese communities sets us apart. We focus on creating organic, healing products while building a better world through meaningful impact."
  },
  {
    question: "How do you handle customer support?",
    answer: "We pride ourselves on excellent customer support. You can reach us via phone, email, or through our contact form, and we typically respond within 24 hours."
  },
  {
    question: "Can I see examples of your AI work?",
    answer: "Absolutely! We'd be happy to share case studies and examples relevant to your needs. Contact us to learn more about our past AI projects and success stories."
  },
  {
    question: "What are your payment terms?",
    answer: "We offer flexible payment options to suit different needs. We'll discuss payment terms during our initial consultation and ensure everything is clear before we begin."
  }
];

interface BlogCardProps {
  post: BlogPost;
}

function BlogCard({ post }: BlogCardProps) {
  return (
    <Link to={`/blog/${post.slug}`} className="block h-full">
      <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/hero-bg.jpg';
            }}
          />
        </div>
        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
              {post.category}
            </span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </div>
          </div>
          <h3 className="text-xl font-bold text-emerald-800 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author}
            </div>
            <span>{post.date}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface FAQItemProps {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <button
        className="w-full px-6 py-4 text-left bg-white hover:bg-emerald-50 flex justify-between items-center transition-colors rounded-t-lg"
        onClick={onToggle}
      >
        <h3 className="font-semibold text-lg text-emerald-800">{faq.question}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-emerald-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-emerald-600 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-emerald-50 border-t border-emerald-200 rounded-b-lg">
          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </Card>
  );
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Blog: Starting to load fresh WordPress data...');

        const [posts, cats] = await Promise.all([
          fetchBlogPosts(),
          fetchCategories()
        ]);

        console.log('Blog: Received posts:', posts.length, 'categories:', cats.length);
        setBlogPosts(posts);
        setCategories(cats);
        setError(null);
        console.log('Blog: Successfully loaded WordPress data');
      } catch (err) {
        console.error('Blog: Error loading blog data:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshKey]); // Add refreshKey as dependency

  const filteredPosts = selectedCategory === "All"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleRefresh = () => {
    console.log('Blog: Manual refresh triggered');
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-emerald-800 mb-6">
            Our Blog
          </h1>
          <p className="text-xl text-emerald-700 leading-relaxed">
            Insights, updates, and stories from our mission to create positive change
            through organic healing products and community support.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Featured Blog Posts */}
          <Card className="border-emerald-200 shadow-lg mb-12">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-emerald-600 mr-3" />
                  <h2 className="text-3xl font-bold text-emerald-800">Latest Articles</h2>
                </div>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                        : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" />
                  <p className="mt-4 text-emerald-700">Loading fresh articles from WordPress...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={handleRefresh} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Try Again
                  </Button>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-emerald-700">No articles found for this category.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-emerald-600">
                      Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                      {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Newsletter Signup */}
          <Card className="border-emerald-200 shadow-lg mb-12">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <MessageSquare className="h-8 w-8 text-emerald-600 mr-3" />
                <h2 className="text-3xl font-bold text-emerald-800">Stay Connected</h2>
              </div>
              <p className="text-emerald-700 mb-6 max-w-2xl">
                Get the latest insights about our organic products, mission updates,
                and stories from the communities we support delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 border-emerald-200 focus:border-emerald-500"
                />
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section - Only show if enabled */}
          {env.enableFaq && (
            <Card className="border-emerald-200 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-emerald-800 mb-4">Frequently Asked Questions</h2>
                  <p className="text-emerald-700 max-w-2xl mx-auto">
                    Find answers to common questions about our organic products,
                    mission, and how your purchase creates positive change.
                  </p>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <FAQItem
                      key={index}
                      faq={faq}
                      isOpen={openFAQ === index}
                      onToggle={() => toggleFAQ(index)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeroCarousel from "@/components/layout/HeroCarousel";
import { ArrowRight, Star, Heart, Leaf, Users, ShoppingBag, Plus, Check } from "lucide-react";
import { productsService, formatPrice, getProductImage, type Product } from "@/services/products";
import { useCart } from "@/contexts/CartContext";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsSource, setProductsSource] = useState<string>('');
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});
  const { addItem, getItemQuantity } = useCart();

  // Fetch featured products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        // Force refresh to clear cache and get latest Stripe data
        const response = await productsService.fetchProducts(true);
        const featured = response.products.filter(product => product.featured && product.active);
        setFeaturedProducts(featured);
        setProductsSource(response.source || "unknown");
        console.log(`Loaded ${featured.length} featured products from ${response.source}`);
        console.log('Featured products:', featured);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setAddedToCart(prev => ({ ...prev, [product.id]: true }));

    // Reset the "added" state after 2 seconds
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const testimonials = [
    {
      name: "Sarah Chen",
      text: "The lavender balm is absolutely amazing! It's so soothing and I love knowing that my purchase is helping communities in Vietnam.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Maria Rodriguez",
      text: "These candles create the most peaceful atmosphere. The quality is incredible and the mission behind it makes it even more special.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "David Thompson",
      text: "I've been using the room sprays for months. They smell amazing and knowing I'm supporting a good cause makes me feel great about every purchase.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Emily Johnson",
      text: "The organic ingredients really make a difference. My skin feels so much healthier and I'm proud to support vulnerable communities.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1669013820667-8297ba00c6c6?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Michael Park",
      text: "Sharing the Love products have become an essential part of my self-care routine. Great quality and an even greater cause!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Mission Impact */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-8">
              Healing Bodies, Healing Communities
            </h2>
            <p className="text-xl text-emerald-700 mb-16 max-w-4xl mx-auto leading-relaxed">
              Your purchase nourishes you and empowers sixty-four beautiful young lives in
              Viet Nam. Our carefully curated organic products nurture your wellbeing while
              100% of profits fund food, education and healthcare for the orphans we've
              supported for more than ten years.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-emerald-200 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <Leaf className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-emerald-800 mb-3">100% Organic</h3>
                  <p className="text-gray-600">
                    Carefully sourced natural ingredients for pure, healing wellness products
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <Heart className="h-16 w-16 text-rose-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-emerald-800 mb-3">Funds Orphans' Care</h3>
                  <p className="text-gray-600">
                    Every purchase directly supports sixty-four orphans with food, education and healthcare
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <Users className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-emerald-800 mb-3">500+ Families Helped</h3>
                  <p className="text-gray-600">
                    Making a real difference through education, healthcare, and opportunity
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-emerald-800 mb-6">
                Featured Healing Products
              </h2>
              <p className="text-xl text-emerald-700 max-w-2xl mx-auto">
                Discover our carefully crafted organic wellness collection
              </p>
              {productsSource && (
                <p className="text-sm text-emerald-600 mt-2">
                  Products loaded from: {productsSource === 'stripe' ? 'Stripe' : 'Local backup'}
                </p>
              )}
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[1, 2, 3].map((_, index) => (
                  <Card key={index} className="border-emerald-200 animate-pulse">
                    <CardHeader className="p-0">
                      <div className="h-64 bg-emerald-100 rounded-t-lg" />
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-6 bg-emerald-100 rounded mb-2" />
                      <div className="h-4 bg-emerald-50 rounded mb-4" />
                      <div className="flex items-center justify-between">
                        <div className="h-8 w-20 bg-emerald-100 rounded" />
                        <div className="h-10 w-32 bg-emerald-100 rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {featuredProducts.map((product) => (
                  <Card key={product.id} className="border-emerald-200 hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/hero-bg.jpg';
                          }}
                        />
                        {product.organic && (
                          <div className="absolute top-4 right-4">
                            <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              Organic
                            </div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <CardTitle className="text-xl text-emerald-800 mb-2">
                        {product.name}
                      </CardTitle>
                      <p className="text-gray-600 mb-4 text-sm">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-emerald-700">
                          {formatPrice(product.price, product.currency)}
                        </span>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className={`transition-all duration-300 ${
                            addedToCart[product.id]
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-emerald-600 hover:bg-emerald-700'
                          } text-white`}
                        >
                          {addedToCart[product.id] ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Added!
                            </>
                          ) : getItemQuantity(product.id) > 0 ? (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Add More ({getItemQuantity(product.id)})
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="text-center">
              <Link to="/shop">
                <Button size="lg" className="bg-transparent border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600">
                  Browse All Organics
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-emerald-800 mb-6">
                What Our Community Says
              </h2>
              <p className="text-xl text-emerald-700">
                Real stories from our customers who are spreading love and healing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <Card key={index} className="border-emerald-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-emerald-800">{testimonial.name}</h3>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional testimonials for larger screens */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-8 mt-8">
              {testimonials.slice(3, 5).map((testimonial, index) => (
                <Card key={index + 3} className="border-emerald-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-emerald-800">{testimonial.name}</h3>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Support Our Cause Banner */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Join Us in Sharing the Love
            </h2>
            <p className="text-xl mb-8 leading-relaxed">
              Shop with purpose and make a difference. Together, we're providing food, education and healthcare
              for sixty-four orphans in Viet Nam through your conscious purchasing choices.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">64</div>
                <p className="text-emerald-100">Orphans Supported</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">100%</div>
                <p className="text-emerald-100">Profits to Care</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10+</div>
                <p className="text-emerald-100">Years of Service</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button size="lg" className="bg-transparent border-2 border-emerald-400 text-white hover:bg-emerald-600 hover:border-emerald-600">
                  <Heart className="h-5 w-5 mr-2" />
                  Browse Organics
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" className="bg-transparent border-2 border-emerald-400 text-white hover:bg-emerald-600 hover:border-emerald-600">
                  Learn Our Story
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

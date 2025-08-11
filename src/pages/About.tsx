import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Leaf, Star } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-emerald-800 mb-6">
            About Sharing the Love
          </h1>
          <p className="text-xl text-emerald-700 leading-relaxed">
            Premium organic products that transform lives - yours and sixty-four orphans
            we've lovingly supported in Viet Nam for more than ten years.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-emerald-200 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-emerald-800 flex items-center justify-center gap-2">
                <Heart className="h-8 w-8 text-rose-500" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-700 leading-relaxed">
                At Sharing the Love, we believe in the power of natural healing and purposeful commerce.
                Every carefully curated organic product nurtures your wellbeing while 100% of our profits
                fund food, education and healthcare for sixty-four beautiful orphans in Viet Nam. Through
                our premium wellness collection, we're not just enhancing your daily rituals – we're
                transforming young lives through the commerce-for-good model we've perfected over ten years.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-emerald-800 mb-12">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Leaf className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-emerald-800">Natural & Organic</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  We use only the finest organic ingredients, carefully sourced and
                  crafted to provide natural healing and wellness benefits.
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-emerald-800">Community Impact</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  100% of our profits fund food, education and healthcare for
                  sixty-four orphans in our Viet Nam programme spanning ten years.
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Star className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-emerald-800">Quality & Care</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Every product is made with love and attention to detail,
                  ensuring the highest quality for your wellness journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Meter Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-emerald-800 mb-12">
            Impact Meter - Commerce for Good
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="border-emerald-200">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-brandGold mb-2">2,847</div>
                <p className="text-gray-700">organic products sold since launch</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">64</div>
                <p className="text-gray-700">orphans supported through your purchases</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">10+</div>
                <p className="text-gray-700">years of dedicated service in Viet Nam</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-emerald-800 mb-4 text-center">
                Ten Years of Transforming Lives
              </h3>
              <p className="text-gray-700 leading-relaxed text-center">
                Our orphanage programme in Viet Nam has evolved from simple charity to a sustainable
                commerce-for-good model. For more than ten years, we've funded food, education and
                healthcare for sixty-four orphans through the sale of carefully curated organic products.
                Every purchase you make directly transforms a young life, creating lasting impact through
                conscious commerce.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;

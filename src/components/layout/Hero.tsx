import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "Sharing the Love",
  subtitle = "Premium organic products that transform lives",
  primaryButtonText = "Browse Organics",
  primaryButtonLink = "/shop",
  secondaryButtonText = "Learn Our Story",
  secondaryButtonLink = "/about",
  backgroundImage = "/images/Background.jpg?v=2025",
}) => {
  return (
    <section className="relative min-h-screen flex items-end justify-start overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Main content - Bottom Left */}
      <div className="relative z-10 p-8 md:p-16 max-w-2xl">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
          {title}
        </h1>

        <p className="text-xl md:text-2xl text-white mb-12 leading-relaxed font-light">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to={primaryButtonLink || "/shop"}>
            <Button
              size="lg"
              className="bg-transparent border-2 border-emerald-400 text-white hover:bg-emerald-600 hover:border-emerald-600 text-lg px-8 py-4 rounded-md font-semibold min-w-[140px]"
            >
              {primaryButtonText}
            </Button>
          </Link>

          <Link to={secondaryButtonLink || "/about"}>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-emerald-400 text-white hover:bg-emerald-600 hover:text-white text-lg px-8 py-4 rounded-md font-semibold bg-transparent backdrop-blur-sm min-w-[140px]"
            >
              {secondaryButtonText}
            </Button>
          </Link>
        </div>
      </div>

      {/* Right side overlay card */}
      <div className="absolute right-8 md:right-16 top-1/2 transform -translate-y-1/2 z-20 max-w-md">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-2xl border border-emerald-100">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-800 mb-6 leading-tight">
            Shop with Purpose - Transform Lives
          </h2>

          <p className="text-gray-700 leading-relaxed text-lg">
            Your purchase nourishes you and empowers sixty-four beautiful young lives in Viet Nam.
            100% of profits fund food, education and healthcare for the orphans we've supported
            for more than ten years.
          </p>

          {/* Small impact indicators in the overlay */}
          <div className="mt-8 pt-6 border-t border-emerald-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-brandGold">64</div>
                <p className="text-sm text-gray-600">Orphans Supported</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">10+</div>
                <p className="text-sm text-gray-600">Years of Service</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link to="/shop">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3">
                Shop with Purpose
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile overlay - shows below main content on mobile */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 z-20 p-6">
        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-t-lg shadow-2xl">
          <h2 className="text-xl font-bold text-emerald-800 mb-4">
            Shop with Purpose - Transform Lives
          </h2>

          <p className="text-gray-700 leading-relaxed text-sm mb-4">
            Your purchase nourishes you and empowers sixty-four beautiful young lives in Viet Nam.
            100% of profits fund food, education and healthcare for the orphans we've supported for more than ten years.
          </p>

          <Link to="/shop">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3">
              Shop with Purpose
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;

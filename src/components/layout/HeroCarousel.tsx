import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides, type HeroSlide } from "@/data/heroCarouselData";

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 6000); // Change slide every 6 seconds
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        prevSlide();
        setIsAutoPlaying(false);
      } else if (event.key === "ArrowRight") {
        nextSlide();
        setIsAutoPlaying(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="children stories carousel"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image with Duotone Overlay Strategy */}
      <div className="absolute inset-0">
        {/* Base blurred image */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat filter blur-sm scale-110"
          style={{
            backgroundImage: `url(${currentSlideData.image})`,
            backgroundPosition: ['Hoa', 'An', 'Linh'].includes(currentSlideData.childName)
              ? 'center 25%'
              : 'center'
          }}
        />

        {/* brandDarkGreen multiply overlay for duotone effect */}
        <div
          className="absolute inset-0 bg-brandDarkGreen opacity-60"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Additional gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => {
          prevSlide();
          setIsAutoPlaying(false);
        }}
        className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-30
                   bg-white/20 backdrop-blur-sm hover:bg-white/30
                   p-3 rounded-full transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-brandGold focus:ring-offset-2"
        aria-label="Previous story"
        tabIndex={0}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={() => {
          nextSlide();
          setIsAutoPlaying(false);
        }}
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-30
                   bg-white/20 backdrop-blur-sm hover:bg-white/30
                   p-3 rounded-full transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-brandGold focus:ring-offset-2"
        aria-label="Next story"
        tabIndex={0}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-2">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => {
                goToSlide(index);
                setIsAutoPlaying(false);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-brandGold focus:ring-offset-2
                         ${index === currentSlide
                           ? 'bg-brandGold'
                           : 'bg-white/40 hover:bg-white/60'}`}
              aria-label={`Go to story ${index + 1}: ${heroSlides[index].childName}`}
              tabIndex={0}
            />
          ))}
        </div>
      </div>

      {/* Charity Name - Top Right */}
      <div className="absolute top-4 md:top-8 right-4 md:right-8 z-30">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl">
          Sharing the Love
        </h1>
      </div>

      {/* Main Content - Foreground Card - Bottom Left */}
      <div className="absolute bottom-20 left-4 md:left-8 z-20 max-w-xs md:max-w-sm">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 md:p-6
                        border border-white/20 text-left
                        transform transition-all duration-500 ease-in-out">

          {/* Quote */}
          <div className="mb-4 md:mb-6">
            <blockquote className="text-sm md:text-lg font-light text-gray-800 leading-relaxed mb-3 md:mb-4">
              "{currentSlideData.quote}"
            </blockquote>

            {/* Child Name and Age */}
            <div className="flex items-center space-x-2">
              <cite className="text-base md:text-lg font-semibold text-brandDarkGreen not-italic">
                {currentSlideData.childName}
              </cite>
              {currentSlideData.age && (
                <span className="text-xs md:text-sm text-gray-600">
                  • Age {currentSlideData.age}
                </span>
              )}
            </div>
          </div>

          {/* Call-to-Action Button - Gold */}
          <div className="space-y-3">
            <Link to="/shop">
              <Button
                size="sm"
                className="w-full bg-brandGold hover:bg-brandGold/90 text-white
                           font-semibold px-6 py-3 text-base rounded-lg
                           shadow-lg hover:shadow-xl transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-brandGold focus:ring-offset-2"
              >
                Shop with Purpose
              </Button>
            </Link>

            <p className="text-xs md:text-sm text-gray-600 text-center">
              Your purchase provides food, education, and healthcare for 64 children in Vietnam
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="bg-white/20 h-1">
          <div
            className="bg-brandGold h-full transition-all duration-300 ease-out"
            style={{
              width: `${((currentSlide + 1) / heroSlides.length) * 100}%`
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;

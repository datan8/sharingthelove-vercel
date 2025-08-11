import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  lazy?: boolean;
  quality?: number;
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc = '/images/hero-bg.jpg',
  lazy = true,
  quality = 80,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(lazy ? '' : src);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!lazy || !imageRef) return;

    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observerRef.current?.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before element enters viewport
        }
      );

      observerRef.current.observe(imageRef);
    } else {
      // Fallback for browsers without IntersectionObserver
      setImageSrc(src);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [imageRef, src, lazy]);

  // Optimize image URL for better performance
  const getOptimizedSrc = (originalSrc: string): string => {
    if (!originalSrc) return fallbackSrc;

    // If it's an external URL (Unsplash, Stripe, etc.), add optimization params
    if (originalSrc.includes('unsplash.com')) {
      const url = new URL(originalSrc);
      url.searchParams.set('q', quality.toString());
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fm', 'webp');
      return url.toString();
    }

    // For other external images or local images, return as-is
    return originalSrc;
  };

  const handleLoad = () => {
    setHasLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setImageSrc(fallbackSrc);
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Loading placeholder */}
      {!hasLoaded && imageSrc && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Actual image */}
      <img
        ref={setImageRef}
        src={imageSrc ? getOptimizedSrc(imageSrc) : undefined}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          hasLoaded ? 'opacity-100' : 'opacity-0',
          hasError && 'object-cover'
        )}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        {...props}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          Image failed to load
        </div>
      )}
    </div>
  );
}

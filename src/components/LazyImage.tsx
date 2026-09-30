'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  aspectRatio?: string;
  wrapperClassName?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt = '',
  className = '',
  fallbackIcon,
  aspectRatio,
  wrapperClassName = '',
  ...props
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      return;
    }

    setHasError(false);

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { rootMargin: '250px' } // Preload when within 250px of viewport
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    } else {
      setIsInView(true);
    }
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${wrapperClassName}`.trim()}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Shimmer skeleton while in view but still downloading */}
      {isInView && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200/50 to-gray-100 animate-pulse" />
      )}

      {/* Actual image when in view */}
      {isInView && src && !hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`${className} transition-opacity duration-200 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`.trim()}
          {...props}
        />
      )}

      {/* Fallback state when failed or empty */}
      {(hasError || !src) && (
        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
          {fallbackIcon || <ImageIcon className="w-6 h-6 stroke-[1.5]" />}
        </div>
      )}
    </div>
  );
};

'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { PromoBanner, PromoBannerProps } from './promo-banner';

interface PromoBannersSectionProps {
  banners: PromoBannerProps[];
}

export function PromoBannersSection({ banners }: PromoBannersSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className='relative w-full h-[300px] min-[511px]:h-[400px]'>
      {banners.map((banner, index) => (
        <div
          key={banner.id || index}
          className={cn(
            'absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out',
            index === currentIndex
              ? 'opacity-100 z-10'
              : 'opacity-0 z-0 pointer-events-none',
          )}
        >
          <PromoBanner {...banner} isPriority={index === 0} />
        </div>
      ))}

      {/* Индикаторы (точки) внизу */}
      {banners.length > 1 && (
        <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20'>
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus cursor-pointer',
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/80',
              )}
              aria-label={`Перейти к баннеру ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </section>
  );
}

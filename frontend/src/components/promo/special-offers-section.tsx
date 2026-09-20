'use client';

import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { ProductCard } from '@/components/product-card/product-card';
import { TypographyH2 } from '../ui/typography-h2';
import { SpecialOffersSectionProps } from '@/types/types';


export function SpecialOffersSection({ products }: SpecialOffersSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      loop: false,
      containScroll: 'trimSnaps',
      breakpoints: {
        '(min-width: 640px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 3 },
        '(min-width: 1280px)': { slidesToScroll: 4 },
      },
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
      }),
    ],
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const handleMouseEnter = useCallback(
    () => emblaApi?.plugins().autoplay?.stop(),
    [emblaApi],
  );
  const handleMouseLeave = useCallback(
    () => emblaApi?.plugins().autoplay?.play(),
    [emblaApi],
  );

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className='w-full py-12'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Container>
        <div className='flex items-center justify-between mb-8'>
          <TypographyH2 className='text-2xl min-[511px]:text-4xl font-normal text-foreground'>
            Специальные предложения
          </TypographyH2>

          {products.length > 3 && (
            <div className='hidden min-[511px]:flex gap-2'>
              <Button
                variant='outline'
                size='icon'
                className='h-10 w-10 rounded-full hover:border-brand hover:text-brand transition-colors'
                onClick={scrollPrev}
                aria-label='Предыдущие товары'
              >
                <ChevronLeft className='h-5 w-5' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                className='h-10 w-10 rounded-full border-gray-300 hover:border-brand hover:text-brand transition-colors'
                onClick={scrollNext}
                aria-label='Следующие товары'
              >
                <ChevronRight className='h-5 w-5' />
              </Button>
            </div>
          )}
        </div>

        <div className='overflow-hidden' ref={emblaRef}>
          <div className='flex gap-8'>
            {products.map((product) => (
              <div key={product.id} className='flex-[0_0_290px] min-w-0'>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  image={product.image}
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

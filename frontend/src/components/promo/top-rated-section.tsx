'use client'; 

import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { ProductCard } from '@/components/product-card/product-card';
import { TypographyH2 } from '../ui/typography-h2';
import { Button } from '@/components/ui/button';
import { TopRatedSectionProps } from '@/types/types';



export function TopRatedSection({ products }: TopRatedSectionProps) {

  const [visibleCount, setVisibleCount] = useState(8);


  const visibleProducts = products.slice(0, visibleCount);


  const hasMore = visibleCount < products.length;

  if (products.length === 0) {
    return null;
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  return (
    <section className='w-full py-12'>
      <Container>
        <div className='mb-8'>
          <TypographyH2 className='text-2xl text-left min-[511px]:text-4xl font-normal text-foreground'>
            Высокий рейтинг
          </TypographyH2>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center'>
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              oldPrice={product.oldPrice}
              image={product.image}
              rating={product.rating}
              showOldPrice={false}
            />
          ))}
        </div>

        {hasMore && (
          <div className='flex justify-center mt-12'>
            <Button
              onClick={handleLoadMore}
              size='lg'
              className='bg-brand hover:bg-brand-hover text-white font-medium px-12 py-6 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            >
              Показать еще
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}

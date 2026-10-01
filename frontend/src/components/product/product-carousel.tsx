"use client";

import { useState, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card/product-card";
import { CarouselProduct } from "@/types/types";

interface ProductCarouselProps {
  products: CarouselProduct[];
  title?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  buttonsPosition?: "sides" | "header";
  className?: string;
}

export function ProductCarousel({
  products,
  title,
  autoplay = false,
  autoplayDelay = 4000,
  buttonsPosition = "sides",
  className,
}: ProductCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  if (products.length === 0) return null;

  const plugins = autoplay
    ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })]
    : undefined;

  const showButtons = products.length > 4;

  return (
    <div className={className}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>

          {showButtons && buttonsPosition === "header" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full hover:border-brand hover:text-brand transition-colors"
                onClick={scrollPrev}
                aria-label="Предыдущие товары"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-gray-300 hover:border-brand hover:text-brand transition-colors"
                onClick={scrollNext}
                aria-label="Следующие товары"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      )}

      <Carousel
        opts={{ align: "start", loop: false }}
        plugins={plugins}
        setApi={setApi}
        className="w-full"
      >
        {showButtons && buttonsPosition === "sides" && (
          <>
            <CarouselPrevious className="-left-4 md:-left-12" />
            <CarouselNext className="-right-4 md:-right-12" />
          </>
        )}

        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <ProductCard
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                oldPrice={product.oldPrice}
                image={product.image}
                rating={product.rating ?? 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

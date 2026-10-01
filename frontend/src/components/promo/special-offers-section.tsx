"use client";

import { Container } from "@/components/ui/container";
import { ProductCarousel } from "../product/product-carousel";
import { SpecialOffer } from "@/types/types";

export interface SpecialOffersSectionProps {
  products: SpecialOffer[];
}

export function SpecialOffersSection({ products }: SpecialOffersSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12">
      <Container>
        <ProductCarousel
          products={products}
          title="Специальные предложения"
          autoplay
          autoplayDelay={4000}
          buttonsPosition="header"
        />
      </Container>
    </section>
  );
}

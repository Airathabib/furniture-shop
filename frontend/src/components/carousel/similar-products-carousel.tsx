"use client";

import { ProductCarousel } from "../product/product-carousel";
import { ProductCardData } from "@/types/types";

interface SimilarProductsCarouselProps {
  products: ProductCardData[];
}

export function SimilarProductsCarousel({
  products,
}: SimilarProductsCarouselProps) {
  return <ProductCarousel products={products} buttonsPosition="sides" />;
}

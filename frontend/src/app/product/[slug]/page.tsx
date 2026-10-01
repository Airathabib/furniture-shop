import { getServerApolloClient } from "@/lib/apollo-client.server";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { BackButton } from "@/components/ui/back-button";
import { Star } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  GET_PRODUCT_BY_SLUG,
  GET_SIMILAR_PRODUCTS,
} from "@/constants/constants";
import { GetProductBySlugQuery, SimilarProductsQuery } from "@/types/types";
import { TypographyH2 } from "@/components/ui/typography-h2";
import { SimilarProductsCarousel } from "@/components/carousel/similar-products-carousel";
import { ProductGallery } from "@/components/product/product-gallery";
import {
  formatPrice,
  getDiscountAmount,
  getSimilarProducts,
  parseSize,
} from "@/utils/product.utils";
import { QuickBuySection } from "@/components/product/quick-buy-section";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const client = await getServerApolloClient();

  const { data } = await client.query<GetProductBySlugQuery>({
    query: GET_PRODUCT_BY_SLUG,
    variables: { slug },
  });

  const product = data?.productBySlug;

  if (!product) {
    notFound();
  }

  const { data: similarData } = await client.query<SimilarProductsQuery>({
    query: GET_SIMILAR_PRODUCTS,
    variables: {
      slug: product.category?.slug || "",
      limit: 12,
    },
  });

  const similarProducts = getSimilarProducts(
    similarData?.productsByCategory,
    product.id,
    12,
  );

  const discount = getDiscountAmount(product.price, product.oldPrice);

  const { length, width, height } = parseSize(product.size);

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />{" "}
          <BreadcrumbItem>
            <BreadcrumbLink href="/catalog">Каталог</BreadcrumbLink>
          </BreadcrumbItem>{" "}
          {product.category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/catalog?category=${product.category.slug}`}
                >
                  {product.category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />{" "}
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <BackButton className="mb-4" />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery
          mainImage={product.image}
          images={product.images || []}
          productName={product.name}
          discount={discount}
        />

        <div className="flex flex-col">
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span className="text-sm font-medium text-foreground">
                {product.rating.toFixed(1)}
              </span>
              {product.reviewCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} отзывов)
                </span>
              )}
            </div>
          )}

          <TypographyH2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {product.name}
          </TypographyH2>

          <p className="text-sm text-muted-foreground mb-6">
            {[
              product.size && `Размер: ${product.size} см`,
              product.color && `Цвет: ${product.color}`,
              product.material && `(${product.material})`,
            ]
              .filter(Boolean)
              .join(" ")}
          </p>

          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <QuickBuySection productId={product.id} productName={product.name} />

          <div className="border-t border-border pt-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {product.warranty && (
                <>
                  <span className="text-muted-foreground">Гарантия</span>
                  <span className="text-foreground">{product.warranty}</span>
                </>
              )}
              {product.sku && (
                <>
                  <span className="text-muted-foreground">Артикул</span>
                  <span className="text-foreground">{product.sku}</span>
                </>
              )}
              {length && (
                <>
                  <span className="text-muted-foreground">Длина</span>
                  <span className="text-foreground">{length} см</span>
                </>
              )}
              {height && (
                <>
                  <span className="text-muted-foreground">Высота</span>
                  <span className="text-foreground">{height} см</span>
                </>
              )}
              {width && (
                <>
                  <span className="text-muted-foreground">Глубина</span>
                  <span className="text-foreground">{width} см</span>
                </>
              )}
              {product.configuration && (
                <>
                  <span className="text-muted-foreground">Механизм</span>
                  <span className="text-foreground">
                    {product.configuration}
                  </span>
                </>
              )}
              {product.material && (
                <>
                  <span className="text-muted-foreground">Тип обивки</span>
                  <span className="text-foreground">{product.material}</span>
                </>
              )}
              {product.color && (
                <>
                  <span className="text-muted-foreground">Цвет</span>
                  <span className="text-foreground">{product.color}</span>
                </>
              )}
              {product.category && (
                <>
                  <span className="text-muted-foreground">Категория</span>
                  <span className="text-foreground">
                    {product.category.name}
                  </span>
                </>
              )}
              <span className="text-muted-foreground">Возврат</span>
              <span className="text-foreground">Условия</span>
            </div>
          </div>
        </div>
      </div>

      {product.fullDescription && (
        <div className="mt-16 border-t border-border pt-8">
          <TypographyH2 className="text-2xl font-bold mb-4 text-foreground">
            {product.configuration || "Описание"}
          </TypographyH2>
          <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed">
            <p>{product.fullDescription}</p>
          </div>
        </div>
      )}

      {similarProducts.length > 0 && (
        <SimilarProductsCarousel products={similarProducts} />
      )}
    </Container>
  );
}

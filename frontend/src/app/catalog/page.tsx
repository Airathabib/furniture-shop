import { getServerApolloClient } from "@/lib/apollo-client.server";

import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/product-card/product-card";
import { TypographyH1 } from "@/components/ui/typography-h1";
import {
  GET_CATEGORY_BY_SLUG,
  GET_PRODUCTS_BY_CATEGORY,
} from "@/constants/constants";
import { BackButton } from "@/components/ui/back-button";
import { CategoryBySlugQueryData, ProductCardData } from "@/types/types";

interface CatalogPageProps {
  searchParams: Promise<{ category?: string }>;
}

interface ProductsByCategoryQueryData {
  productsByCategory: ProductCardData[];
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { category } = await searchParams;

  if (!category) {
    return (
      <Container className="py-12">
        <TypographyH1>Каталог товаров</TypographyH1>
        <p className="text-muted-foreground mt-4">
          Выберите категорию из списка
        </p>
      </Container>
    );
  }

  const client = await getServerApolloClient();

  const { data: categoryData } = await client.query<
    CategoryBySlugQueryData,
    { slug: string } 
  >({
    query: GET_CATEGORY_BY_SLUG,
    variables: { slug: category },
  });

  const { data: productsData } = await client.query<
    ProductsByCategoryQueryData,
    { slug: string; limit: number } 
  >({
    query: GET_PRODUCTS_BY_CATEGORY,
    variables: { slug: category, limit: 50 },
  });

  // ✅ ТЕПЕРЬ TYPESCRIPT ЗНАЕТ, ЧТО ЭТО ТАКОЕ, И ОШИБОК НЕТ!
  const categoryInfo = categoryData?.categoryBySlug;
  const products = productsData?.productsByCategory || [];

  if (!categoryInfo) {
    return (
      <Container className="py-12">
        <TypographyH1>Категория не найдена</TypographyH1>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      {/* Заголовок категории */}
      <div className="mb-8">
        <BackButton />
        <TypographyH1>{categoryInfo.name}</TypographyH1>
        {categoryInfo.subcategories &&
          categoryInfo.subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {categoryInfo.subcategories.map(
                (sub: { id: string; name: string }, index: number) => (
                  <span key={sub.id || index}>{sub.name}</span>
                ),
              )}
            </div>
          )}
        <p className="text-muted-foreground mt-2">
          Найдено товаров: {products.length}
        </p>
      </div>

      {/* Сетка товаров */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: ProductCardData) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              oldPrice={product.oldPrice}
              image={product.image}
              rating={product.rating}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            В этой категории пока нет товаров
          </p>
        </div>
      )}
    </Container>
  );
}

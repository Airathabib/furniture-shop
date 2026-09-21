import { getServerApolloClient } from "@/lib/apollo-client.server";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/product-card/product-card";
import { TypographyH1 } from "@/components/ui/typography-h1";
import { BackButton } from "@/components/ui/back-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  GET_CATEGORY_BY_SLUG,
  GET_PRODUCTS_BY_CATEGORY,
} from "@/constants/constants";
import { CategoryBySlugQueryData, ProductCardData } from "@/types/types";

interface CatalogPageProps {
  searchParams: Promise<{ category?: string }>;
}

interface ProductsByCategoryQueryData {
  productsByCategory: ProductCardData[];
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { category } = await searchParams;

  // 1. Если категории нет в URL, показываем общий каталог (без categoryInfo)
  if (!category) {
    return (
      <Container className="py-12">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Главная</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Каталог</BreadcrumbPage>{" "}
              {/* ✅ Исправлено: статичный текст */}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <BackButton />
        <TypographyH1>Каталог товаров</TypographyH1>
        <p className="text-muted-foreground mt-4">
          Выберите категорию из списка
        </p>
      </Container>
    );
  }

  // 2. Если категория есть, делаем запросы к БД
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

  const categoryInfo = categoryData?.categoryBySlug;
  const products = productsData?.productsByCategory || [];

  // 3. Защита: если категория передана в URL, но не найдена в БД
  if (!categoryInfo) {
    return (
      <Container className="py-12">
        <TypographyH1>Категория не найдена</TypographyH1>
      </Container>
    );
  }

  // 4. Основной рендер (здесь TypeScript знает, что categoryInfo гарантированно существует)
  return (
    <Container className="py-12">
      {/* Хлебные крошки для конкретной категории */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/catalog">Каталог</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{categoryInfo.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <BackButton className="mb-4" />

      <TypographyH1 className="mb-2">{categoryInfo.name}</TypographyH1>

      {categoryInfo.subcategories && categoryInfo.subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categoryInfo.subcategories.map(
            (sub: { id: string; name: string }) => (
              <span
                key={sub.id}
                className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full hover:bg-brand/10 hover:text-brand cursor-pointer transition-colors"
              >
                {sub.name}
              </span>
            ),
          )}
        </div>
      )}

      <p className="text-muted-foreground text-sm mb-8">
        Найдено товаров: {products.length}
      </p>

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
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground">
            В этой категории пока нет товаров
          </p>
        </div>
      )}
    </Container>
  );
}

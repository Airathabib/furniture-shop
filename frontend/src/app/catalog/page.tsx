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
import { Filters } from "@/components/catalog/filters";
import {
  GET_CATEGORY_BY_SLUG,
  GET_PRODUCTS_BY_CATEGORY,
  GET_ALL_CATEGORIES,
  GET_ALL_PRODUCTS, // ✅ Добавили
} from "@/constants/constants";
import { CategoryBySlugQueryData, ProductCardData } from "@/types/types";

interface FilterCategory {
  id: string;
  name: string;
  slug: string;
}

interface CatalogPageProps {
  searchParams: Promise<{ category?: string }>;
}

interface ProductsByCategoryQueryData {
  productsByCategory: ProductCardData[];
}

interface AllProductsQueryData {
  products: ProductCardData[];
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { category } = await searchParams;
  const client = await getServerApolloClient();

  // 1. ВСЕГДА загружаем категории для сайдбара фильтров
  const { data: allCategoriesData } = await client.query<{
    categories: FilterCategory[];
  }>({
    query: GET_ALL_CATEGORIES,
  });
  const allCategories = allCategoriesData?.categories || [];

  let categoryInfo = null;
  let products: ProductCardData[] = [];
  let pageTitle = "Все товары";

  // 2. Условная логика загрузки данных
  if (category) {
    // А) Если категория указана в URL
    const { data: categoryData } = await client.query<
      CategoryBySlugQueryData,
      { slug: string }
    >({
      query: GET_CATEGORY_BY_SLUG,
      variables: { slug: category },
    });

    categoryInfo = categoryData?.categoryBySlug;

    if (!categoryInfo) {
      return (
        <Container className="py-12">
          <TypographyH1>Категория не найдена</TypographyH1>
        </Container>
      );
    }

    pageTitle = categoryInfo.name;

    const { data: productsData } = await client.query<
      ProductsByCategoryQueryData,
      { slug: string; limit: number }
    >({
      query: GET_PRODUCTS_BY_CATEGORY,
      variables: { slug: category, limit: 50 },
    });
    products = productsData?.productsByCategory || [];
  } else {
    // Б) Если категории НЕТ в URL (страница /catalog)
    const { data: allProductsData } = await client.query<
      AllProductsQueryData,
      { limit: number }
    >({
      query: GET_ALL_PRODUCTS,
      variables: { limit: 50 }, // Показываем 50 последних товаров
    });
    products = allProductsData?.products || [];
  }

  // 3. Рендеринг страницы
  return (
    <Container className="py-12">
      {/* Хлебные крошки */}
   
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          {category ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href="/catalog">Каталог</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />{" "}
              {/* ✅ Вынесли наружу, теперь это сосед */}
              <BreadcrumbItem>
                <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>Каталог</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <BackButton className="mb-4" />
      <TypographyH1 className="mb-2">{pageTitle}</TypographyH1>

      {/* Подкатегории показываем только если выбрана конкретная категория */}
      {categoryInfo?.subcategories && categoryInfo.subcategories.length > 0 && (
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
        {category
          ? `Найдено товаров в категории: ${products.length}`
          : `Показано товаров: ${products.length}`}
      </p>

      {/* Двухколоночный макет */}
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 flex-shrink-0">
          <Filters categories={allCategories} />
        </aside>

        <div className="flex-1">
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
              <p className="text-muted-foreground">Товары не найдены</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

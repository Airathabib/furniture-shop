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
  GET_PRODUCTS, // ✅ Используем обновленный универсальный запрос
} from "@/constants/constants";
import { CategoryBySlugQueryData, ProductCardData } from "@/types/types";

interface FilterCategory {
  id: string;
  name: string;
  slug: string;
}

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    categories?: string;
    minPrice?: string;
    maxPrice?: string;
    discounts?: string;
    colors?: string;
    search?: string; // ✅ 1. Добавили search в типизацию
  }>;
}

interface ProductsQueryData {
  products: ProductCardData[];
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const {
    category,
    categories: categoriesParam,
    minPrice: minPriceStr,
    maxPrice: maxPriceStr,
    discounts: discountsStr,
    colors: colorsStr,
    search,
  } = await searchParams;

  const client = await getServerApolloClient();

  const minPrice = minPriceStr ? Number(minPriceStr) : undefined;
  const maxPrice = maxPriceStr ? Number(maxPriceStr) : undefined;
  const discountFilters = discountsStr ? discountsStr.split(",") : undefined;
  const colorFilters = colorsStr ? colorsStr.split(",") : undefined;

  // 1. ВСЕГДА загружаем категории для сайдбара
  const { data: allCategoriesData } = await client.query<{
    categories: FilterCategory[];
  }>({
    query: GET_ALL_CATEGORIES,
  });
  const allCategories = allCategoriesData?.categories || [];

  // 2. Определяем, какие категории фильтровать
  let activeCategorySlugs: string[] | undefined = undefined;
  let pageTitle = "Каталог";
  let categoryInfo = null;

  if (search) {
    pageTitle = `Результаты поиска: "${search}"`;
  } else if (categoriesParam) {
    // Если выбраны чекбоксы (например, ?categories=divany,kresla)
    activeCategorySlugs = categoriesParam.split(",");
    pageTitle = "Выбранные категории";
  } else if (category) {
    // Если перешли по прямой ссылке на одну категорию (например, ?category=divany)
    activeCategorySlugs = [category];

    const { data: categoryData } = await client.query<
      CategoryBySlugQueryData,
      { slug: string }
    >({
      query: GET_CATEGORY_BY_SLUG,
      variables: { slug: category },
    });
    categoryInfo = categoryData?.categoryBySlug;
    if (categoryInfo) pageTitle = categoryInfo.name;
  }

  // 3. Загружаем товары с учетом фильтров (или все, если фильтров нет)
  const { data: productsData } = await client.query<
    ProductsQueryData,
    {
      limit: number;
      categorySlugs?: string[];
      minPrice?: number;
      maxPrice?: number;
      discountFilters?: string[];
      colorFilters?: string[];
			search?: string
    }
  >({
    query: GET_PRODUCTS,
    variables: {
      limit: 50,
      categorySlugs: activeCategorySlugs,
      minPrice,
      maxPrice,
      discountFilters,
      colorFilters,
			search: search || undefined

    },
  });

  const products = productsData?.products || [];

  // 4. Если категория была в URL, но не найдена в БД
  if (category && !categoriesParam && !categoryInfo) {
    return (
      <Container className="py-12">
        <BackButton />
        <TypographyH1>Категория не найдена</TypographyH1>
      </Container>
    );
  }

  // 5. Рендеринг
  return (
    <Container className="py-12">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {category && !categoriesParam ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href="/catalog">Каталог</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <BackButton className="mb-4" />
      <TypographyH1 className="mb-2">{pageTitle}</TypographyH1>

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
        {activeCategorySlugs
          ? `Найдено товаров по фильтру: ${products.length}`
          : `Показано товаров: ${products.length}`}
      </p>

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
              <p className="text-muted-foreground">
                По выбранным фильтрам товары не найдены
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

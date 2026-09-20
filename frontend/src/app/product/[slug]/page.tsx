import { getServerApolloClient } from "@/lib/apollo-client.server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import { GET_PRODUCT_BY_SLUG } from "@/constants/constants";
import { GetProductBySlugQuery } from "@/types/types";

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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU").format(price) + " руб";

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(product.oldPrice - product.price)
      : 0;

  return (
    <Container className="py-8 md:py-12">
      <BackButton />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square bg-muted/30 rounded-xl overflow-hidden border border-border">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-4 md:p-8"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1">
                Выгода {formatPrice(discount)}
              </Badge>
            )}
          </div>

          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {[product.image, ...product.images]
                .slice(0, 4)
                .map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-muted/30 rounded-lg overflow-hidden border border-border cursor-pointer hover:border-brand transition-colors"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} вид ${index + 1}`}
                      fill
                      className="object-contain p-2"
                      sizes="25vw"
                    />
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">
            {product.category?.name || "Мебель"}
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-3xl font-bold text-orange-500">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
              {product.description}
            </p>
          )}

          {(product.material || product.color || product.warranty) && (
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-muted/30 rounded-lg border border-border">
              {product.material && (
                <div>
                  <p className="text-xs text-muted-foreground">Материал</p>
                  <p className="font-medium text-foreground">
                    {product.material}
                  </p>
                </div>
              )}
              {product.color && (
                <div>
                  <p className="text-xs text-muted-foreground">Цвет</p>
                  <p className="font-medium text-foreground">{product.color}</p>
                </div>
              )}
              {product.warranty && (
                <div>
                  <p className="text-xs text-muted-foreground">Гарантия</p>
                  <p className="font-medium text-foreground">
                    {product.warranty}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <Button
              size="lg"
              className="flex-1 h-12 text-base bg-brand hover:bg-brand-hover text-white transition-colors focus-visible:ring-brand-focus"
            >
              Добавить в корзину
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 h-12 text-base border-brand text-brand hover:bg-brand hover:text-white transition-colors focus-visible:ring-brand-focus"
            >
              Купить в 1 клик
            </Button>
          </div>
        </div>
      </div>

      {/* Подробное описание (внизу страницы) */}
      {product.fullDescription && (
        <div className="mt-16 border-t border-border pt-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            Подробное описание
          </h2>
          <div
            className="prose prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: product.fullDescription.replace(/\n/g, "<br>"),
            }}
          />
        </div>
      )}
    </Container>
  );
}

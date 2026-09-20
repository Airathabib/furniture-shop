import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyH3 } from "../ui/typography-h3";
import { cn } from "@/lib/utils";
import { ProductCardProps } from "@/types/types";

export function ProductCard({
  name,
  slug,
  price,
  oldPrice,
  image,
  rating,
  showOldPrice = true,
  className,
}: ProductCardProps) {
  const discount =
    oldPrice && oldPrice > price ? Math.round(oldPrice - price) : 0;
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU").format(price) + " руб";

  const isRatingMode = typeof rating === "number";

  return (
    <div
      className={cn(
        "flex flex-col w-[290px] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border min-h-[320px] sm:min-h-0 h-full",
        className,
      )}
    >
      <Link
        href={`/product/${slug}`}
        className="relative block aspect-[4/3] max-h-[240px] sm:max-h-none"
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain pt-16 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* РЕЖИМ 1: Рейтинг (звёздочка + число) */}
        {isRatingMode && (
          <div className="absolute top-3 left-3 flex items-center gap-1 z-10">
            <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
            <span className="text-sm font-semibold text-orange-500">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {!isRatingMode && discount > 0 && (
          <div className="absolute top-7 left-0 flex items-center z-10">
            <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5">
              -{formatPrice(discount)}
            </div>
            <div className="w-0 h-0 border-t-[14px] border-b-[14px] border-l-[8px] border-t-transparent border-b-transparent border-l-orange-500"></div>
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <Link href={`/product/${slug}`} className="flex-1">
          <TypographyH3 className="text-2xl font-sans font-normal text-left text-foreground hover:text-brand transition-colors line-clamp-2">
            {name}
          </TypographyH3>
        </Link>

        <div className="space-y-2 mt-auto">
          <div
            className={cn(
              "flex items-baseline flex-wrap",
              isRatingMode ? "gap-2" : "gap-7",
            )}
          >
            <span className="text-lg font-semibold text-orange-500">
              {formatPrice(price)}
            </span>

            {showOldPrice && oldPrice && oldPrice > price && (
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(oldPrice)}
              </span>
            )}
          </div>

          <Button
            variant="outline"
            className="w-32 py-5 px-9 border-brand/50 text-brand hover:bg-brand hover:text-white transition-colors"
            size="sm"
          >
            Купить
          </Button>
        </div>
      </div>
    </div>
  );
}

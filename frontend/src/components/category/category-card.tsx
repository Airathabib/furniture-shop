import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryCardProps } from "@/types/types";
import { TypographyH3 } from "../ui/typography-h3";
import { Button } from "../ui/button"; // Укажи правильный путь к твоему компоненту Button

export function CategoryCard({
  name,
  slug,
  image,
  subcategories = [],
  className,
}: CategoryCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col bg-card-bg rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full border border-border",
        className,
      )}
    >
      {/* Изображение */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      <div className="flex flex-col flex-1 p-5 md:p-6">
        <TypographyH3 className="text-xl font-semibold text-foreground group-hover:text-brand transition-colors mb-3">
          {name}
        </TypographyH3>

        {/* Подкатегории */}
        {subcategories && subcategories.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-1 mb-4">
            {subcategories.slice(0, 3).map((sub, index, arr) => (
              <span
                key={sub.id}
                className="text-sm text-muted-foreground hover:text-brand transition-colors cursor-pointer"
              >
                {sub.name}
                {index < arr.length - 1 && ","}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-2 text-brand font-medium text-base">
          <Button
            asChild
            variant="ghost"
            className="mt-auto inline-flex items-center gap-2 text-brand font-medium text-sm group-hover:gap-3 transition-all bg-transparent hover:bg-transparent p-0 h-auto"
          >
            <Link
              href={`/catalog?category=${slug}`}
              aria-label={`Перейти в категорию ${name}`}
            >
              <span>В каталог</span>

              <span className="border-2 border-brand rounded-full flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus bg-transparent group-hover:bg-brand/10 shrink-0 w-6 h-6">
                <ChevronRight
                  className="h-6 w-6 text-brand"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

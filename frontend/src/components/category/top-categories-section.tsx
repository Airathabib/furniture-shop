import { Container } from "@/components/ui/container";
import { TypographyH2 } from "../ui/typography-h2";
import { CategoryCard } from "./category-card";
import { TopCategoriesSectionProps } from "@/types/types";

export function TopCategoriesSection({
  categories,
}: TopCategoriesSectionProps) {
  if (categories.length === 0) {
    return null;
  }

  const desiredOrder = ["divany", "krovati", "kresla", "stulya", "aksessuary"];

  const sortedCategories = [...categories].sort((a, b) => {
    const indexA = desiredOrder.indexOf(a.slug);
    const indexB = desiredOrder.indexOf(b.slug);
    return indexA - indexB;
  });

  return (
    <section className="w-full py-12 bg-muted/30">
      <Container>
        <TypographyH2 className="text-2xl min-[511px]:text-3xl font-normal text-foreground mb-8 text-left">
          Топ категории
        </TypographyH2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {sortedCategories.map((category, index) => {
            const spanClass = index < 2 ? "lg:col-span-3" : "lg:col-span-2";

            return (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                slug={category.slug}
                image={category.image}
                subcategories={category.subcategories}
                className={spanClass}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}

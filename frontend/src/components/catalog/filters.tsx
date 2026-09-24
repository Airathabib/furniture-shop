"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface CatalogFilters {
  categories: string[];
  priceRange: [number, number];
  discounts: string[];
  colors: string[];
}

interface FiltersProps {
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

const DISCOUNTS = [
  { id: "more5000", label: "Более 5 000" },
  { id: "less5000", label: "Менее 5 000" },
  { id: "no-discount", label: "Не важно" },
];

const COLORS = [
  { id: "brown", label: "Коричневый" },
  { id: "black", label: "Черный" },
  { id: "beige", label: "Бежевый" },
  { id: "gray", label: "Серый" },
  { id: "white", label: "Белый" },
  { id: "blue", label: "Синий" },
  { id: "orange", label: "Оранжевый" },
  { id: "yellow", label: "Желтый" },
  { id: "green", label: "Зеленый" },
];

export function Filters({ categories }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Инициализируем состояние из URL при первой загрузке
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")
      ? searchParams.get("categories")!.split(",")
      : [],
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 2000,
    Number(searchParams.get("maxPrice")) || 150000,
  ]);
  const [discounts, setDiscounts] = useState<string[]>(
    searchParams.get("discounts")
      ? searchParams.get("discounts")!.split(",")
      : [],
  );
  const [colors, setColors] = useState<string[]>(
    searchParams.get("colors") ? searchParams.get("colors")!.split(",") : [],
  );

  const updateURL = (newFilters: CatalogFilters) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newFilters.categories.length > 0) {
      params.set("categories", newFilters.categories.join(","));
    } else {
      params.delete("categories");
    }

    if (
      newFilters.priceRange[0] !== 2000 ||
      newFilters.priceRange[1] !== 150000
    ) {
      params.set("minPrice", String(newFilters.priceRange[0]));
      params.set("maxPrice", String(newFilters.priceRange[1]));
    } else {
      params.delete("minPrice");
      params.delete("maxPrice");
    }

    if (newFilters.discounts.length > 0) {
      params.set("discounts", newFilters.discounts.join(","));
    } else {
      params.delete("discounts");
    }

    if (newFilters.colors.length > 0) {
      params.set("colors", newFilters.colors.join(","));
    } else {
      params.delete("colors");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // ✅ ЕДИНСТВЕННАЯ ПРАВИЛЬНАЯ ВЕРСИЯ ФУНКЦИИ
  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categorySlug]
      : selectedCategories.filter((slug) => slug !== categorySlug);

    setSelectedCategories(newCategories);
    updateURL({ categories: newCategories, priceRange, discounts, colors });
  };

  const handleDiscountChange = (discountId: string, checked: boolean) => {
    const newDiscounts = checked
      ? [...discounts, discountId]
      : discounts.filter((id) => id !== discountId);
    setDiscounts(newDiscounts);
    updateURL({ categories: selectedCategories, priceRange, discounts: newDiscounts, colors });
  };

  const handleColorChange = (colorId: string, checked: boolean) => {
    const newColors = checked
      ? [...colors, colorId]
      : colors.filter((id) => id !== colorId);
    setColors(newColors);
    updateURL({ categories: selectedCategories, priceRange, discounts, colors: newColors });
  };

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
    updateURL({ categories: selectedCategories, priceRange: newRange, discounts, colors });
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([2000, 150000]);
    setDiscounts([]);
    setColors([]);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("categories");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("discounts");
    params.delete("colors");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Фильтровать по:
        </h3>
      </div>

      {/* Категория */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Категория</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.slug}`}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.slug, checked as boolean)
                }
              />
              <Label
                htmlFor={`category-${category.slug}`}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Цена */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Цена</h4>
        <div className="px-1">
          <Slider
            defaultValue={[2000, 150000]}
            max={150000}
            step={1000}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={priceRange[0]}
            onChange={(e) =>
              handlePriceChange([Number(e.target.value), priceRange[1]])
            }
            className="h-8 w-24 text-xs"
            placeholder="от"
          />
          <span className="text-xs text-muted-foreground">до</span>
          <Input
            type="number"
            value={priceRange[1]}
            onChange={(e) =>
              handlePriceChange([priceRange[0], Number(e.target.value)])
            }
            className="h-8 w-24 text-xs"
            placeholder="до"
          />
        </div>
      </div>

      <Separator />

      {/* Скидка */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Скидка</h4>
        <div className="space-y-2">
          {DISCOUNTS.map((discount) => (
            <div key={discount.id} className="flex items-center space-x-2">
              <Checkbox
                id={`discount-${discount.id}`}
                checked={discounts.includes(discount.id)}
                onCheckedChange={(checked) =>
                  handleDiscountChange(discount.id, checked as boolean)
                }
              />
              <Label
                htmlFor={`discount-${discount.id}`}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {discount.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Цвет */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Цвет</h4>
        <div className="space-y-2">
          {COLORS.map((color) => (
            <div key={color.id} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color.id}`}
                checked={colors.includes(color.id)}
                onCheckedChange={(checked) =>
                  handleColorChange(color.id, checked as boolean)
                }
              />
              <Label
                htmlFor={`color-${color.id}`}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {color.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={resetFilters}
        className="w-full mt-6"
        size="sm"
      >
        Сбросить фильтры
      </Button>
    </div>
  );
}

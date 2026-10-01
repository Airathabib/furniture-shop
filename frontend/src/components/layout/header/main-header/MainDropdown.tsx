"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_CATEGORIES } from "@/constants/constants";

interface MainDropdownProps {
  isMobile?: boolean;
  isFullWidth?: boolean;
}


interface Category {
  id: string;
  name: string;
  slug: string;
}

interface GetAllCategoriesQueryData {
  categories: Category[];
}

const MainDropdown = ({
  isMobile = false,
  isFullWidth = false,
}: MainDropdownProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Получаем категории с бэкенда
  const { data, loading, error } = useQuery<GetAllCategoriesQueryData>(
    GET_ALL_CATEGORIES,
    {
      errorPolicy: "ignore", // Игнорируем ошибки, чтобы не ломать UI
    }
  );

  const categories = data?.categories || [];

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category.name); // Визуально показываем выбранную категорию
    router.push(`/catalog?category=${encodeURIComponent(category.slug)}`); // Переход в каталог
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`
          flex items-center justify-between bg-background shrink-0 
          hover:bg-brand/5 transition-colors 
          focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus 
          h-[50px] cursor-pointer rounded-lg border border-border
      
          ${
            isFullWidth
              ? "w-full px-4"
              : "w-[300px] px-4 border-l border-r-0 border-t-0 border-b-0 rounded-none"
          }
        `}
        aria-label={`Выбрать категорию. Текущая: ${selectedCategory || "все"}`}
        disabled={loading} // Блокируем во время загрузки
      >
        <span className="text-sm text-brand font-medium truncate">
          {loading
            ? "Загрузка..."
            : selectedCategory || (isFullWidth ? "Все категории" : "Категория")}
        </span>
        <ChevronDown
          className="h-4 w-4 text-brand shrink-0"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="min-w-[160px] w-[calc(100vw-24px)] max-w-[400px] bg-background border-border"
      >
        {/* Опция "Все категории" — сбрасывает фильтр */}
        <DropdownMenuItem
          onClick={() => {
            setSelectedCategory(null);
            router.push("/catalog");
          }}
          className={`cursor-pointer transition-colors ${
            !selectedCategory
              ? "bg-brand/10 text-brand font-medium"
              : "hover:bg-brand/5 hover:text-brand"
          }`}
        >
          Все категории
        </DropdownMenuItem>

        {/* Категории из бэкенда */}
        {categories.map((category) => (
          <DropdownMenuItem
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`cursor-pointer transition-colors ${
              selectedCategory === category.name
                ? "bg-brand/10 text-brand font-medium"
                : "hover:bg-brand/5 hover:text-brand"
            }`}
          >
            {category.name}
          </DropdownMenuItem>
        ))}

        {/* Если произошла ошибка или категории не загрузились */}
        {error && categories.length === 0 && (
          <DropdownMenuItem disabled className="text-muted-foreground cursor-default">
            Не удалось загрузить категории
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MainDropdown;
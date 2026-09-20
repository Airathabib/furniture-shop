"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface MainDropdownProps {
  isMobile?: boolean;
  isFullWidth?: boolean;
}

const CATEGORIES = [
  "Диваны",
  "Кресла",
  "Кровати",
  "Стулья",
  "Аксессуары",
] as const;

const MainDropdown = ({
  isMobile = false,
  isFullWidth = false,
}: MainDropdownProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
      >
        <span className="text-sm text-brand font-medium truncate">
          {selectedCategory || (isFullWidth ? "Все категории" : "Категория")}
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
        {CATEGORIES.map((category) => (
          <DropdownMenuItem
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`cursor-pointer transition-colors ${
              selectedCategory === category
                ? "bg-brand/10 text-brand font-medium"
                : "hover:bg-brand/5 hover:text-brand"
            }`}
          >
            {category}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MainDropdown;

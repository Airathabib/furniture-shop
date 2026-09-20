"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const NAV_LINKS = [
  { label: "Каталог", href: "/catalog" },
  { label: "Магазины", href: "/stores" },
  { label: "Шоу-рум", href: "/showroom" },
  { label: "Доставка и оплата", href: "/delivery" },
  { label: "Дисконт", href: "/discount" },
  { label: "Контакты", href: "/contacts" },
] as const;

const NavItem = ({
  href,
  label,
  isMobile = false,
}: {
  href: string;
  label: string;
  isMobile?: boolean;
}) => {
  const pathname = usePathname();

  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <Link
      href={href}
      className={`transition-colors ${
        isMobile
          ? `text-lg font-medium py-2 border-b border-border ${
              isActive
                ? "text-brand font-semibold"
                : "text-foreground hover:text-brand"
            }`
          : `text-sm font-medium whitespace-nowrap ${
              isActive
                ? "text-brand font-semibold"
                : "text-foreground hover:text-brand"
            }`
      }`}
    >
      {label}
    </Link>
  );
};

// 3. ЕДИНЫЙ КОМПОНЕНТ НАВИГАЦИИ
export function MainNavigation() {
  return (
    <>
      {/* ==========================================
          ДЕСКТОП / ПЛАНШЕТ (>= 768px): Горизонтальное меню
          flex-1 + w-full: занимает всё доступное пространство
          md:gap-[40px]: отступ 40px на экранах от 768px
          lg:gap-[90px]: отступ 90px на широких экранах (от 1024px)
         ========================================== */}
      <nav
        className="hidden md:flex items-center flex-1 w-full justify-end md:gap-[10px] lg:gap-[90px]"
        aria-label="Главная навигация"
      >
        {NAV_LINKS.map((link) => (
          <NavItem key={link.href} href={link.href} label={link.label} />
        ))}
      </nav>

      {/* ==========================================
          МОБИЛЬНЫЙ (< 768px): Бургер-меню
         ========================================== */}
      <div className="md:hidden shrink-0">
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="p-2 text-brand hover:text-brand-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus rounded-sm"
              aria-label="Открыть меню"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-left text-2xl font-bold text-brand">
                Меню
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-4 mt-8 px-4">
              {NAV_LINKS.map((link) => (
                <NavItem
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isMobile={true}
                />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

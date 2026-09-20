"use client";

import Image from "next/image";
import Link from "next/link";
import MainSearch from "./MainSearch";
import MainDropdown from "./MainDropdown";
import { HeaderIcons } from "../header-icons/HeaderIcons";
import { MainNavigation } from "./MainNavigation";
import { Container } from "@/components/ui/container";

export function MainHeader() {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full bg-white border-b border-border">
      <Container>
        <div className="hidden lg:block bg-white">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/logo.svg"
                alt="SitDownPls - магазин мебели"
                width={180}
                height={30}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
            <MainNavigation />
          </div>

          <div className="flex items-center justify-between gap-8 pb-6">
            <form
              onSubmit={handleSearch}
              className="flex-1 flex items-center max-w-[1060px]"
            >
              <div className="relative flex items-center w-full h-[60px] border border-border rounded-lg overflow-hidden bg-white">
                <div className="flex items-center flex-1 max-w-[760px] bg-gray-50 h-full">
                  <MainSearch />
                </div>
                <MainDropdown />
              </div>
            </form>
            <HeaderIcons />
          </div>
        </div>

        {/* ==========================================
            ПЛАНШЕТ (768px - 1023px): Лого + Навигация
           ========================================== */}
        <div className="hidden md:flex lg:hidden flex-col py-6 gap-6 bg-white">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/logo.svg"
                alt="SitDownPls - магазин мебели"
                width={140}
                height={24}
                className="h-7 w-auto object-contain"
                priority
              />
            </Link>
            <MainNavigation />
          </div>

          <div className="w-full">
            <form onSubmit={handleSearch} className="flex items-center w-full">
              <div className="relative flex items-center w-full h-[50px] border border-border rounded-lg overflow-hidden bg-white">
                <div className="flex items-center flex-1 bg-gray-50 h-full min-w-0">
                  <MainSearch isMobile={true} />
                </div>
                <MainDropdown isMobile={true} />
              </div>
            </form>
          </div>
        </div>

        {/* ==========================================
            МОБИЛЬНЫЙ СРЕДНИЙ (511px - 767px): Бургер + Лого + Иконки
           ========================================== */}
        <div className="hidden min-[511px]:flex md:hidden flex-col w-full bg-white">
          {/* Строка с бургером, лого и иконками */}
          <div className="flex items-center justify-between w-full bg-white border-b border-border py-3">
            <MainNavigation />
            <Link href="/" className="flex items-center gap-2 shrink-0 mx-auto">
              <Image
                src="/logo.svg"
                alt="SitDownPls - магазин мебели"
                width={120}
                height={20}
                className="h-6 w-auto object-contain"
                priority
              />
            </Link>
            <div className="shrink-0 ml-auto">
              <HeaderIcons cartCount={0} className="gap-4" />
            </div>
          </div>

          {/* Строка поиска */}
          <div className="w-full py-4">
            <form onSubmit={handleSearch} className="flex items-center w-full">
              <div className="relative flex items-center w-full h-[50px] border border-border rounded-lg overflow-hidden bg-white">
                <div className="flex items-center flex-1 bg-background h-full min-w-0">
                  <MainSearch isMobile={true} />
                </div>
                <MainDropdown isMobile={true} />
              </div>
            </form>
          </div>
        </div>

        {/* ==========================================
            МОБИЛЬНЫЙ МАЛЫЙ (<= 510px): Только Бургер + Иконки 
            (Логотип уже отображается в TopBar, чтобы не дублировать!)
           ========================================== */}
        <div className="hidden max-[510px]:flex md:hidden flex-col gap-4 bg-white ">
          <div className="flex items-center justify-between w-full py-3 border-b border-border ">
            <MainNavigation />
            <HeaderIcons cartCount={0} className="gap-4" />
          </div>

          {/* Две строки: Поиск и Категория */}
          <div className="w-full flex flex-col gap-3 pb-4">
            {/* Строка 1: Поле поиска (растянуто на всю ширину) */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative flex items-center w-full h-[50px] border border-border rounded-lg overflow-hidden bg-background">
                <div className="flex items-center flex-1 h-full min-w-0">
                  <MainSearch isMobile={true} />
                </div>
              </div>
            </form>

            {/* Строка 2: Категория (растянута на всю ширину) */}
            <div className="w-full">
              {/* Добавь isFullWidth={true}, если хочешь, чтобы он был красивой отдельной кнопкой, как мы обсуждали */}
              <MainDropdown isMobile={true} isFullWidth={true} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

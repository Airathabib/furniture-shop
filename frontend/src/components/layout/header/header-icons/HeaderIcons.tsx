"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, ShoppingCart } from 'lucide-react';
import { useQuery } from "@apollo/client/react";
import { GET_CART } from "@/constants/constants";
import { CartType } from "@/types/types";
import { getCurrentUserId, getUserName } from '@/lib/auth-utils';
import { AuthModal } from '../../auth-modal/AuthModal';

interface GetCartQueryData {
  getCart: CartType;
}

interface HeaderIconsProps {
  className?: string;
}

export function HeaderIcons({ className = "" }: HeaderIconsProps) {
  // ✅ Флаг монтирования для предотвращения гидратационных ошибок
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // ✅ Читаем данные ТОЛЬКО после монтирования на клиенте
  const userId = isMounted ? getCurrentUserId() : undefined;
  const userName = isMounted ? getUserName() : undefined;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data } = useQuery<GetCartQueryData>(GET_CART, {
    skip: !userId,
    errorPolicy: "ignore",
  });

  const cartItems = data?.getCart?.items || [];
  const totalCartCount = cartItems.reduce(
    (sum: number, item) => sum + item.quantity,
    0
  );

  const displayName = userName
    ? userName.length > 12
      ? userName.slice(0, 12) + "..."
      : userName
    : "Профиль";

  const handleAuthClick = (e: React.MouseEvent) => {
    if (!userId) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <div className={`flex items-center gap-4 md:gap-8 ${className}`}>
        <Link
          href={userId ? "/account" : "/login"}
          onClick={handleAuthClick}
          className="flex flex-col items-center gap-1 text-brand hover:text-brand-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus rounded-sm p-2"
          aria-label={userId ? "Личный кабинет" : "Войти в аккаунт"}
        >
          <User className="h-6 w-6" aria-hidden="true" />
          <span className="text-xs font-medium block text-center max-w-[80px] truncate">
            {userId ? displayName : "Войти"}
          </span>
        </Link>

        <Link
          href="/cart"
          onClick={handleAuthClick}
          className="relative flex flex-col items-center gap-1 text-brand hover:text-brand-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus rounded-sm p-2"
          aria-label={`Корзина, товаров: ${totalCartCount}`}
        >
          <ShoppingCart className="h-6 w-6" aria-hidden="true" />
          <span className="text-xs font-medium hidden md:block">Корзина</span>

          {totalCartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-sm animate-in zoom-in-50 duration-200">
              {totalCartCount > 99 ? "99+" : totalCartCount}
            </span>
          )}
        </Link>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
'use client';

import { useSyncExternalStore, useState } from 'react';
import Link from 'next/link';
import { User, ShoppingCart } from 'lucide-react';
import { getCurrentUserId, getUserName } from '@/lib/auth-utils';
import { AuthModal } from '../../auth-modal/AuthModal';

interface HeaderIconsProps {
  cartCount?: number;
  className?: string;
}

function getClientUserId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return getCurrentUserId();
}

function getClientUserName(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return getUserName();
}

function getServerSnapshot(): undefined {
  return undefined;
}

function subscribe() {
  return () => {};
}

export function HeaderIcons({
  cartCount = 0,
  className = '',
}: HeaderIconsProps) {
  const userId = useSyncExternalStore(
    subscribe,
    getClientUserId,
    getServerSnapshot,
  );
  const userName = useSyncExternalStore(
    subscribe,
    getClientUserName,
    getServerSnapshot,
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const displayName = userName
    ? userName.length > 12
      ? userName.slice(0, 12) + '...'
      : userName
    : 'Профиль';

  const handleAuthClick = (e: React.MouseEvent) => {
    if (!userId) {
      e.preventDefault(); // Отменяем переход на /login
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <div className={`flex items-center gap-4 md:gap-8 ${className}`}>
        <Link
          href={userId ? '/account' : '/login'}
          onClick={handleAuthClick}
          className='flex flex-col items-center gap-1 text-brand hover:text-brand-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus rounded-sm p-2'
          aria-label={userId ? 'Личный кабинет' : 'Войти в аккаунт'}
        >
          <User className='h-6 w-6' aria-hidden='true' />

          <span className='text-xs font-medium block text-center max-w-[80px] truncate'>
            {userId ? displayName : 'Войти'}
          </span>
        </Link>

        <Link
          href='/cart'
          className='relative flex flex-col items-center gap-1 text-brand hover:text-brand-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus rounded-sm p-2'
          aria-label={`Корзина, товаров: ${cartCount}`}
        >
          <ShoppingCart className='h-6 w-6' aria-hidden='true' />
          <span className='text-xs font-medium hidden md:block'>Корзина</span>

          {cartCount > 0 && (
            <span className='absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center'>
              {cartCount}
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

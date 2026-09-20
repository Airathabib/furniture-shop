'use client';

import Link from 'next/link';
import Image from 'next/image';
import { TopDropdown } from './TopDropdown';
import { TopLinks } from './TopLinks';
import { HeaderIcons } from '../header-icons/HeaderIcons';
import { Container } from '@/components/ui/container'; // <-- 1. Импортируем Container

export function TopBar() {
  return (
    <>
      {/* ==========================================
          ДЕСКТОП (>= 1024px)
         ========================================== */}
      <div className='hidden lg:block w-full bg-gray-100 border-b border-border'>
        {/* 2. Заменяем ручной div на Container */}
        <Container>
          <div className='py-4 flex items-center justify-between'>
            <TopDropdown />
            <TopLinks />
          </div>
        </Container>
      </div>

      {/* ==========================================
          ПЛАНШЕТ (511px - 1023px)
         ========================================== */}
      <div className='hidden max-[510px]:hidden md:flex lg:hidden flex-col w-full'>
        {/* Ряд 1: БЕЛЫЙ фон (Dropdown) */}
        <div className='w-full bg-white border-b border-border'>
          {/* 3. Заменяем ручной div на Container */}
          <Container>
            <div className='py-4 flex items-center'>
              <TopDropdown />
            </div>
          </Container>
        </div>

        {/* Ряд 2: СЕРЫЙ фон (Links + Icons) */}
        <div className='w-full bg-gray-100 border-b border-border'>
          {/* 4. Заменяем ручной div на Container */}
          <Container>
            <div className='py-4 flex items-center justify-between'>
              <TopLinks />
              <HeaderIcons cartCount={0} />
            </div>
          </Container>
        </div>
      </div>

      {/* ==========================================
          МОБИЛЬНЫЙ (<= 510px)
         ========================================== */}
      <div className='flex max-[510px]:flex md:hidden flex-col w-full'>
        {/* Ряд 1: ЛОГОТИП */}
        {/* 5. Оборачиваем в Container, чтобы на очень узких экранах (320px) лого не прилипало к краям */}
        <Container className='bg-background border-b border-border flex justify-center py-4'>
          <Link href='/' className='flex items-center gap-2'>
            <Image
              src='/logo.svg'
              alt='SitDownPls - магазин мебели'
              width={120}
              height={20}
              className='h-6 w-auto object-contain'
              priority
            />
          </Link>
        </Container>

        {/* Ряд 2: TopDropdown (Регион + Телефон) — ЯВНО БЕЛЫЙ ФОН */}
        <div className='w-full bg-white'>
          {/* 6. Заменяем ручной div на Container */}
          <Container>
            <div className='py-4 flex items-center border-b border-border'>
              <TopDropdown />
            </div>
          </Container>
        </div>
      </div>
    </>
  );
}

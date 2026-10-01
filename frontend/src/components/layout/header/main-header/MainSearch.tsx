"use client";

import React, { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MainSearchProps {
  isMobile?: boolean;
}

const MainSearch = ({ isMobile = false }: MainSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    router.push(`/catalog?search=${encodeURIComponent(trimmedQuery)}`);
    setSearchQuery('');
  };


  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex items-center w-full max-w-[760px]">
      <Search
        className={`text-muted-foreground shrink-0 ${
          isMobile ? 'h-4 w-4 ml-3 mr-1' : 'h-5 w-5 ml-4 mr-2'
        }`}
        aria-hidden='true'
      />

      <input
        type='text'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Я хочу купить...'
        className='w-full min-w-0 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground h-full'
        aria-label='Поиск товаров'
      />

      <Button
        type='button'
        onClick={handleSearch}
        className={`border-2 border-brand rounded-full flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus cursor-pointer bg-transparent hover:bg-brand/10 shrink-0 ${
          isMobile ? 'w-7 h-7 mr-2' : 'w-8 h-8 mr-3'
        }`}
        aria-label='Искать'
      >
        <ChevronRight
          className={isMobile ? 'h-4 w-4 text-brand' : 'h-5 w-5 text-brand'}
          aria-hidden='true'
        />
      </Button>
    </div>
  );
};

export default MainSearch;
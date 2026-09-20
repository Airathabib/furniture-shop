import React, { useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';

interface MainSearchProps {
  isMobile?: boolean;
}

const MainSearch = ({ isMobile = false }: MainSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
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
        placeholder='Я хочу купить...'
        className='w-full max-w-[760px] min-w-0 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground h-full'
        aria-label='Поиск товаров'
      />

      <button
        type='submit'
        className={`border-2 border-brand rounded-full flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus cursor-pointer bg-transparent hover:bg-brand/10 shrink-0 ${
          isMobile ? 'w-7 h-7 mr-2' : 'w-8 h-8 mr-3'
        }`}
        aria-label='Искать'
      >
        <ChevronRight
          className={isMobile ? 'h-4 w-4 text-brand' : 'h-5 w-5 text-brand'}
          aria-hidden='true'
        />
      </button>
    </>
  );
};

export default MainSearch;

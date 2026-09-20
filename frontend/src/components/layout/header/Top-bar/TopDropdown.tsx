'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { CITIES, useSelectedCity } from '@/hooks/use-selected-city';

export function TopDropdown() {
  const { city, setCity } = useSelectedCity();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prev) => (prev < CITIES.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : CITIES.length - 1));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(CITIES.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (activeIndex >= 0 && activeIndex < CITIES.length) {
          setCity(CITIES[activeIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  const handleCitySelect = (selectedCity: (typeof CITIES)[number]) => {
    setCity(selectedCity);
    setIsOpen(false);
    document.getElementById('city-selector-trigger')?.focus();
  };

  return (
    <div className='flex flex-col min-[511px]:flex-row gap-4 items-start min-[511px]:items-center min-[511px]:gap-6 min-[511px]:py-4 w-full lg:w-auto'>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          id='city-selector-trigger'
          className='flex items-center gap-1 text-base text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus rounded-sm cursor-pointer'
          aria-label={`Выбрать регион. Текущий регион: ${city}`}
          aria-expanded={isOpen}
          aria-haspopup='listbox'
          aria-controls='city-listbox'
          onKeyDown={handleKeyDown}
        >
          <span>Ваш регион:</span>
          <span className='font-medium text-foreground ml-1 hover:text-brand'>
            {city}
          </span>
          {isOpen ? (
            <ChevronUp
              className={`h-5 w-5 ml-1 transition-colors ${
                isHoveringMenu ? 'text-brand' : ''
              }`}
              aria-hidden='true'
            />
          ) : (
            <ChevronDown
              className={`h-5 w-5 ml-1 transition-colors ${
                isHoveringMenu ? 'text-brand' : ''
              }`}
              aria-hidden='true'
            />
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          id='city-listbox'
          align='start'
          className='min-w-[200px] bg-white border border-border shadow-none p-1'
          role='listbox'
          aria-label='Список городов'
          onMouseEnter={() => setIsHoveringMenu(true)}
          onMouseLeave={() => setIsHoveringMenu(false)}
        >
          {CITIES.map((cityName, index) => {
            const isSelected = cityName === city;
            const isActive = index === activeIndex;

            return (
              <DropdownMenuItem
                key={cityName}
                onClick={() => handleCitySelect(cityName)}
                onMouseEnter={() => {
                  setActiveIndex(index);
                  setIsHoveringMenu(true);
                }}
                role='option'
                aria-selected={isSelected}
                aria-posinset={index + 1}
                aria-setsize={CITIES.length}
                className={`cursor-pointer px-3 py-2 text-sm rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus transition-colors ${
                  isSelected
                    ? 'bg-brand/10 text-brand font-medium'
                    : 'text-muted-foreground'
                } ${
                  isActive && !isSelected ? 'bg-muted' : ''
                } hover:bg-brand/5 hover:text-brand`}
              >
                {cityName}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Телефон */}
      <Link
        href='tel:+74958854547'
        className='flex items-center gap-2 text-sm text-orange-500 hover:text-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus rounded-sm'
        aria-label='Позвонить: +7 (495) 885-45-47'
      >
        <Phone className='h-4 w-4' aria-hidden='true' />
        <span className='font-medium'>+7 (495) 885-45-47</span>
      </Link>
    </div>
  );
}

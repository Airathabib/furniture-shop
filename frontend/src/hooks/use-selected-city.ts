'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const CITIES = [
  'Москва',
  'Санкт-Петербург',
  'Казань',
  'Уфа',
  'Пермь',
  'Новосибирск',
  'Екатеринбург',
] as const;

export type City = (typeof CITIES)[number];

const COOKIE_NAME = 'selectedCity';
const DEFAULT_CITY: City = 'Москва';

export function getCityFromCookies(): City {
  if (typeof window === 'undefined') return DEFAULT_CITY;
  const saved = Cookies.get(COOKIE_NAME);
  if (saved && (CITIES as readonly string[]).includes(saved)) {
    return saved as City;
  }
  return DEFAULT_CITY;
}

export function useSelectedCity() {
  const [city, setCity] = useState<City>(DEFAULT_CITY);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const savedCity = getCityFromCookies();
    setCity(savedCity);
  }, []);

  useEffect(() => {
    if (isMounted) {
      Cookies.set(COOKIE_NAME, city, {
        path: '/',
        expires: 30,
        sameSite: 'lax',
      });
    }
  }, [city, isMounted]);

  return { city, setCity, isMounted };
}

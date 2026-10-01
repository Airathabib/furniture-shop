// src/utils/product.utils.ts

import { ProductCardData } from "@/types/types"; // Убедись, что путь к типам верный

/**
 * Рассчитывает сумму скидки для отображения на UI.
 * Возвращает 0, если скидки нет (удобно для бейджей).
 */
export function getDiscountAmount(
  price: number,
  oldPrice?: number | null,
): number {
  if (oldPrice && oldPrice > price) {
    return Math.round(oldPrice - price);
  }
  return 0;
}

/**
 * Фильтрует текущий товар из списка похожих и ограничивает количество.
 */
export function getSimilarProducts(
  products: ProductCardData[] | undefined,
  currentProductId: string,
  limit: number = 12,
): ProductCardData[] {
  if (!products) return [];

  return products.filter((p) => p.id !== currentProductId).slice(0, limit);
}


export const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU").format(price) + " руб";

// Вспомогательная функция для парсинга размера "200х92х105"
export function parseSize(size?: string | null) {
  if (!size) return { length: null, width: null, height: null };
  const parts = size.split(/[хxХX]/).map((s) => s.trim());
  return {
    length: parts[0] || null,
    width: parts[1] || null,
    height: parts[2] || null,
  };
}

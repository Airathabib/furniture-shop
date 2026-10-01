"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ImageModal } from "./image-modal";
import { formatPrice } from "@/utils/product.utils";

interface ProductGalleryProps {
  mainImage: string;
  images: string[];
  productName: string;
  discount: number;
}

export function ProductGallery({
  mainImage,
  images,
  productName,
  discount = 0,
}: ProductGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // ✅ Индекс выбранного изображения (0 — главное)
  const [selectedIndex, setSelectedIndex] = useState(0);

  // ✅ Объединяем все изображения в один массив
  const allImages = [mainImage, ...images];

  // ✅ Текущее отображаемое изображение
  const currentImage = allImages[selectedIndex] || mainImage;

  // ✅ Обработчик клика по миниатюре
  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  // ✅ Обработчик клика по главному изображению — открываем модалку
  const handleMainImageClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Главное изображение (кликабельное для модалки) */}
      <div
        className="relative aspect-square bg-muted/30 rounded-xl overflow-hidden border border-border cursor-zoom-in group"
        onClick={handleMainImageClick}
      >
        <Image
          src={currentImage}
          alt={`${productName} — вид ${selectedIndex + 1}`}
          fill
          className="object-contain p-4 md:p-8 transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {discount > 0 && (
          <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1">
            Выгода {formatPrice(discount)}
          </Badge>
        )}

        {/* Иконка лупы при наведении */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 pointer-events-none">
          <div className="rounded-full bg-white/90 p-3 shadow-lg">
            <svg
              className="h-6 w-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Миниатюры */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.slice(0, 4).map((img, index) => (
            <div
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-square bg-muted/30 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                selectedIndex === index
                  ? "border-brand ring-2 ring-brand/20" // ✅ Активная миниатюра
                  : "border-border hover:border-brand/50"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} — вид ${index + 1}`}
                fill
                className="object-contain p-2"
                sizes="25vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно с ТЕКУЩИМ выбранным изображением */}
      <ImageModal
        src={currentImage}
        alt={`${productName} — вид ${selectedIndex + 1}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
  // Закрытие по Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        aria-label="Закрыть"
      >
        <X className="h-6 w-6" />
      </button>

      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-white"
        onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике на изображение
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          className="h-auto w-auto max-h-[90vh] object-contain"
          priority
        />
      </div>
    </div>
  );
}

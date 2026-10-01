"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuickBuyModal } from "@/components/order/quick-buy-modal";
import { useMutation } from "@apollo/client/react"; // ✅ Правильный импорт для v4
import { ADD_TO_CART, GET_CART } from "@/constants/constants";
import { toast } from "sonner"; // Или твой компонент уведомлений (например, react-hot-toast)

interface QuickBuySectionProps {
  productId: string;
  productName: string;
}

export function QuickBuySection({ productId, productName }: QuickBuySectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Настраиваем мутацию добавления в корзину
  const [addToCart, { loading: isAddingToCart }] = useMutation(ADD_TO_CART, {
    // Мгновенно обновляем данные корзины во всем приложении (например, в хедере)
    refetchQueries: [{ query: GET_CART }],
    onCompleted: () => {
      toast.success("Товар успешно добавлен в корзину!");
    },
    onError: (error) => {
      toast.error(error.message || "Не удалось добавить товар в корзину");
    },
  });

  // ✅ Обработчик клика
  const handleAddToCart = () => {
    addToCart({
      variables: {
        input: {
          productId,
          quantity: 1, // По умолчанию добавляем 1 штуку
        },
      },
    });
  };

  return (
    <>
      {/* Блок с кнопками */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Button
          size="lg"
          className="flex-1 h-12 text-base bg-brand hover:bg-brand-hover text-white transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          Купить в один клик
        </Button>
        
        {/* ✅ Обновленная кнопка добавления в корзину */}
        <Button
          size="lg"
          variant="outline"
          className="flex-1 h-12 text-base border-brand text-brand hover:bg-brand hover:text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={isAddingToCart} // Блокируем кнопку во время запроса
        >
          {isAddingToCart ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Добавляем...
            </span>
          ) : (
            "+ Добавить в корзину"
          )}
        </Button>
      </div>

      {/* Модалка быстрого заказа */}
      <QuickBuyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={productName}
        productId={productId}
      />
    </>
  );
}
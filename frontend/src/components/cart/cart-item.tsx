"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client/react";
import {
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  GET_CART,
} from "@/constants/constants";
import { CartItemType } from "@/types/types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItemComponent({ item }: CartItemProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU").format(price) + " ₽";

  const [updateCartItem, { loading: isUpdating }] = useMutation(
    UPDATE_CART_ITEM,
    {
      refetchQueries: [{ query: GET_CART }],
    },
  );

  const [removeFromCart, { loading: isRemoving }] = useMutation(
    REMOVE_FROM_CART,
    {
      refetchQueries: [{ query: GET_CART }],
    },
  );

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItem({
      variables: {
        input: {
          productId: item.product.id,
          quantity: newQuantity,
        },
      },
    });
  };

  const handleRemove = () => {
    removeFromCart({
      variables: {
        productId: item.product.id,
      },
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-xl border border-border transition-all hover:border-brand/30">
      {/* Изображение */}
      <Link
        href={`/product/${item.product.slug}`}
        className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-border"
      >
        <Image
          src={item.product.image}
          alt={item.product.name}
          fill
          className="object-contain p-2"
        />
      </Link>

      {/* Информация о товаре */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <Link
            href={`/product/${item.product.slug}`}
            className="hover:text-brand transition-colors"
          >
            <h3 className="font-semibold text-foreground line-clamp-2">
              {item.product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            {formatPrice(item.product.price)} за шт.
          </p>
        </div>

        {/* Управление: Количество и Удаление */}
        <div className="flex items-center justify-between mt-4 sm:mt-0">
          <div className="flex items-center gap-2 bg-background rounded-lg border border-border p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium text-sm">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-bold text-lg text-foreground hidden sm:block">
              {formatPrice(item.totalPrice)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
              onClick={handleRemove}
              disabled={isRemoving}
              title="Удалить из корзины"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Цена для мобильных */}
        <span className="font-bold text-lg text-foreground sm:hidden mt-2">
          Итого: {formatPrice(item.totalPrice)}
        </span>
      </div>
    </div>
  );
}

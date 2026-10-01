"use client";

import Link from "next/link";
import { ShoppingCart, ArrowRight, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react"; 
import { GET_CART, CLEAR_CART } from "@/constants/constants";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CartItemComponent } from "@/components/cart/cart-item";
import { CartType } from "@/types/types";
import { toast } from "sonner";

interface GetCartQueryData {
  getCart: CartType;
}

export function CartClient() {

  const { data, loading } = useQuery<GetCartQueryData>(GET_CART);
  const cart = data?.getCart;

  const [clearCart, { loading: isClearing }] = useMutation(CLEAR_CART, {
    refetchQueries: [{ query: GET_CART }],
    onCompleted: () => {
      toast.success("Корзина успешно очищена");
    },
    onError: (err) => {
      toast.error(err.message || "Ошибка при очистке корзины");
    },
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU").format(price) + " ₽";

  // ✅ 2. Если корзина опустела прямо во время использования (после удаления последнего товара)
  if (!loading && (!cart || cart.items.length === 0)) {
    return (
      <Container className="py-16 md:py-24">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Ваша корзина пуста</h1>
            <p className="text-muted-foreground max-w-md">
              Похоже, вы удалили все товары. Самое время выбрать что-то новое!
            </p>
          </div>
          <Button asChild size="lg" className="mt-4 bg-brand hover:bg-brand-hover">
            <Link href="/catalog">
              Перейти в каталог
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-24 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </Container>
    );
  }

  // ✅ 3. Рендерим актуальные данные из кэша
  return (
    <Container className="py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Корзина{" "}
          <span className="text-muted-foreground text-2xl font-normal">
            ({cart!.items.length})
          </span>
        </h1>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-red-500 hover:bg-red-50"
          onClick={() => {
            if (window.confirm("Вы уверены, что хотите очистить корзину?")) {
              clearCart();
            }
          }}
          disabled={isClearing}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Очистить корзину
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Левая колонка: Список товаров */}
        <div className="lg:col-span-2 space-y-4">
          {cart!.items.map((item) => (
            <CartItemComponent key={item.id} item={item} />
          ))}
        </div>

        {/* Правая колонка: Итого и оформление */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-muted/30 rounded-xl border border-border p-6 space-y-6">
            <h2 className="text-xl font-bold text-foreground">Ваш заказ</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Товары ({cart!.items.length})</span>
                <span>{formatPrice(cart!.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Доставка</span>
                <span className="text-green-600 font-medium">Бесплатно</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-center">
                <span className="text-lg font-bold text-foreground">Итого</span>
                <span className="text-2xl font-bold text-brand">
                  {formatPrice(cart!.totalAmount)}
                </span>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full h-12 text-base bg-brand hover:bg-brand-hover text-white"
            >
              <Link href="/checkout">
                Оформить заказ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Нажимая «Оформить заказ», вы соглашаетесь с условиями пользовательского соглашения.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

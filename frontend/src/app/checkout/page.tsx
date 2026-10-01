"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_CART, CHECKOUT } from "@/constants/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/ui/container";
import { CartType } from "@/types/types";
import { toast } from "sonner";
import { formatPrice } from "@/utils/product.utils";


interface GetCartQueryData {
  getCart: CartType;
}

interface CheckoutMutationData {
  checkout: {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data, loading: cartLoading } = useQuery<GetCartQueryData>(GET_CART);
  const cart = data?.getCart;

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    comment: "",
  });

  const [checkout, { loading: isCheckingOut }] = useMutation<CheckoutMutationData>(CHECKOUT, {
    onCompleted: (data) => {
      // ✅ Теперь TypeScript знает, что внутри data есть поле checkout
      toast.success(`Заказ ${data.checkout.orderNumber} успешно оформлен!`);
      router.push(`/order-success?id=${data.checkout.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Не удалось оформить заказ. Попробуйте позже.");
    },
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone.trim() || !formData.email.trim() || !formData.address.trim()) {
      toast.error("Пожалуйста, заполните все обязательные поля");
      return;
    }


    checkout({
      variables: {
        input: {
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          comment: formData.comment || undefined,
          deliveryCost: 0, // Можно расширить логику позже
          discount: 0,
        },
      },
    });
  };

  // Если корзина пуста, не даем оформить заказ
  if (!cartLoading && (!cart || cart.items.length === 0)) {
    return (
      <Container className="py-16 md:py-24 text-center">
        <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Корзина пуста</h1>
        <Button asChild variant="outline">
          <Link href="/cart">Вернуться в корзину</Link>
        </Button>
      </Container>
    );
  }

  if (cartLoading) {
    return (
      <Container className="py-24 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад к корзине
      </Button>

      <h1 className="text-3xl font-bold text-foreground mb-8">
        Оформление заказа
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Левая колонка: Форма ввода данных */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-muted/30 p-6 rounded-xl border border-border space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Контактные данные
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 999-99-99"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.ru"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Адрес доставки *</Label>
                <Input
                  id="address"
                  placeholder="Город, улица, дом, квартира"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Комментарий к заказу</Label>
                <Input
                  id="comment"
                  placeholder="Например: код домофона или удобное время доставки"
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Правая колонка: Итого */}
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
                  <span className="text-lg font-bold text-foreground">
                    Итого к оплате
                  </span>
                  <span className="text-2xl font-bold text-brand">
                    {formatPrice(cart!.totalAmount)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base bg-brand hover:bg-brand-hover text-white"
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Оформляем..." : "Подтвердить и оплатить"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Нажимая кнопку, вы соглашаетесь с условиями обработки
                персональных данных.
              </p>
            </div>
          </div>
        </div>
      </form>
    </Container>
  );
}

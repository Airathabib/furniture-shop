import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { getServerApolloClient } from "@/lib/apollo-client.server";
import { GET_CART } from "@/constants/constants";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CartClient } from "@/components/cart/cart-client";
import { CartType } from "@/types/types";

interface GetCartQueryData {
  getCart: CartType;
}

export default async function CartPage() {
  // 1. Получаем данные на сервере (быстро, без лоадеров)
  const client = await getServerApolloClient();
  const { data } = await client.query<GetCartQueryData>({
    query: GET_CART,
  });

  const cart = data?.getCart;

  // 2. Если корзина пуста, рендерим статический HTML (отлично для SEO и производительности)
  if (!cart || cart.items.length === 0) {
    return (
      <Container className="py-16 md:py-24">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Ваша корзина пуста
            </h1>
            <p className="text-muted-foreground max-w-md">
              Похоже, вы еще не добавили ни одного товара. Самое время заполнить
              корзину мебелью вашей мечты!
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="mt-4 bg-brand hover:bg-brand-hover"
          >
            <Link href="/catalog">
              Перейти в каталог
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  // 3. Если товары есть, передаем их в клиентский компонент для интерактивности
  return <CartClient initialCart={cart} />;
}
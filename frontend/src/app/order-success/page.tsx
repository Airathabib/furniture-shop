"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <Container className="py-24 md:py-32">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Спасибо за заказ!
          </h1>
          {orderId && (
            <p className="text-muted-foreground">
              Номер вашего заказа:{" "}
              <span className="font-semibold text-foreground">{orderId}</span>
            </p>
          )}
          <p className="text-muted-foreground">
            Мы уже начали собирать его. Менеджер свяжется с вами в ближайшее
            время для подтверждения.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild size="lg" className="bg-brand hover:bg-brand-hover">
            <Link href="/catalog">
              Продолжить покупки
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/profile/orders">Мои заказы</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}

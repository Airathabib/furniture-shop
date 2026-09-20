"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import { toast } from "sonner";
import { LogOut, User, ShoppingBag, Heart } from "lucide-react";
import { LOGOUT_MUTATION } from "@/graphql/mutations";
import { useUserSession } from "@/hooks/use-user-session";
import { clearSession } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GET_ME } from "../../constants/constants";
import { ApolloErrorLike, GetMeQueryData } from "../../types/types";

export default function AccountPage() {
  const router = useRouter();
  const { userId, userName } = useUserSession();
  const client = useApolloClient();

  const { data, error, loading } = useQuery<GetMeQueryData>(GET_ME, {
    fetchPolicy: "network-only",
  });

  const [logoutMutation, { loading: isLoggingOut }] =
    useMutation(LOGOUT_MUTATION);

  useEffect(() => {
    if (loading) return;

    if (error) {
      const apolloError = error as ApolloErrorLike;
      const hasAuthError = apolloError.graphQLErrors?.some(
        (e) =>
          e.extensions?.code === "UNAUTHORIZED" ||
          e.extensions?.code === "UNAUTHENTICATED",
      );

      if (hasAuthError) {
        console.warn(
          "Сессия невалидна или временная ошибка сервера (БД):",
          error,
        );
        toast.error("Ошибка авторизации", {
          description:
            "Возможно, временный сбой сервера. Попробуйте обновить страницу или войти снова.",
          duration: 5000,
        });
      }
      return;
    }
  }, [data, error, loading]);

  if (loading || !userId) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Проверка авторизации...</p>
      </div>
    );
  }

  if (!data?.getMe && !loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground mb-4">
          Не удалось загрузить профиль.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()}>
            Обновить страницу
          </Button>
          <Button variant="outline" onClick={() => router.push("/login")}>
            Войти заново
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center">
                <User className="h-5 w-5 text-brand" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {userName || data?.getMe?.name || "Пользователь"}
                </p>
                <p className="text-xs text-muted-foreground">Аккаунт активен</p>
              </div>
            </div>

            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-brand/10 text-brand">
                <User className="h-4 w-4" /> Профиль
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted transition-colors">
                <ShoppingBag className="h-4 w-4" /> Мои заказы
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted transition-colors">
                <Heart className="h-4 w-4" /> Избранное
              </button>
            </nav>

            <Separator />

            <Button
              variant="destructive"
              className="w-full"
              onClick={async () => {
                try {
                  await logoutMutation();

                  clearSession();

                  await client.resetStore();

                  toast.info("Вы вышли из системы", {
                    description: "До новых встреч!",
                  });

                  window.location.href = "/login";
                } catch (err) {
                  console.error("Ошибка при выходе:", err);
                  toast.error("Ошибка", {
                    description: "Не удалось выйти из системы.",
                  });
                }
              }}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? "Выход..." : "Выйти из аккаунта"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Добро пожаловать{userName ? `, ${userName}` : ""}!
            </CardTitle>
            <CardDescription>
              Здесь вы можете управлять своим профилем, заказами и избранными
              товарами.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>🚧 Разделы Мои заказы и Избранное находятся в разработке.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

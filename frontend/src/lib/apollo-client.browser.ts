import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  Observable,
  type FetchResult,
  type Operation,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { toast } from "sonner";
import { clearSession } from "@/lib/auth-utils";

import { notifySessionChanged } from "@/hooks/use-user-session";

// ==========================================
// СТРОГИЕ ИНТЕРФЕЙСЫ (заменяют any)
// ==========================================
interface ApolloErrorShape {
  message: string;
  extensions?: {
    code?: string;
    statusCode?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface ApolloErrorResponse {
  graphQLErrors?: readonly ApolloErrorShape[];
  networkError?: Error | null;
  errors?: readonly ApolloErrorShape[];
  error?: {
    graphQLErrors?: readonly ApolloErrorShape[];
    networkError?: Error | null;
    errors?: readonly ApolloErrorShape[];
  };
  result?: {
    errors?: readonly ApolloErrorShape[];
    data?: unknown;
  };

  operation?: Operation;

  forward?: (operation: Operation) => Observable<FetchResult>;
}
const httpLink = new HttpLink({
  uri: "/api/graphql",
  credentials: "include",
});

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

const errorLink = onError((response: unknown) => {
  const res = response as ApolloErrorResponse;

  const graphQLErrors =
    res?.graphQLErrors ||
    res?.errors ||
    res?.error?.graphQLErrors ||
    res?.error?.errors ||
    [];

  const networkError = res?.networkError || res?.error?.networkError;
  const operation = res?.operation;
  const forward = res?.forward;

  if (networkError) {
    console.error("[Apollo] Network error:", networkError);
    const errorCause = (networkError as { cause?: { code?: string } })?.cause;
    if (errorCause?.code === "ECONNREFUSED") {
      toast.error("Сервер недоступен", {
        description: "Проверьте, запущен ли бэкенд.",
        duration: 5000,
      });
      clearSession();
      notifySessionChanged();
    }
    return;
  }

  if (!graphQLErrors || graphQLErrors.length === 0) return;

  const authError = graphQLErrors.find(
    (err) =>
      err.extensions?.code === "UNAUTHORIZED" ||
      err.extensions?.code === "UNAUTHENTICATED",
  );

  if (authError) {
    console.log("[Apollo] 🚨 Ошибка авторизации. Запускаем рефреш...");

    if (operation?.operationName === "Refresh") {
      console.warn("[Apollo] ⚠️ Сам Refresh не авторизован.");
      clearSession();
      notifySessionChanged();
      return;
    }

    if (isRefreshing) {
      return new Observable<FetchResult>((observer) => {
        pendingRequests.push(() => {
          if (forward && operation) {
            forward(operation).subscribe(observer);
          }
        });
      });
    }

    isRefreshing = true;

    return new Observable<FetchResult>((observer) => {
      fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: `mutation Refresh { refresh { userId email role } }`,
          operationName: "Refresh",
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (data.errors) {
            console.error("[Apollo] ❌ Ошибки в ответе Refresh:", data.errors);
            throw new Error("Refresh validation failed");
          }
          return data;
        })
        .then((data) => {
          if (data.data?.refresh) {
            console.log(
              "[Apollo] ✅ Refresh успешен! Новые куки применены браузером.",
            );

            pendingRequests.forEach((callback) => callback());
            pendingRequests = [];

            setTimeout(() => {
              console.log("[Apollo] 🔄 Повторяем исходный запрос...");
              if (forward && operation) {
                forward(operation).subscribe(observer);
              }
            }, 100);
          } else {
            throw new Error("Нет данных refresh в ответе");
          }
        })
        .catch((refreshError) => {
          console.error("[Apollo] ❌ Ошибка рефреша:", refreshError);
          pendingRequests = [];
          clearSession();
          notifySessionChanged();
          observer.error(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }

  for (const err of graphQLErrors) {
    const code = err.extensions?.code;
    if (code === "FORBIDDEN") toast.error("Доступ запрещён");
    else if (code === "NOT_FOUND") toast.error("Не найдено");
    else toast.error("Ошибка", { description: err.message });
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network", errorPolicy: "all" },
    query: { fetchPolicy: "no-cache", errorPolicy: "all" },
    mutate: { errorPolicy: "all" },
  },
});

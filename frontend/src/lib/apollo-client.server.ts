import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { cookies, headers } from "next/headers";

export async function getServerApolloClient() {
  const cookieStore = await cookies();
  const headersList = await headers();

  const cookieHeader = cookieStore.toString();
  const authHeader = headersList.get("authorization");

  const serverHttpLink = new HttpLink({
    uri: process.env.BACKEND_URL || "http://localhost:4200/graphql",
    headers: {
      cookie: cookieHeader,
      ...(authHeader ? { authorization: authHeader } : {}),
    },
  });

  return new ApolloClient({
    link: serverHttpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: "no-cache" },
      query: { fetchPolicy: "no-cache" },
    },
  });
}

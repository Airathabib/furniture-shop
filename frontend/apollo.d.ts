import "@apollo/client";

declare module "@apollo/client" {
  namespace ApolloClient {
    namespace DeclareDefaultOptions {
      interface WatchQuery {
        errorPolicy?: "all" | "none" | "ignore";
      }
      interface Query {
        errorPolicy?: "all" | "none" | "ignore";
      }
      interface Mutate {
        errorPolicy?: "all" | "none" | "ignore";
      }
    }
  }
}

import { isServer, QueryClient } from "@tanstack/react-query";

export const queryKeys = {
  // Add your query keys here
  // e.g., users: ["users"],
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we want to set some stale time above 0 to
        // avoid re-fetching data immediately on the client.
        staleTime: 30 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export default function getQueryClient() {
  if (isServer) {
    // On the server, always create a new client for each request
    return makeQueryClient();
  }

  // On the client, we always re-use the existing client. This is very
  // important, so we don't re-make a new client if React suspends
  // during the initial render. This may not be needed if we have
  // a suspense boundary BELOW the creation of the query client.
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}

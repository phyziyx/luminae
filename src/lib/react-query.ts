import { InfiniteData, isServer, QueryClient } from "@tanstack/react-query";
import { FileType } from "./r2";

// Query key factories
export const queryKeys = {
  admin: {
    verification: {
      all: ["verification"],
      search: ({ query = "", page = 1 }: { query: string; page: number }) => [
        ...queryKeys.admin.verification.all,
        { query, page },
      ],
    },
  },
  community: {
    all: ["community"],
    categoryPosts: (category: string) => [
      ...queryKeys.community.all,
      "category",
      category,
    ],
    postComments: (postId: string) => [
      ...queryKeys.community.all,
      "post",
      postId,
      "comments",
    ],
    trending: ({ sortBy = "latest" }: { sortBy: "latest" | "all-time" }) => [
      ...queryKeys.community.all,
      "trending",
      { sortBy },
    ],
    search: ({ query, sort = "latest" }: { query: string; sort?: string }) => [
      ...queryKeys.community.all,
      "search",
      { query, sort },
    ],
  },
  agencyFiles: {
    all: ["files"],
    search: ({ query, fileType }: { query: string; fileType: FileType }) => [
      ...queryKeys.agencyFiles.all,
      "search",
      { query, fileType },
    ],
  },
};

export const updateInfiniteQueryData = <T>(
  old: InfiniteData<T[]>, // Each page is T[]
  updater: (data: T) => T
): InfiniteData<T[]> => {
  if (!old) return old;

  return {
    ...old,
    pages: old.pages.map((page) => page.map((item) => updater(item))),
  };
};

//

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we want to set some stale time above 0 to
        // avoid re-fetching data immediately on the client.
        staleTime: Infinity,
        // No need to refetch data on window focus or reconnect
        // If needed, we can set this on a per-query basis.
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
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

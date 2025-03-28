import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient, { queryKeys } from "@/lib/react-query";
import { fetchTrendingPosts } from "@/lib/managers/postManager";
import { CategoryPostsResponse } from "@/lib/types";
import { type SearchParams } from "next/dist/server/request/search-params";
import TrendingPostsList from "../components/trending-posts-list";

export default async function CategoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery<CategoryPostsResponse>({
    queryKey: queryKeys.community.trending({
      sortBy: "latest",
    }),
    queryFn: ({ pageParam }) => {
      return fetchTrendingPosts({
        pageParam: pageParam as string | undefined,
      });
    },
    initialPageParam: undefined as string | undefined,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-4 -ml-2 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary/80"
            asChild
          >
            <Link href="/community/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-gray-100">
            Trending
            <div className="mt-2 h-1 w-48 bg-[#5B9AFF] dark:bg-[#3B82F6]"></div>
          </h1>

          {/* Category Description */}
          <p className="mt-4 max-w-3xl text-gray-600 dark:text-gray-400">
            See all the posts trending in the community.
          </p>
        </div>

        {/* HydrationBoundary for Data */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <TrendingPostsList />
        </HydrationBoundary>
      </main>
    </div>
  );
}

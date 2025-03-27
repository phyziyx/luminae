import getQueryClient from "@/lib/react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TrendingPosts from "./trending-posts";
import { fetchTrendingPosts } from "@/lib/managers/postManager";

export default async function TrendingPostsSection() {
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery({
    queryKey: ["trendingPosts"],
    queryFn: fetchTrendingPosts,
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage: { nextCursor?: number }) =>
      lastPage.nextCursor,
  });

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Trending <span className="text-[#5B9AFF]">Posts</span>
          <div className="mt-1 h-1 w-24 bg-[#5B9AFF]"></div>
        </h2>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <TrendingPosts />
      </HydrationBoundary>
    </section>
  );
}

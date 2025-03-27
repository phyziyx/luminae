import getQueryClient from "@/lib/react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TrendingPosts from "./trending-posts";
import { fetchTrendingPosts } from "@/lib/managers/postManager";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TrendingPostsSection() {
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery({
    queryKey: ["trendingPosts"],
    queryFn: fetchTrendingPosts,
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage: { nextCursor?: number }) =>
      lastPage.nextCursor,
  });

  // define category
  const category = "trending";

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl">
          Trending{" "}
          <span className="text-[#5B9AFF] dark:text-[#3B82F6]">Posts</span>
          <div className="mt-1 h-1 w-24 bg-[#5B9AFF] dark:bg-[#3B82F6]"></div>
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary dark:text-primary-light hover:text-primary/90 dark:hover:text-primary-light/90 hover:bg-primary/5 dark:hover:bg-primary-light/10"
          asChild
        >
          <Link href={`/community/category/${category}`}>See More</Link>
        </Button>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TrendingPosts />
      </HydrationBoundary>
    </section>
  );
}

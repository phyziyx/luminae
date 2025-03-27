"use client";

import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import PostCardLarge from "./post-card-large";
import { fetchTrendingPosts } from "@/lib/managers/postManager";

const useTrendingPosts = () => {
  return useSuspenseInfiniteQuery({
    queryKey: ["trendingPosts"],
    queryFn: fetchTrendingPosts,
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage: { nextCursor?: number }) =>
      lastPage.nextCursor,
  });
};

export default function TrendingPosts() {
  const { data, fetchNextPage, isError } = useTrendingPosts();

  const trendingPosts = useMemo(
    () => data?.pages.flatMap((page) => page.posts),
    [data]
  );

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        {/* No trending posts */}
        {trendingPosts?.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No trending posts found...
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {trendingPosts?.map((post) => (
                <PostCardLarge key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Error handling */}
        {isError && (
          <div className="text-center">
            <span className="text-red-500 dark:text-red-400">
              Failed to load posts.
            </span>
            <Button
              variant="link"
              onClick={() => fetchNextPage()}
              className="text-primary dark:text-blue-400"
            >
              {"Retry"}
            </Button>
          </div>
        )}
      </div>

      {/* Empty section - add dark mode just in case you style it later */}
      <div className="mt-8 text-center flex justify-center items-center flex-col dark:bg-gray-900"></div>
    </>
  );
}

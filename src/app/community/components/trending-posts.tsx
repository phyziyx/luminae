"use client";

import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import PostCard from "./post-card";
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
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError } =
    useTrendingPosts();

  const trendingPosts = useMemo(
    () => data?.pages.flatMap((page) => page.posts),
    [data]
  );

  return (
    <>
      {JSON.stringify({ data, hasNextPage, isFetchingNextPage })}
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
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Load more button */}
            {/* <div className="mt-6 flex items-center justify-center">
              {hasNextPage ? (
                <Button
                  size="lg"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all 
            dark:bg-primary/80 dark:hover:bg-primary/70 dark:shadow-lg dark:hover:shadow-xl"
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </Button>
              ) : null}
            </div> */}
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

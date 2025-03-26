"use client";

import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostCard from "./post-card";
import { fetchTrendingPosts } from "@/lib/managers/postManager";

const useTrendingPosts = () => {
  return useInfiniteQuery({
    queryKey: ["trendingPosts"],
    queryFn: fetchTrendingPosts,
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
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
      <div className="flex flex-col items-center justify-center">
        {trendingPosts?.length === 0 ? (
          <div className="text-center text-gray-500">
            No trending posts found...
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {trendingPosts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center">
              {hasNextPage ? (
                <Button
                  size="lg"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </Button>
              ) : (
                <span>No more posts to load.</span>
              )}
            </div>
          </div>
        )}
        {isError && (
          <div>
            <span>Failed to load posts.</span>
            <Button
              variant="link"
              onClick={() => fetchNextPage()}
              className="text-primary"
            >
              {"Retry"}
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center flex justify-center items-center flex-col"></div>
    </>
  );
}

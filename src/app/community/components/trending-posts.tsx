"use client";

import Link from "next/link";
import { MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { LoadingSpinner } from "@/components/site/loading-spinner";

const fetchTrendingPosts = async ({ pageParam }: { pageParam?: number }) => {
  const response = await fetch(
    `/api/community?${pageParam ? `cursor=${pageParam}` : ""}`
  );
  return response.json();
};

const useTrendingPosts = () => {
  return useInfiniteQuery({
    queryKey: ["trendingPosts"],
    queryFn: fetchTrendingPosts,
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

function Posts() {
  const {
    data,
    hasNextPage,
    isPending,
    isError,
    isFetchingNextPage,
    // error,
    fetchNextPage,
  } = useTrendingPosts();

  const trendingPosts = useMemo(
    () => data?.pages.flatMap((page) => page.posts),
    [data]
  );

  if (isPending) {
    return <LoadingSpinner />;
  }

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

export default function TrendingPosts() {
  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Trending <span className="text-[#5B9AFF]">Posts</span>
          <div className="mt-1 h-1 w-24 bg-[#5B9AFF]"></div>
        </h2>
      </div>

      <Posts />
    </section>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PostCard({ post }: { post: any }) {
  return (
    <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-soft bg-white">
      <CardContent className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {post.category}
          </span>
          <span className="text-xs text-gray-500">{post.date}</span>
        </div>
        <Link
          href={`community/${post.category}/post/${post.id}`}
          className="group"
        >
          <h3 className="mb-2 text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="mb-4 text-sm text-gray-600 line-clamp-3">
          {post.content}
        </p>
        <div className="text-sm text-gray-500">
          By <span className="font-medium text-gray-700">{post.author}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-gray-100 bg-blue-50/30 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-gray-600" />
            <span className="text-sm">{post.comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4 text-gray-600" />
            <span className="text-sm">{post.likes}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 hover:text-primary hover:bg-primary/5"
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 hover:text-primary hover:bg-primary/5"
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

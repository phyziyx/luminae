"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { fetchCategoryPosts } from "@/lib/managers/postManager";
import { CategoryPostsResponse } from "@/lib/types";
import PostCard from "./post-card";
import { queryKeys } from "@/lib/react-query";

function useCategoryPosts({ categoryId }: { categoryId: string }) {
  return useSuspenseInfiniteQuery<CategoryPostsResponse>({
    queryKey: queryKeys.community.categoryPosts(categoryId),
    queryFn: ({ pageParam }) => {
      return fetchCategoryPosts({
        category: categoryId,
        pageParam: pageParam as string | undefined,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export default function CategoryPostsList({
  categoryId,
}: {
  categoryId: string;
}) {
  const [sortOption, setSortOption] = useState("latest");

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError } =
    useCategoryPosts({ categoryId });

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.items),
    [data]
  );

  // // Sort posts based on selected option
  // const sortedPosts = [...posts].sort((a, b) => {
  //   switch (sortOption) {
  //     case "most-commented":
  //       return b.comments - a.comments;
  //     case "most-liked":
  //       return b.likes - a.likes;
  //     case "latest":
  //     default:
  //       // For demo purposes, we'll sort by ID (assuming higher ID = newer)
  //       return b.id - a.id;
  //   }
  // });

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="text-gray-600 dark:text-gray-300">
          Showing {posts.length} posts
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Sort by:
          </span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="most-commented">Most Commented</SelectItem>
              <SelectItem value="most-liked">Most Liked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {JSON.stringify(
        {
          data: data?.pages?.length,
          hasNextPage,
          isFetchingNextPage,
        },
        null,
        2
      )}

      <div className="space-y-6">
        {posts?.length === 0 ? (
          <div className="text-center text-gray-500">No posts found...</div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
            {posts?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            <div className="mt-6 flex items-center justify-center">
              {hasNextPage ? (
                <Button
                  size="lg"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="bg-primary hover:bg-primary/90 dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary-light/90 shadow-md hover:shadow-lg transition-all"
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </Button>
              ) : null}
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
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { fetchCategoryPosts } from "@/lib/managers/postManager";

export default function CategoryPostsList({
  categoryId: category,
}: {
  categoryId: string;
}) {
  const [sortOption, setSortOption] = useState("latest");

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError } =
    useSuspenseInfiniteQuery({
      queryKey: ["community/category", category],
      queryFn: ({ pageParam = 0 }) => {
        return fetchCategoryPosts({
          category,
          pageParam,
        });
      },
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage: { nextCursor?: number }) =>
        lastPage.nextCursor,
    });

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.posts),
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PostCard({ post }: { post: any }) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-soft bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary-light/20 flex items-center justify-center text-primary dark:text-primary-light font-medium">
              {post.author.charAt(0)}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {post.author}
              </span>{" "}
              • {post.date}
            </span>
          </div>
        </div>
        <Link href={`/post/${post.id}`} className="group">
          <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {post.content}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-blue-50/30 dark:bg-blue-900/10 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm">{post.comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm">{post.likes}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

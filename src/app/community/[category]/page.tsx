import Link from "next/link";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import CategoryPostsList from "../components/category-posts-list";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient, { queryKeys } from "@/lib/react-query";
import PostManager from "@/lib/managers/postManager";
import prisma from "@/lib/db";
import { CategoryPostsResponse } from "@/lib/types";

export default async function CategoryPage({
  // searchParams,
  params,
}: {
  params: Promise<{ category: string }>;
  // searchParams: Promise<SearchParams>;
}) {
  const { category } = await params;

  const categoryData = await prisma.category.findUnique({
    where: {
      name: category,
    },
  });

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-gray-100">
            Category Not Found
          </h1>
          <p className="mt-4 max-w-3xl text-gray-600 dark:text-gray-400">
            The category you are looking for does not exist. Please check the
            URL or go back to the home page.
          </p>

          <Link href="/community">
            <Button variant="default" className="mt-8" asChild>
              Go Back to Home
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery<CategoryPostsResponse>({
    queryKey: queryKeys.community.categoryPosts(category),
    queryFn: async ({ pageParam }: { pageParam: unknown }) => {
      return await PostManager.getCategoryPosts({
        categoryId: categoryData.id,
        cursorId: pageParam as string | undefined,
        sortType: "latest",
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: { nextCursor?: string | null }) =>
      lastPage.nextCursor,
  });

  const { id, title, description } = categoryData;

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
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          {/* Heading */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-gray-100">
              Trending in{" "}
              <span className="text-[#5B9AFF] dark:text-[#3B82F6]">
                {title}
              </span>
              <div className="mt-2 h-1 w-48 bg-[#5B9AFF] dark:bg-[#3B82F6]" />
            </h1>

            {/* Create Post Button */}
            <Link href={`/community/${category}/create-post`}>
              <Button variant="default">
                <PlusIcon className="h-4 w-4" />
                Create Post
              </Button>
            </Link>
          </div>

          {/* Category Description */}
          <p className="mt-4 max-w-3xl text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        {/* HydrationBoundary for Data */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CategoryPostsList categoryId={id} />
        </HydrationBoundary>
      </main>
    </div>
  );
}

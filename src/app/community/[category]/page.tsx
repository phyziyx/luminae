import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import CategoryPostsList from "../components/category-posts-list";
// import { type SearchParams } from "next/dist/server/request/search-params";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "@/lib/react-query";
import { fetchCategoryPosts } from "@/lib/managers/postManager";

// This would typically come from a database or API
const getCategoryData = (category: string) => {
  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  return {
    name: formattedCategory,
    description: `Explore the latest discussions and insights in ${formattedCategory}. Join the conversation and share your expertise with our community.`,
  };
};

export default async function CategoryPage({
  params,
}: // searchParams,
{
  params: Promise<{ category: string }>;
  // searchParams: Promise<SearchParams>;
}) {
  const queryClient = getQueryClient();
  const { category } = await params;

  queryClient.prefetchInfiniteQuery({
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

  console.log("fetching category", category, "!");

  const categoryData = getCategoryData(category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 -ml-2 text-gray-600 hover:text-primary"
            asChild
          >
            <Link href="/community/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
            Trending in{" "}
            <span className="text-[#5B9AFF]">{categoryData.name}</span>
            <div className="mt-2 h-1 w-48 bg-[#5B9AFF]"></div>
          </h1>
          <p className="mt-4 max-w-3xl text-gray-600">
            {categoryData.description}
          </p>
        </div>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <CategoryPostsList category={category} />
        </HydrationBoundary>
      </main>
    </div>
  );
}

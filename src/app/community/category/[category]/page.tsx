import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import CategoryPostsList from "../../components/category-posts-list";

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
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryData = getCategoryData(category);

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
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-gray-100">
            Trending in{" "}
            <span className="text-[#5B9AFF] dark:text-[#3B82F6]">
              {categoryData.name}
            </span>
            <div className="mt-2 h-1 w-48 bg-[#5B9AFF] dark:bg-[#3B82F6]"></div>
          </h1>

          {/* Category Description */}
          <p className="mt-4 max-w-3xl text-gray-600 dark:text-gray-400">
            {categoryData.description}
          </p>
        </div>

        {/* Category Posts List */}
        <CategoryPostsList category={category} />
      </main>
    </div>
  );
}

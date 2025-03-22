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

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category;
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
            <Link href="/">
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

        <CategoryPostsList category={category} />
      </main>
    </div>
  );
}

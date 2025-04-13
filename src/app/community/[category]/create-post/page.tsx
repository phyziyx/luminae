import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreatePostForm from "./components/create-post-form";
import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export default async function CreatePostPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const session = await getSession();
  const userId = session?.user.id;

  const { category } = await params;

  // Check if the category is valid...
  const categoryData = await prisma.category.findUnique({
    where: {
      name: category,
    },
  });

  if (!categoryData || !userId) {
    redirect("/community");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 -ml-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
          asChild
        >
          <Link href={`/community/${category}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {category}
          </Link>
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 sm:text-4xl">
            Create a New{" "}
            <span className="text-[#5B9AFF] dark:text-[#7BABFF]">Post</span>
            <div className="mt-2 h-1 w-48 bg-[#5B9AFF] dark:bg-[#7BABFF]"></div>
          </h1>
          <p className="mt-4 max-w-3xl text-gray-600 dark:text-gray-300">
            Share your knowledge, ask questions, or start a discussion with the
            community.
            <br />
            Use markdown to format your post and make it more engaging.
          </p>
        </div>

        <CreatePostForm category={category} />
      </main>
    </div>
  );
}

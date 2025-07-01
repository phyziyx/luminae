import Link from "next/link";
import { ArrowLeft, RotateCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import PostContent from "../../components/post-content";
import CommentSection from "../../components/comment-section";
import PostManager from "@/lib/managers/postManager";
import { getSession } from "@/lib/auth/auth";
import { Suspense } from "react";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: (string | undefined)[] }>;
}) {
  const session = await getSession();
  const userId = session?.user.id;

  const { slug } = await params;
  const [postId] = slug;

  // This part of the code is never reached
  if (!postId) {
    return <div>Invalid Post ID</div>;
  }

  const postData = await PostManager.getPostById(postId, userId);

  // TODO
  if (!postData) {
    return <div>Post Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black">
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 -ml-2 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary/80"
          asChild
        >
          <Link href={`/community/${postData.category.name}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {/* Post Content */}
        <PostContent post={postData} />

        {/* Divider */}
        <div className="my-12 h-px w-full bg-gray-200 dark:bg-gray-700"></div>

        {/* Comment Section */}
        <Suspense
          fallback={
            <div className="flex flex-row gap-2 align-middle place-items-center place-content-center items-center w-full">
              <RotateCwIcon className="animate-spin align-middle text-blue-500 dark:text-blue-400 dark:align-middle" />
              Loading comments...
            </div>
          }
        >
          <CommentSection postId={postId} />
        </Suspense>
      </main>
    </div>
  );
}

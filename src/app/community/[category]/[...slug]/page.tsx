import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import PostContent from "../../components/post-content";
import CommentSection from "../../components/comment-section";
import PostManager from "@/lib/managers/postManager";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  console.log("slug:", slug.toString());

  const [postId] = slug;

  // This part of the code is never reached
  if (!postId) {
    return <div>Invalid Post ID</div>;
  }

  const postData = await PostManager.getPostById(postId);

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
          <Link href="/community/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {/* Post Content */}
        <PostContent post={postData} />

        {/* Divider */}
        <div className="my-12 h-px w-full bg-gray-200 dark:bg-gray-700"></div>

        {/* Comment Section */}
        <CommentSection postId={postId} />
      </main>
    </div>
  );
}

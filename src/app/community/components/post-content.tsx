"use client";

import { useMemo, useState } from "react";
import { MessageSquare, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarkdownRenderer } from "./markdown-renderer";
import { CategoryPost } from "@/lib/types";
import { authClient } from "@/lib/auth/auth-client";
import { LikeType, PostLikeSchema } from "@/lib/forms";
import { useMutation } from "@tanstack/react-query";
import Avatar from "@/components/site/avatar";
import LikeDislikeCounter from "./like-dislike-counter";

export default function PostContent({ post }: { post: CategoryPost }) {
  const { isPending } = authClient.useSession();

  // TODO: Handle like/dislike state based on user interaction
  const [likeState, setLikeState] = useState<
    "LIKE" | "DISLIKE" | null | undefined
  >(null);

  const likes = useMemo(() => {
    return post.likes.reduce((acc, like) => {
      if (like.type === "LIKE") {
        return acc + 1;
      } else if (like.type === "DISLIKE") {
        return acc - 1;
      }
      return acc;
    }, 0);
  }, [post.likes]);

  const { isPending: isLikePending, mutate: handleLike } = useMutation({
    mutationFn: async (type: LikeType) => {
      const payload: PostLikeSchema = {
        type,
        postId: post.id,
      };
      return await fetch("/api/community/like/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    },
    onSuccess() {
      // TODO: Handle success state (e.g., show a toast notification)
      setLikeState(null);
    },
  });

  return (
    <div>
      <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-soft">
        <div className="p-6 sm:p-8">
          {/* Post Header */}
          <div className="mb-6">
            <div className="mb-2 flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 sm:text-3xl md:text-4xl">
                {post.title}
              </h1>
              <LikeDislikeCounter
                handleLike={handleLike}
                isDisliked={likeState === "DISLIKE"}
                isLikePending={isLikePending}
                isLiked={likeState === "LIKE"}
                isPending={isPending}
                likes={likes}
                type="post"
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Avatar
                  name={
                    post.userPosts[0]?.user.name ||
                    post.agencyPosts[0]?.agency.name
                  }
                  profileImage=""
                  className="h-8 w-8"
                />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {post.userPosts[0]?.user.name ||
                    post.agencyPosts[0]?.agency.name}
                </span>
              </div>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post._count.comments} comments</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="rounded-full bg-primary/10 dark:bg-primary-light/20 px-3 py-1 text-xs font-medium text-primary dark:text-primary-light">
                  {post.category.name}
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

          {/* Post Content */}
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Post Footer */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-primary text-primary dark:border-primary-light dark:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
                size="sm"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Comment
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Report</span>
              <span>Bookmark</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

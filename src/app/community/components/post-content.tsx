"use client";

import { useMemo } from "react";
import { MessageSquare, Share2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Avatar from "@/components/site/avatar";
import LikeDislikeCounter from "./like-dislike-counter";
import { MarkdownRenderer } from "./markdown-renderer";

import { CategoryPostWithBookmark } from "@/lib/types";
import { authClient } from "@/lib/auth/auth-client";
import { LikeType, PostLikeSchema } from "@/lib/forms";

import { useToast } from "@/hooks/use-toast";
import BookmarkPost from "./bookmark-post";
import { PostCategoryBadge } from "./post-category-badge";
import { TagsPreview } from "./tag-preview";
import Author from "./author";
import Image from "next/image";

export default function PostContent({
  post,
}: {
  post: CategoryPostWithBookmark;
}) {
  const { data: session, isPending } = authClient.useSession();
  const userId = useMemo(() => session?.user?.id, [session]);

  const { toast } = useToast();

  const likeState = useMemo<"LIKE" | "DISLIKE" | null>(
    () => post?.likes.find((like) => like.userId === userId)?.type || null,
    [post.likes, userId]
  );

  // SHARE: Copy post URL
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ description: "Link copied to clipboard!" });
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast({
        variant: "destructive",
        description: "Failed to copy link!",
      });
    }
  };

  // LIKE COUNT: Derived from post.likes
  const likes = useMemo(() => {
    return post.likes.reduce((acc, like) => {
      if (like.type === "LIKE") return acc + 1;
      else if (like.type === "DISLIKE") return acc - 1;
      return acc;
    }, 0);
  }, [post.likes]);

  // LIKE HANDLER
  const { isPending: isLikePending, mutate: handleLike } = useMutation({
    mutationFn: async (type: LikeType) => {
      const payload: PostLikeSchema = {
        type,
        postId: post.id,
      };
      return await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/community/like/post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
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
                  profileImage={
                    post.userPosts[0]?.user.image ||
                    post.agencyPosts[0]?.agency.agencyLogo
                  }
                  className="h-8 w-8"
                />
                <Author
                  name={
                    post.userPosts[0]?.user.name ||
                    post.agencyPosts[0]?.agency.name
                  }
                  id={
                    post.userPosts[0]?.user.id || post.agencyPosts[0]?.agency.id
                  }
                  isAgency={!!post.agencyPosts[0]?.agency.id}
                />
              </div>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post._count.comments} comments</span>
              </div>
              <div className="flex items-center gap-1">
                <PostCategoryBadge name={post.category.name} />
              </div>
            </div>
          </div>

          {/* Post Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-row flex-wrap gap-2 text-xs font-medium place-items-center">
              Tags: <TagsPreview tags={post.tags.map((tag) => tag.tag.name)} />
            </div>
          )}

          <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

          {/* Post Image */}
          {post.image && (
            <div className="mb-6 flex w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
              <Image
                src={post.image}
                alt="Post Image"
                className="h-auto max-h-[400px] w-full object-cover"
                width={1200}
                height={400}
              />
            </div>
          )}

          {/* Post Content */}
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Post Footer */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* <Button
                variant="outline"
                className="border-primary text-primary dark:border-primary-light dark:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
                size="sm"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Comment
              </Button> */}
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {/* <span>Report</span> */}
              <BookmarkPost
                postId={post.id}
                initialBookmarkState={!!post.bookmarkedBy?.[0]?.id}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { MessageSquare, Share2, ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MarkdownRenderer } from "./markdown-renderer";
import { CategoryPost } from "@/lib/types";
import { authClient } from "@/lib/auth/auth-client";
import { PostLikeSchema } from "@/lib/forms";

export default function PostContent({ post }: { post: CategoryPost }) {
  const { data, isPending } = authClient.useSession();

  const userId = useMemo(() => {
    return data?.user?.id;
  }, [data]);

  // const { mutate: handleLike } = useMutation({
  //   mutationFn: async (type: LikeType) => {
  //     const payload: PostLikeSchema = {
  //       type,
  //       commentId: post.id,
  //     };
  //     return await fetch("/api/community/like/post", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });
  //   },
  // });

  const [likes, setLikes] = useState(post._count.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(hasDisliked ? likes + 2 : likes + 1);
      setHasLiked(true);
      setHasDisliked(false);
    }
  };

  const handleDislike = () => {
    if (hasDisliked) {
      setLikes(likes + 1);
      setHasDisliked(false);
    } else {
      setLikes(hasLiked ? likes - 2 : likes - 1);
      setHasDisliked(true);
      setHasLiked(false);
    }
  };

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
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        disabled={isPending}
                        variant="ghost"
                        size="icon"
                        className={`h-10 w-10 ${
                          hasLiked
                            ? "bg-primary/10 text-primary dark:bg-primary-light/20 dark:text-primary-light"
                            : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
                        }`}
                        onClick={handleLike}
                      >
                        <ThumbsUp className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upvote</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <span className="min-w-10 text-center text-lg font-medium text-gray-800 dark:text-gray-200">
                  {likes}
                </span>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        disabled={isPending}
                        variant="ghost"
                        size="icon"
                        className={`h-10 w-10 ${
                          hasDisliked
                            ? "bg-primary/10 text-primary dark:bg-primary-light/20 dark:text-primary-light"
                            : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
                        }`}
                        onClick={handleDislike}
                      >
                        <ThumbsDown className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Downvote</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary-light/20 flex items-center justify-center text-primary dark:text-primary-light font-medium">
                  {post.author.name.charAt(0)}
                </div>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {post.author.name}
                </span>
              </div>
              <span>{post.createdAt.toString()}</span>
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

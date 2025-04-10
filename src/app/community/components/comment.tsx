import { ThumbsUp, ThumbsDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MarkdownRenderer } from "./markdown-renderer";
import CommentReplies from "./comment-replies";
import { PostComment } from "@/lib/types";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/auth-client";
import { useMutation } from "@tanstack/react-query";
import { CommentLikeSchema, LikeType } from "@/lib/forms";
import { LoadingSpinner } from "@/components/site/loading-spinner";

function LikeDislikeCounter({
  isPending,
  likes,
  isLikePending,
  handleLike,
  isLiked,
  isDisliked,
}: {
  isPending: boolean;
  likes: number;
  isLikePending: boolean;
  handleLike: (type: LikeType) => void;
  isLiked: boolean;
  isDisliked: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10",
                {
                  "bg-primary/10 text-primary dark:bg-primary-light/20 dark:text-primary-light":
                    isLiked,
                }
              )}
              disabled={isPending}
              onClick={() => handleLike("LIKE")}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isLiked ? "Unlike this comment" : "Like this comment"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span className="text-sm font-medium min-w-4 items-center text-center place-items-center place-content-center text-gray-700 dark:text-gray-300">
        {isLikePending ? <LoadingSpinner className="h-4 w-4" /> : likes}
      </span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10",
                {
                  "bg-primary/10 text-primary dark:bg-primary-light/20 dark:text-primary-light":
                    isDisliked,
                }
              )}
              disabled={isPending}
              onClick={() => handleLike("DISLIKE")}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isDisliked ? "Remove dislike" : "Dislike this comment"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default function Comment({ comment }: { comment: PostComment }) {
  const { data, isPending } = authClient.useSession();

  const userId = useMemo(() => {
    return data?.user?.id;
  }, [data]);

  const { isPending: isLikePending, mutate: handleLike } = useMutation({
    mutationFn: async (type: LikeType) => {
      const payload: CommentLikeSchema = {
        type,
        commentId: comment.id,
      };

      return await fetch("/api/community/like/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    },
  });

  const likes = useMemo(() => {
    return comment.likes.reduce((acc, like) => {
      if (like.type === "LIKE") {
        return acc + 1;
      } else if (like.type === "DISLIKE") {
        return acc - 1;
      }
      return acc;
    }, 0);
  }, [comment.likes]);

  const isLiked = useMemo(() => {
    return comment.likes.some(
      (like) => like.type === "LIKE" && like.userId === userId
    );
  }, [comment.likes, userId]);

  const isDisliked = useMemo(() => {
    return comment.likes.some(
      (like) => like.type === "DISLIKE" && like.userId === userId
    );
  }, [comment.likes, userId]);

  const commenterName = useMemo(() => {
    return (
      comment.agencyComments[0]?.agency.name ||
      comment.userComments[0]?.user.name ||
      "Unknown"
    );
  }, [comment.agencyComments, comment.userComments]);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-soft">
      {/* Comment */}
      <div className="p-4 sm:p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary-light/20 flex items-center justify-center text-primary dark:text-primary-light font-medium">
              {commenterName.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {commenterName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
          <LikeDislikeCounter
            handleLike={handleLike}
            isDisliked={isDisliked}
            isLikePending={isLikePending}
            isLiked={isLiked}
            isPending={isPending}
            likes={likes}
          />
        </div>

        <div className="mt-3 text-gray-700 dark:text-gray-300">
          <MarkdownRenderer content={comment.content} />
        </div>

        {/* <div className="mt-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
            onClick={() => alert("setReplyingTo(comment.id)")}
          >
            {replyingTo === comment.id ? "Cancel" : "Reply"}
          </Button>
        </div> */}

        {/* Reply Input */}
        {/* {replyingTo === comment.id && (
          <div className="mt-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
            <Textarea
              placeholder="Write your reply..."
              className="mb-3 min-h-24 resize-y border-gray-200 dark:border-gray-700 focus-visible:ring-primary dark:focus-visible:ring-primary-light dark:bg-gray-800 dark:text-gray-100"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                onClick={() => alert('handleAddReply(comment.id)')}
                className="bg-primary hover:bg-primary/90 dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary-light/90"
              >
                Post Reply
              </Button>
            </div>
          </div>
        )} */}

        {/* Replies */}
        <CommentReplies replies={null} />
      </div>
    </div>
  );
}

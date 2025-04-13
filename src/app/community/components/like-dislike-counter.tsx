import { LoadingSpinner } from "@/components/site/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LikeType } from "@/generated/prisma/client";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function LikeDislikeCounter({
  isPending,
  likes,
  isLikePending,
  handleLike,
  isLiked,
  isDisliked,
  type,
}: {
  isPending: boolean;
  likes: number;
  isLikePending: boolean;
  handleLike: (type: LikeType) => void;
  isLiked: boolean;
  isDisliked: boolean;
  type: "comment" | "post";
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
              disabled={isPending || isLikePending}
              onClick={() => handleLike("LIKE")}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isLiked ? `Unlike this ${type}` : `Like this ${type}`}</p>
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
              disabled={isPending || isLikePending}
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

// TODO: This will need to be combined with the existing component...
// Comment Like Dislike Counter

/*

<div className="flex items-center gap-2">
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          disabled={isPending}
          variant="ghost"
          size="icon"
          className={`h-10 w-10 ${
            likeState === "LIKE"
              ? "bg-primary/10 text-primary dark:bg-primary-light/20 dark:text-primary-light"
              : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
          }`}
          onClick={() => handleLike("LIKE")}
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
    {post._count.likes}
  </span>

  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          disabled={isPending}
          variant="ghost"
          size="icon"
          className={`h-10 w-10 ${
            likeState === "DISLIKE"
              ? "bg-primary/10 text-primary dark:bg-primary-light/20 dark:text-primary-light"
              : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
          }`}
          onClick={() => handleLike("DISLIKE")}
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
*/

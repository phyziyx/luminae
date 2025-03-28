import { ThumbsUp } from "lucide-react";

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

// TODO: Add reply functionality

export default function Comment({ comment }: { comment: PostComment }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-soft">
      {/* Comment */}
      <div className="p-4 sm:p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary-light/20 flex items-center justify-center text-primary dark:text-primary-light font-medium">
              {comment.author.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {comment.author.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {comment.createdAt.toString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
                    onClick={() => alert("handleLike")}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Like this comment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {comment.likes}
            </span>
          </div>
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

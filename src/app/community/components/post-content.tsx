"use client";

import { useState } from "react";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PostContent({ post }: { post: any }) {
  const [likes, setLikes] = useState(post.likes);
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
      <Card className="overflow-hidden bg-white shadow-soft">
        <div className="p-6 sm:p-8">
          {/* Post Header */}
          <div className="mb-6">
            <div className="mb-2 flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl">
                {post.title}
              </h1>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-10 w-10 ${
                          hasLiked
                            ? "bg-primary/10 text-primary"
                            : "text-gray-600 hover:text-primary hover:bg-primary/5"
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

                <span className="min-w-10 text-center text-lg font-medium text-gray-800">
                  {likes}
                </span>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-10 w-10 ${
                          hasDisliked
                            ? "bg-primary/10 text-primary"
                            : "text-gray-600 hover:text-primary hover:bg-primary/5"
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

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {post.author.charAt(0)}
                </div>
                <span className="font-medium text-gray-800">{post.author}</span>
              </div>
              <span>{post.date}</span>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments} comments</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {post.category}
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Post Content */}
          <div className="prose prose-blue max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Post Footer */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5"
                size="sm"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Comment
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 text-gray-600"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Report</span>
              <span>Bookmark</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

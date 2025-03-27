"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MarkdownRenderer } from "./markdown-renderer";

// Generate sample comments for demo
const generateComments = (postId: string) => {
  const baseComments = [
    {
      id: 1,
      author: "Sarah Thompson",
      content:
        "This is a fantastic post! I especially liked the section about practical applications. Have you considered expanding on the third point?",
      date: "2 days ago",
      likes: 24,
      replies: [
        {
          id: 101,
          author: "Alex Johnson",
          content:
            "Thanks for your feedback, Sarah! I'm planning to write a follow-up post that goes deeper into that topic.",
          date: "1 day ago",
          likes: 8,
        },
        {
          id: 102,
          author: "Michael Chen",
          content:
            "I agree with Sarah. That section was particularly insightful.",
          date: "1 day ago",
          likes: 5,
        },
      ],
    },
    {
      id: 2,
      author: "David Kim",
      content:
        "Great explanation of the core concepts. I've been struggling with this for a while, and your post really cleared things up for me.\n\nOne question though: how would this approach scale for larger applications?",
      date: "3 days ago",
      likes: 18,
      replies: [],
    },
    {
      id: 3,
      author: "Emily Rodriguez",
      content:
        "I tried implementing the solution you suggested, and it worked perfectly! Here's what I did:\n\n```javascript\nconst result = implementSolution(myData);\nconsole.log(result); // It worked!\n```\n\nThanks for sharing this knowledge!",
      date: "4 days ago",
      likes: 32,
      replies: [
        {
          id: 301,
          author: "Alex Johnson",
          content: "That's awesome to hear, Emily! Glad it worked for you.",
          date: "3 days ago",
          likes: 7,
        },
      ],
    },
  ];

  // Add some variation based on the post ID
  return baseComments.map((comment) => ({
    ...comment,
    likes: comment.likes + (Number.parseInt(postId) % 10),
    replies: comment.replies.map((reply) => ({
      ...reply,
      likes: reply.likes + (Number.parseInt(postId) % 5),
    })),
  }));
};

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState(generateComments(postId));
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      author: "Current User",
      content: newComment,
      date: "Just now",
      likes: 0,
      replies: [],
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  const handleAddReply = (commentId: number) => {
    if (!replyContent.trim()) return;

    const newReply = {
      id: Date.now(),
      author: "Current User",
      content: replyContent,
      date: "Just now",
      likes: 0,
    };

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        };
      }
      return comment;
    });

    setComments(updatedComments);
    setReplyingTo(null);
    setReplyContent("");
  };

  const handleLike = (
    commentId: number,
    isReply = false,
    parentId?: number
  ) => {
    if (isReply && parentId) {
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  likes: reply.likes + 1,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      });
      setComments(updatedComments);
    } else {
      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.likes + 1,
          };
        }
        return comment;
      });
      setComments(updatedComments);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Comments{" "}
        <span className="text-[#5B9AFF] dark:text-[#7BABFF]">
          ({comments.length})
        </span>
        <div className="mt-1 h-1 w-24 bg-[#5B9AFF] dark:bg-[#7BABFF]"></div>
      </h2>

      {/* Comment Input */}
      <div className="mb-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-soft">
        <Textarea
          placeholder="Write your comment in markdown..."
          className="mb-4 min-h-32 resize-y border-gray-200 dark:border-gray-700 focus-visible:ring-primary dark:focus-visible:ring-primary-light dark:bg-gray-800 dark:text-gray-100"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="flex justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Supports markdown formatting
          </div>
          <Button
            onClick={handleAddComment}
            className="bg-primary hover:bg-primary/90 dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary-light/90 shadow-md hover:shadow-lg transition-all"
          >
            Post Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-soft"
          >
            {/* Comment */}
            <div className="p-4 sm:p-6">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary-light/20 flex items-center justify-center text-primary dark:text-primary-light font-medium">
                    {comment.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {comment.author}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {comment.date}
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
                          onClick={() => handleLike(comment.id)}
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

              <div className="mt-4 flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
                  onClick={() =>
                    setReplyingTo(replyingTo === comment.id ? null : comment.id)
                  }
                >
                  {replyingTo === comment.id ? "Cancel" : "Reply"}
                </Button>
              </div>

              {/* Reply Input */}
              {replyingTo === comment.id && (
                <div className="mt-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                  <Textarea
                    placeholder="Write your reply..."
                    className="mb-3 min-h-24 resize-y border-gray-200 dark:border-gray-700 focus-visible:ring-primary dark:focus-visible:ring-primary-light dark:bg-gray-800 dark:text-gray-100"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleAddReply(comment.id)}
                      className="bg-primary hover:bg-primary/90 dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary-light/90"
                    >
                      Post Reply
                    </Button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  <div className="space-y-4">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="rounded-md bg-gray-50 dark:bg-gray-900 p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary/10 dark:bg-primary-light/20 flex items-center justify-center text-primary dark:text-primary-light font-medium text-xs">
                              {reply.author.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800 dark:text-gray-200">
                                {reply.author}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {reply.date}
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
                                    className="h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
                                    onClick={() =>
                                      handleLike(reply.id, true, comment.id)
                                    }
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Like this reply</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {reply.likes}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          <MarkdownRenderer content={reply.content} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {comments.length > 3 && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="border-primary text-primary dark:border-primary-light dark:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
          >
            Load More Comments
          </Button>
        </div>
      )}
    </div>
  );
}

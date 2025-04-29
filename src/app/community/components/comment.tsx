"use client";

import { MarkdownRenderer } from "./markdown-renderer";
// import CommentReplies from "./comment-replies";
import { PostComment } from "@/lib/types";
import { useMemo, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { useMutation } from "@tanstack/react-query";
import { CommentLikeSchema, LikeType } from "@/lib/forms";
import LikeDislikeCounter from "./like-dislike-counter";
import Avatar from "@/components/site/avatar";
import { Button } from "@/components/ui/button";
import { LucidePencil, LucideTrash } from "lucide-react";
import CommentEditor from "./comment-editor";
import DateFormatter from "./date-formatter";

export default function Comment({
  comment,
  deleteComment,
}: {
  comment: PostComment;
  deleteComment: () => void;
}) {
  const { data, isPending } = authClient.useSession();

  const [editing, setEditing] = useState<boolean>(false);

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

  const profileImage = useMemo(() => {
    return (
      comment.agencyComments[0]?.agency.agencyLogo ||
      comment.userComments[0]?.user.image ||
      ""
    );
  }, [comment.agencyComments, comment.userComments]);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-soft">
      {/* Comment */}
      <div className="p-4 sm:p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              name={commenterName}
              profileImage={profileImage}
              className="h-8 w-8 text-xs"
            />
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {commenterName}
              </div>
              <DateFormatter
                createdAt={comment.createdAt}
                updatedAt={comment.updatedAt}
              />
            </div>
          </div>

          {!editing && (
            <LikeDislikeCounter
              handleLike={handleLike}
              isDisliked={isDisliked}
              isLikePending={isLikePending}
              isLiked={isLiked}
              isPending={isPending}
              likes={likes}
              type="comment"
            />
          )}
        </div>

        <div className="mt-3 text-gray-700 dark:text-gray-300">
          {!editing ? (
            <MarkdownRenderer content={comment.content} />
          ) : (
            <CommentEditor comment={comment} setEditing={setEditing} />
          )}
        </div>

        {!editing && userId === comment?.userComments?.[0].userId && (
          <>
            <div className="mt-4 flex items-center gap-4">
              {/* <Button
                variant="ghost"
                size="sm"
                className="h-8 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
                onClick={() => alert("setReplyingTo(comment.id)")}
              >
                {"123" === comment.id ? (
                  "Cancel"
                ) : (
                  <>
                    <LucideReply className="mr-1 h-4 w-4" /> Reply
                  </>
                )}
              </Button> */}

              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
                onClick={() => setEditing(true)}
              >
                <LucidePencil className="mr-1 h-4 w-4" />
                Edit
              </Button>

              <Button
                variant="destructive"
                size="sm"
                className="bg-red-300 hover:bg-red-400 dark:bg-destructive dark:hover:bg-destructive/90 h-8 text-gray-600 dark:text-gray-400"
                onClick={() => deleteComment()}
              >
                <LucideTrash className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </div>
          </>
        )}

        {/* Reply Input */}
        {/* {'123' === comment.id && (
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
        {/* <CommentReplies deleteComment={deleteComment} replies={null} /> */}
      </div>
    </div>
  );
}

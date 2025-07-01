/**
 * Unused component for displaying replies to comments.
 * This component is not currently used in the application.
 */

import { PostComment } from "@/lib/types";
import Comment from "./comment";

export default function CommentReplies({
  replies,
  deleteComment,
}: {
  replies: PostComment[] | null | undefined;
  deleteComment: () => void;
}) {
  if (!replies) {
    return null;
  }

  return (
    <div className="mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
      <div className="space-y-4">
        {replies.map((reply) => (
          <Comment
            key={reply.id}
            deleteComment={deleteComment}
            comment={reply}
          />
        ))}
      </div>
    </div>
  );
}

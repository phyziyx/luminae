import { PostComment } from "@/lib/types";
import Comment from "./comment";

export default function CommentReplies({
  replies,
}: {
  replies: PostComment[] | null | undefined;
}) {
  if (!replies) {
    return null;
  }

  return (
    <div className="mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
      <div className="space-y-4">
        {replies.map((reply) => (
          <Comment key={reply.id} comment={reply} />
        ))}
      </div>
    </div>
  );
}

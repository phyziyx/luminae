import CommentReply from "./comment-reply";

export default function CommentReplies({
  replies,
}: {
  replies: any[] | null | undefined;
}) {
  if (!replies) {
    return null;
  }

  return (
    <div className="mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
      <div className="space-y-4">
        {replies.map((reply) => (
          <CommentReply key={reply.id} reply={reply} />
        ))}
      </div>
    </div>
  );
}

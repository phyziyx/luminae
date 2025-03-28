import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import CommentForm from "./comment-form";
import CommentList from "./comments-list";
import getQueryClient from "@/lib/react-query";
import { fetchComments } from "@/lib/managers/postManager";

export default async function CommentSection({ postId }: { postId: string }) {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["community/comments", postId],
    queryFn: ({ pageParam }) => {
      return fetchComments({ postId, pageParam });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: { nextCursor?: string }) =>
      lastPage.nextCursor,
  });

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Comments
        {/* <span className="text-[#5B9AFF] dark:text-[#7BABFF]">
          ({comments.length})
        </span> */}
        <div className="mt-1 h-1 w-24 bg-[#5B9AFF] dark:bg-[#7BABFF]"></div>
      </h2>

      {/* Comment Input */}
      <CommentForm postId={postId} />

      {/* Comments List */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CommentList postId={postId} />
      </HydrationBoundary>
    </div>
  );
}

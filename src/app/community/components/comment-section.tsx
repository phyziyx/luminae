import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import CommentForm from "./comment-form";
import CommentList from "./comments-list";
import getQueryClient, { queryKeys } from "@/lib/react-query";
import { fetchComments } from "@/lib/managers/postManager";
import { getSession } from "@/lib/auth/auth";

export default async function CommentSection({ postId }: { postId: string }) {
  const session = await getSession();

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.community.postComments(postId),
    queryFn: ({ pageParam }) => {
      return fetchComments({ postId, pageParam });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: { nextCursor?: string | null }) =>
      lastPage.nextCursor,
  });

  return (
    <div className="w-full">
      <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Comments
        {/* <span className="text-[#5B9AFF] dark:text-[#7BABFF]">
          ({comments.length})
        </span> */}
        <div className="mt-1 h-1 w-24 bg-[#5B9AFF] dark:bg-[#7BABFF]" />
      </h2>

      {/* Comment Input */}
      {session?.user && <CommentForm postId={postId} />}

      {/* Comments List */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CommentList postId={postId} />
      </HydrationBoundary>
    </div>
  );
}

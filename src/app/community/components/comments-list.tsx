"use client";

import InfiniteScrollContainer from "@/components/site/infinite-scroll-container";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import Comment from "./comment";
import { fetchComments } from "@/lib/managers/postManager";
import { LoadingSpinner } from "@/components/site/loading-spinner";

function useComments(postId: string) {
  return useSuspenseInfiniteQuery({
    queryKey: ["community/comments", postId],
    queryFn: ({ pageParam }) => {
      return fetchComments({ postId, pageParam });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: { nextCursor?: string }) =>
      lastPage.nextCursor,
  });
}

export default function CommentsList({ postId }: { postId: string }) {
  const { data, hasNextPage, fetchNextPage, isFetching } = useComments(postId);

  const comments = useMemo(
    () => data?.pages.flatMap((page) => page?.comments || []),
    [data]
  );

  return (
    <InfiniteScrollContainer
      className="space-y-6"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      {isFetching && hasNextPage && (
        <div className="flex justify-center py-4 text-primary">
          <LoadingSpinner />
        </div>
      )}
    </InfiniteScrollContainer>
  );
}

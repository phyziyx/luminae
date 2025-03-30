"use client";

import InfiniteScrollContainer from "@/components/site/infinite-scroll-container";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import Comment from "./comment";
import { fetchComments } from "@/lib/managers/postManager";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { queryKeys } from "@/lib/react-query";
import { BirdIcon, WifiOff } from "lucide-react";

function useComments(postId: string) {
  return useSuspenseInfiniteQuery({
    queryKey: queryKeys.community.postComments(postId),
    queryFn: ({ pageParam }) => {
      return fetchComments({
        postId,
        pageParam: pageParam,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export default function CommentsList({ postId }: { postId: string }) {
  const {
    data,
    isPending,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useComments(postId);

  const comments = useMemo(
    () => data?.pages.flatMap((page) => page?.items),
    [data]
  );

  const groupedComments = useMemo(() => {
    return Object.groupBy(comments, (comment) => comment.parentId || "null");
  }, [comments]);

  const filteredComments = useMemo(() => {
    return (
      groupedComments["null"]?.map((comment) => {
        return {
          ...comment,
          replies: groupedComments[comment.id] || [],
        };
      }) || []
    );
  }, [groupedComments]);

  if (isPending) {
    return (
      <div className="flex justify-center py-4 text-primary" aria-live="polite">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-6"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {filteredComments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      {!isError && !isFetching && comments && !comments.length && (
        <div className="flex flex-col items-center align-middle justify-center py-4 text-gray-500 dark:text-gray-100 gap-4">
          No comments yet. Be the first to comment!
          <BirdIcon size={52} />
        </div>
      )}
      {isError && (
        <div className="flex flex-col items-center align-middle justify-center py-4 text-gray-500 dark:text-gray-100 gap-4">
          Error loading comments. Please try again later.
          <WifiOff size={52} />
        </div>
      )}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4 text-primary">
          <LoadingSpinner />
        </div>
      )}
    </InfiniteScrollContainer>
  );
}

"use client";

import InfiniteScrollContainer from "@/components/site/infinite-scroll-container";
import {
  InfiniteData,
  useMutation,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import Comment from "./comment";
import { fetchComments } from "@/lib/managers/postManager";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import getQueryClient, { queryKeys } from "@/lib/react-query";
import { BirdIcon, WifiOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useDisclosure from "@/hooks/use-disclosure";
import { PostComment } from "@/lib/types";

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

  const { isOpen, open, close } = useDisclosure();
  const queryClient = getQueryClient();

  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );
  const { isPending: isDeleting, mutate: deleteComment } = useMutation({
    mutationFn: async (commentId: string) => {
      return await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/community/comments?id=${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    onSuccess() {
      queryClient.setQueryData<InfiniteData<PostComment>>(
        queryKeys.community.postComments(postId),
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.filter(
              (item) => item.id === selectedCommentId
            ),
          };
        }
      );

      close();
      setSelectedCommentId(null);
    },
  });

  const comments = useMemo(
    () => data?.pages.flatMap((page) => page?.items),
    [data]
  );

  const filteredComments = useMemo(() => {
    return comments?.filter((comment) => !comment.parentId) || [];
  }, [comments]);

  // const groupedComments = useMemo(() => {
  //   return Object.groupBy(comments, (comment) => comment.parentId || "null");
  // }, [comments]);

  // const filteredComments = useMemo(() => {
  //   return (
  //     groupedComments["null"]?.map((comment) => {
  //       return {
  //         ...comment,
  //         replies: groupedComments[comment.id] || [],
  //       };
  //     }) || []
  //   );
  // }, [groupedComments]);

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
        <Comment
          key={comment.id}
          comment={comment}
          deleteComment={() => {
            setSelectedCommentId(comment.id);
            open();
          }}
        />
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

      <Dialog open={isOpen} onOpenChange={(o) => (o ? open() : close())}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Delete Comment?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </DialogDescription>
          <DialogFooter className="mt-6">
            <Button
              disabled={isDeleting}
              type="button"
              variant="outline"
              onClick={close}
              className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
            >
              {isDeleting ? <LoadingSpinner /> : "Cancel"}
            </Button>
            <Button
              disabled={isDeleting}
              onClick={() => deleteComment(selectedCommentId!)}
              type="submit"
              className="bg-red-600 hover:bg-red-500/90 dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary-light/90"
            >
              {isDeleting ? <LoadingSpinner /> : "Delete Comment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </InfiniteScrollContainer>
  );
}

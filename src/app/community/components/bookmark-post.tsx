"use client";

import { useState, useTransition } from "react";
import { onToggleBookmark } from "./actions/bookmarkPost";
import { useToast } from "@/hooks/use-toast";
import { BookmarkIcon } from "lucide-react";

export default function BookmarkPost({
  postId,
  initialBookmarkState,
}: {
  postId: string;
  initialBookmarkState: boolean;
}) {
  const [isBookmarked, setIsBookmarked] =
    useState<boolean>(initialBookmarkState);
  const [bookmarkPending, startBookmarkTransition] = useTransition();
  const { toast } = useToast();

  const handleBookmark = () => {
    startBookmarkTransition(async () => {
      try {
        await onToggleBookmark({ postId });
        setIsBookmarked((prev) => !prev);

        toast({
          description: isBookmarked
            ? "Removed from bookmarks."
            : "Post bookmarked!",
        });
      } catch (err) {
        console.error("Bookmark error:", err);
        toast({
          variant: "destructive",
          description: "Error bookmarking post.",
        });
      }
    });
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={bookmarkPending}
      className="text-primary transition-all duration-200 ease-in-out w-4 h-4 text-xs align-middle items-baseline place-items-baseline place-content-baseline"
    >
      {isBookmarked ? (
        <BookmarkIcon
          className="h-4 w-4 fill-primary"
          aria-label="Remove Bookmark"
        >
          Remove Bookmark
        </BookmarkIcon>
      ) : (
        <BookmarkIcon className="h-4 w-4" aria-label="Bookmark">
          Bookmark
        </BookmarkIcon>
      )}
    </button>
  );
}

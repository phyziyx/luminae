"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CategoryPost } from "@/lib/types";
import { useMemo } from "react";
import LikeDislikeCounter from "./like-dislike-counter";
import { LikeType } from "@prisma/client";
import { PostLikeSchema } from "@/lib/forms";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";
import Author from "./author";
import DateFormatter from "./date-formatter";
import Avatar from "@/components/site/avatar";

export default function PostCard({ post }: { post: CategoryPost }) {
  const { isPending, data: session } = authClient.useSession();

  const authorName = useMemo(
    () =>
      post.agencyPosts[0]?.agency.name ||
      post.userPosts[0]?.user.name ||
      "Unknown Author",
    [post]
  );

  const likeState = useMemo(() => {
    const like = post.likes?.find((like) => like.userId === session?.user.id);
    return like ? like.type : null;
  }, [post.likes, session?.user.id]);

  const likes = useMemo(() => {
    return post.likes?.reduce((acc, like) => {
      if (like.type === "LIKE") {
        return acc + 1;
      } else if (like.type === "DISLIKE") {
        return acc - 1;
      }
      return acc;
    }, 0);
  }, [post.likes]);

  const { isPending: isLikePending, mutate: handleLike } = useMutation({
    mutationFn: async (type: LikeType) => {
      const payload: PostLikeSchema = {
        type,
        postId: post.id,
      };
      return await fetch("/api/community/like/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    },
  });

  return (
    <Card className="overflow-hidden w-full transition-all duration-200 hover:shadow-soft bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary-light/20 flex items-center justify-center text-primary dark:text-primary-light font-medium">
              {authorName.charAt(0)}
            </div> */}
            <Avatar
              profileImage={
                post.userPosts[0]?.user.image ||
                post.agencyPosts[0]?.agency.agencyLogo
              }
              name={authorName}
              className="h-8 w-8"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300 flex flex-row gap-2">
              <Author
                name={authorName}
                id={
                  post.userPosts[0]?.user.id || post.agencyPosts[0]?.agency.id
                }
                isAgency={!!post.agencyPosts[0]?.agency.id}
              />
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <DateFormatter
                updatedAt={post.updatedAt}
                createdAt={post.createdAt}
              />
            </span>
          </div>
        </div>
        <Link
          href={`/community/${post.category.name}/${post.id}`}
          className="group"
        >
          <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {post.content}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-blue-50/30 dark:bg-blue-900/10 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm">{post._count.comments}</span>
          </div>
        </div>
        <LikeDislikeCounter
          handleLike={handleLike}
          isDisliked={likeState === "DISLIKE"}
          isLikePending={isLikePending}
          isLiked={likeState === "LIKE"}
          isPending={isPending}
          likes={likes}
          type="post"
        />
      </CardFooter>
    </Card>
  );
}

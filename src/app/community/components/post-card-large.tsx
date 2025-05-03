"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { CategoryPost } from "@/lib/types";
import LikeDislikeCounter from "./like-dislike-counter";
import { useMemo } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { PostLikeSchema } from "@/lib/forms";
import { LikeType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { PostCategoryBadge } from "./post-category-badge";
import Author from "./author";

export default function PostCardLarge({ post }: { post: CategoryPost }) {
  const { isPending, data: session } = authClient.useSession();

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

  return (
    <Card className="flex flex-grow min-w-full flex-col relative h-full overflow-hidden transition-all duration-200 hover:shadow-soft bg-white dark:bg-gray-800">
      <CardContent className="p-4 top-0 flex flex-col flex-grow">
        <div className="relative mb-2 flex items-center justify-between">
          <PostCategoryBadge name={post.category.name} />
          {/* Date */}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>

        {/* Post Title Link */}
        <Link
          href={`community/${post.category.name}/${post.id}`}
          className="group"
        >
          <h3 className="mb-2 text-xl font-bold text-gray-800 group-hover:text-primary transition-colors dark:text-gray-100 dark:group-hover:text-primary/80">
            {post.title}
          </h3>
        </Link>

        {/* Post Content */}
        <p className="mb-4 text-sm text-gray-600 line-clamp-3 dark:text-gray-400">
          {post.content}
        </p>

        {/* Post Author */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          By{" "}
          <Author
            name={
              post.userPosts[0]?.user.name || post.agencyPosts[0]?.agency.name
            }
            id={post.userPosts[0]?.user.id || post.agencyPosts[0]?.agency.id}
            isAgency={!!post.agencyPosts[0]?.agency.id}
          />
        </div>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="relative bottom-0 w-full flex items-center justify-between border-t border-gray-100 bg-blue-50/30 p-2 dark:border-gray-700 dark:bg-blue-900/30">
        <div className="flex items-center gap-4">
          {/* Comments Section */}
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {post._count.comments}
            </span>
          </div>
        </div>

        <LikeDislikeCounter
          handleLike={handleLike}
          isDisliked={likeState === "DISLIKE"}
          isLiked={likeState === "LIKE"}
          isLikePending={isLikePending}
          isPending={isPending}
          likes={likes}
          type="post"
        />
      </CardFooter>
    </Card>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PostCardLarge({ post }: { post: any }) {
  return (
    <Card className="flex flex-col relative h-full overflow-hidden transition-all duration-200 hover:shadow-soft bg-white dark:bg-gray-800">
      <CardContent className="p-4 top-0 flex flex-col flex-grow">
        <div className="relative mb-2 flex items-center justify-between">
          {/* Category Badge */}
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/20 dark:text-primary/80">
            {post.category}
          </span>
          {/* Date */}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {post.date}
          </span>
        </div>

        {/* Post Title Link */}
        <Link
          href={`community/${post.category}/post/${post.id}`}
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
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {post.author}
          </span>
        </div>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="relative bottom-0 w-full flex items-center justify-between border-t border-gray-100 bg-blue-50/30 p-2 dark:border-gray-700 dark:bg-blue-900/30">
        <div className="flex items-center gap-4">
          {/* Comments Section */}
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {post.comments}
            </span>
          </div>

          {/* Likes Section */}
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {post.likes}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Like Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 hover:text-primary hover:bg-primary/5 dark:text-gray-400 dark:hover:text-primary/80 dark:hover:bg-primary/10"
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>

          {/* Dislike Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 hover:text-primary hover:bg-primary/5 dark:text-gray-400 dark:hover:text-primary/80 dark:hover:bg-primary/10"
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

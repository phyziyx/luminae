import Link from "next/link";
import { MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CategoryPost } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function PostCard({ post }: { post: CategoryPost }) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-soft bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary-light/20 flex items-center justify-center text-primary dark:text-primary-light font-medium">
              {post.author.name.charAt(0)}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {post.author.name}
              </span>{" "}
              • {post.createdAt.toString()}
            </span>
          </div>
        </div>
        <Link href={`/post/${post.id}`} className="group">
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
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm">{post._count.Likes}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

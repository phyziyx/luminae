import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PostCard({ post }: { post: any }) {
  return (
    <Card className="relative h-full overflow-hidden transition-all duration-200 hover:shadow-soft bg-white">
      <CardContent className="p-4 top-0">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {post.category}
          </span>
          <span className="text-xs text-gray-500">{post.date}</span>
        </div>
        <Link
          href={`community/${post.category}/post/${post.id}`}
          className="group"
        >
          <h3 className="mb-2 text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="mb-4 text-sm text-gray-600 line-clamp-3">
          {post.content}
        </p>
        <div className="text-sm text-gray-500">
          By <span className="font-medium text-gray-700">{post.author}</span>
        </div>
      </CardContent>
      <CardFooter className="absolute bottom-0 right-0 flex items-center justify-between border-t border-gray-100 bg-blue-50/30 p-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-gray-600" />
            <span className="text-sm">{post.comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4 text-gray-600" />
            <span className="text-sm">{post.likes}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 hover:text-primary hover:bg-primary/5"
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 hover:text-primary hover:bg-primary/5"
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

/**
 * Unused component for displaying a section of community posts by category.
 * This component is not currently used in the application.
 */

import { MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

function CategorySection({
  title,
  posts,
  category,
}: {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: any[];
  category: string;
}) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 sm:text-2xl">
          {title}
          <div className="mt-1 h-1 w-16 bg-[#5B9AFF] dark:bg-[#7BABFF]"></div>
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary dark:text-primary-light hover:text-primary/90 dark:hover:text-primary-light/90 hover:bg-primary/5 dark:hover:bg-primary-light/10"
          asChild
        >
          <Link href={`/community/${category}`}>See More</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="overflow-hidden transition-all hover:shadow-soft bg-white dark:bg-gray-800"
          >
            <CardContent className="p-5">
              <Link
                href={`/community/${category}/${post.id}`}
                className="group"
              >
                <h3 className="mb-2 text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                  {post.title}
                </h3>
              </Link>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {post.content}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                By{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {post.author}
                </span>{" "}
                • {new Date(post.date).toLocaleString()}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-blue-50/30 dark:bg-blue-900/10 p-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                  <span className="text-xs">{post.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                  <span className="text-xs">{post.likes}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

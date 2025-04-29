import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CategoryPost } from "@/lib/types";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { memo, useMemo } from "react";
import { PostCategoryBadge } from "../../components/post-category-badge";

const SearchItemCard = memo(function SearchItemCard({
  result,
}: {
  result: CategoryPost;
}) {
  const name = useMemo(() => {
    return result.agencyPosts[0]?.agency.name || result.userPosts[0]?.user.name;
  }, [result.agencyPosts, result.userPosts]);

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-soft bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <PostCategoryBadge name={result.category.name} />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {result.createdAt.toString()}
          </span>
        </div>

        <Link
          href={`community/${result.category.name}/post/${result.id}`}
          className="group"
        >
          <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
            {result.title}
          </h3>
        </Link>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {result.content}
        </p>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          By{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {name}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-blue-50/30 dark:bg-blue-900/10 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm">{result._count.comments}</span>
          </div>
          {/* <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm">{result._count.likes}</span>
          </div> */}
        </div>

        <Link
          href={`/post/${result.id}`}
          className="text-sm font-medium text-primary dark:text-primary-light hover:underline"
        >
          Read More
        </Link>
      </CardFooter>
    </Card>
  );
});

export default SearchItemCard;

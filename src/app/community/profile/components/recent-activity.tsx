import Link from "next/link";
import { Calendar, MessageSquare, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Activity {
  id: number;
  type: "post" | "comment";
  title?: string;
  postTitle?: string;
  preview?: string;
  comment?: string;
  date: string;
  engagement: {
    comments?: number;
    likes: number;
  };
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card
          key={activity.id}
          className="overflow-hidden bg-white dark:bg-gray-800 shadow-soft"
        >
          <CardContent className="p-5">
            {activity.type === "post" ? (
              <PostActivity activity={activity} />
            ) : (
              <CommentActivity activity={activity} />
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-blue-50/30 dark:bg-blue-900/10 p-3">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{activity.date}</span>
              </div>

              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{activity.engagement.likes}</span>
              </div>

              {activity.engagement.comments && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{activity.engagement.comments}</span>
                </div>
              )}
            </div>

            <Link
              href={`/community/${activity.id}/${activity.id}`}
              className="text-sm font-medium text-primary dark:text-primary-light hover:underline"
            >
              View {activity.type === "post" ? "Post" : "Comment"}
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function PostActivity({ activity }: { activity: Activity }) {
  return (
    <>
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-full bg-primary/10 dark:bg-primary-light/20 px-2 py-0.5 text-xs font-medium text-primary dark:text-primary-light">
          New Post
        </span>
      </div>

      <Link href={`/community/${activity.id}/${activity.id}`} className="group">
        <h3 className="mb-2 text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
          {activity.title}
        </h3>
      </Link>

      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
        {activity.preview}
      </p>
    </>
  );
}

function CommentActivity({ activity }: { activity: Activity }) {
  return (
    <>
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
          Comment
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          on{" "}
          <Link
            href={`/community/${activity.id}/${activity.id}`}
            className="font-medium text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light"
          >
            {activity.postTitle}
          </Link>
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 italic">
        &quot;{activity.comment}&quot;
      </p>
    </>
  );
}

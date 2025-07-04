import type React from "react";
import { MessageSquare, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsOverviewProps {
  stats: {
    posts: number;
    likes: number;
    comments: number;
  };
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-soft">
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Stats Overview
      </h2>

      <div className="grid gap-4">
        <StatCard
          icon={
            <FileText className="h-5 w-5 text-primary dark:text-primary-light" />
          }
          label="Posts"
          value={stats.posts}
        />

        {/* TODO */}
        {/* <StatCard
          icon={
            <ThumbsUp className="h-5 w-5 text-primary dark:text-primary-light" />
          }
          label="Likes"
          value={stats.likes}
        /> */}

        <StatCard
          icon={
            <MessageSquare className="h-5 w-5 text-primary dark:text-primary-light" />
          }
          label="Comments"
          value={stats.comments}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <Card className="overflow-hidden border-0 bg-blue-50/50 dark:bg-blue-900/10">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {label}
          </span>
        </div>
        <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {value.toLocaleString()}
        </span>
      </CardContent>
    </Card>
  );
}

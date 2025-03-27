"use client";

import { Award, CheckCircle, Star, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BadgeItem {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface BadgesSectionProps {
  badges: BadgeItem[];
}

export default function BadgesSection({ badges }: BadgesSectionProps) {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Award":
        return <Award className="h-6 w-6" />;
      case "ThumbsUp":
        return <ThumbsUp className="h-6 w-6" />;
      case "Star":
        return <Star className="h-6 w-6" />;
      case "CheckCircle":
        return <CheckCircle className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case "blue":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
      case "green":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      case "amber":
        return "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30";
      case "indigo":
        return "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800";
    }
  };

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-soft">
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Badges & Achievements
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <TooltipProvider key={badge.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div
                      className={`p-3 rounded-full mb-2 ${getBadgeColor(
                        badge.color
                      )}`}
                    >
                      {getIconComponent(badge.icon)}
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {badge.name}
                    </span>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Earned for outstanding contributions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}

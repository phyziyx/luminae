"use client";

import { Award, Star, ThumbsUp } from "lucide-react";
import { BadgeKey, SimpleBadge } from "@/lib/types";
import { JSX } from "react";

interface BadgeItem {
  id: number;
  name: string;
  icon: JSX.Element;
  color: string;
}

interface BadgesSectionProps {
  badges: SimpleBadge[];
}

const badgeDetails: Record<BadgeKey, BadgeItem> = {
  FIRST_WORD: {
    id: 1,
    name: "First Post",
    icon: <Award />,
    color: "blue",
  },
  OUT_OF_SHADOWS: {
    id: 2,
    name: "3 Posts",
    icon: <ThumbsUp />,
    color: "green",
  },
  VERIFIED: {
    id: 3,
    name: "Verified Contributor",
    icon: <Star />,
    color: "amber",
  },
  CHATTER_BOX: {
    id: 4,
    name: "Chatter Box",
    icon: <Award />,
    color: "indigo",
  },
  LIKEABLE_ENOUGH: {
    id: 5,
    name: "Likeable Enough",
    icon: <ThumbsUp />,
    color: "yellow",
  },
};

function BadgeChip({ badge }: { badge: SimpleBadge }) {
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
    <div
      className={`flex flex-col align-middle justify-center items-center gap-2 px-3 py-1 rounded-lg w-[100px] h-[100px] ${getBadgeColor(
        badgeDetails[badge.key].color
      )}`}
    >
      <div className="h-6 w-6">{badgeDetails[badge.key].icon}</div>
      <span className="text-sm font-medium">
        {badgeDetails[badge.key].name}
      </span>
    </div>
  );
}

export default function BadgesSection({ badges }: BadgesSectionProps) {
  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-soft">
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Badges & Achievements
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-gray-500 dark:text-gray-400">
            No badges earned yet.
          </div>
        ) : (
          badges.map((badge) => <BadgeChip key={badge.key} badge={badge} />)
        )}
      </div>
    </div>
  );
}

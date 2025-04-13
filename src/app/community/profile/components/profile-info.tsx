"use client";

import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "../../components/markdown-renderer";
import { LucideCheckCircle2 } from "lucide-react";

interface ProfileInfoProps {
  name: string;
  title?: string;
  tagline?: string;
  description?: string;
  isAgency: boolean;
  verified?: boolean;
}

export default function ProfileInfo({
  name,
  title,
  tagline,
  description,
  isAgency,
  verified = false,
}: ProfileInfoProps) {
  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-soft">
      {/* Name + (Verified Icon) */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 sm:text-3xl flex items-center gap-2">
          {name}
          {isAgency && verified && (
            <LucideCheckCircle2 className="h-6 w-6 text-primary dark:text-primary-light" />
          )}
        </h1>

        {/* Title + Tagline Together */}
        <p
          className={cn("text-gray-600 dark:text-gray-300 text-lg", {
            italic: !title && !tagline,
          })}
        >
          {title || tagline
            ? `${title ?? ""}${title && tagline ? " • " : ""}${tagline ?? ""}`
            : "No title or tagline provided."}
        </p>
      </div>

      {/* Description */}
      <div className="prose prose-blue dark:prose-invert max-w-none">
        <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
          {isAgency ? "About Us" : "About Me"}
        </h2>
        <div className="mt-1 h-1 w-24 bg-[#5B9AFF] dark:bg-[#7BABFF]"></div>
        <MarkdownRenderer content={description ?? ""} />
        <p className="text-gray-600 dark:text-gray-300 mt-4 italic">
          {description
            ? "This is your description."
            : "No description provided."}
        </p>
      </div>
    </div>
  );
}

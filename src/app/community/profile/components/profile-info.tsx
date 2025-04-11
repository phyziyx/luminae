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
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 sm:text-3xl flex items-center gap-2 align-middle content-center">
          {name}
          {isAgency && verified && (
            <LucideCheckCircle2 className="h-6 w-6 text-primary dark:text-primary-light" />
          )}
        </h1>
        <p
          className={cn("text-gray-600 dark:text-gray-300", {
            italic: !title,
          })}
        >
          {title || "No title provided."}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          {isAgency ? "About Our Agency" : "About Me"}
        </h2>

        <p
          className={cn("text-gray-600 dark:text-gray-300", {
            italic: !tagline,
          })}
        >
          {tagline || "No tagline provided."}
        </p>
      </div>

      <div className="prose prose-blue dark:prose-invert max-w-none">
        <MarkdownRenderer content={description} />
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "../../../components/markdown-renderer";
import { BadgeCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileInfoProps {
  name: string;
  title?: string;
  tagline?: string;
  description?: string;
  isAgency: boolean;
  verified?: boolean;
  myself?: boolean;
}

function VerificationBadge({
  isVerified,
  myself,
}: {
  isVerified: boolean;
  myself?: boolean;
}) {
  if (!isVerified) {
    if (!myself) {
      return null;
    }

    return (
      <Button variant="outline">
        <BadgeCheckIcon className="h-6 w-6 text-green-500 fill-green-200 dark:fill-green-900 dark:text-primary-light" />
        Get Verified
      </Button>
    );
  }

  return (
    <BadgeCheckIcon className="h-6 w-6 text-green-500 fill-green-200 dark:fill-green-900 dark:text-primary-light" />
  );
}

export default function ProfileInfo({
  name,
  title,
  tagline,
  description,
  isAgency,
  verified = false,
  myself,
}: ProfileInfoProps) {
  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-soft">
      {/* Name + (Verified Icon) */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 sm:text-3xl flex items-center gap-2">
          {name}
          {isAgency && (
            <VerificationBadge isVerified={verified} myself={myself} />
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
        <h2 className="mb-0 text-xl font-bold text-gray-800 dark:text-gray-100">
          {isAgency ? "About Us" : "About Me"}
        </h2>
        <div className="mb-2 h-1 w-24 bg-[#5B9AFF] dark:bg-[#7BABFF]" />
        <MarkdownRenderer content={description ?? ""} />
        <p className="text-gray-600 dark:text-gray-300 mt-4 italic">
          {!description && "No description provided."}
        </p>
      </div>
    </div>
  );
}

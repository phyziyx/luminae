"use client";

import { MarkdownRenderer } from "../../components/markdown-renderer";

interface ProfileInfoProps {
  name: string;
  title: string;
  tagline: string;
  description: string;
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 sm:text-3xl flex items-center gap-2">
          {name}
          {isAgency && verified && (
            <span className="inline-flex items-center" title="Verified Agency">
              <svg
                className="h-5 w-5 text-primary dark:text-primary-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
          )}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">{title}</p>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          {isAgency ? "About Our Agency" : "About Me"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{tagline}</p>
      </div>

      <div className="prose prose-blue dark:prose-invert max-w-none">
        <MarkdownRenderer content={description} />
      </div>
    </div>
  );
}

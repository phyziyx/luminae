import type React from "react";
import Link from "next/link";
import PostManager from "@/lib/managers/postManager";

const helpfulPages = [
  { title: "Community Guidelines", url: "/community/about#guidelines" },
  { title: "How to Format Your Posts", url: "/community/about#faq" },
  { title: "Frequently Asked Questions", url: "/community/about#faq" },
  { title: "Contact Support", url: "/contact" },
  { title: "About Our Community", url: "/community/about" },
];

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-soft">
      <h3 className="mb-4 text-lg font-bold text-primary dark:text-primary-light">
        {title}
        <div className="mt-1 h-1 w-full bg-[#5B9AFF] dark:bg-[#7BABFF]"></div>
      </h3>
      {children}
    </div>
  );
}

export default async function TwoColumnLayout() {
  const topContributors = await PostManager.getTrendingContributors();

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {/* <CategorySection
          title="Trending in Design"
          posts={categoryPosts.design}
          category="design"
        />
        <CategorySection
          title="Trending in Development"
          posts={categoryPosts.development}
          category="development"
        /> */}
      </div>
      <div className="space-y-8">
        <SidebarSection title="Top Contributors This Week">
          <ul className="space-y-3">
            {topContributors.map((contributor, index) => (
              <li
                key={contributor.userName}
                className="flex items-center justify-between rounded-md p-2 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 dark:bg-primary-light/20 text-xs font-medium text-primary dark:text-primary-light">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {contributor.userName}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {contributor.totalCount} contributions
                </span>
              </li>
            ))}
          </ul>
        </SidebarSection>

        <SidebarSection title="Pages That Help">
          <ul className="space-y-2">
            {helpfulPages.map((page) => (
              <li key={page.title}>
                <Link
                  href={page.url}
                  className="block rounded-md p-2 text-gray-600 dark:text-gray-300 transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:text-primary dark:hover:text-primary-light"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </SidebarSection>
      </div>
    </div>
  );
}

import type React from "react";
import Link from "next/link";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Sample data for category posts
const categoryPosts = {
  design: [
    {
      id: 101,
      title: "Color Theory Fundamentals for Digital Design",
      content:
        "Understanding color theory is essential for creating visually appealing designs. Learn about color harmonies, psychology, and practical applications...",
      author: "Jessica Lee",
      comments: 24,
      likes: 87,
      date: "1 day ago",
    },
    {
      id: 102,
      title: "Typography Trends That Will Dominate This Year",
      content:
        "Typography plays a crucial role in design. Discover the latest trends in typography and how to effectively implement them in your projects...",
      author: "Mark Wilson",
      comments: 18,
      likes: 65,
      date: "3 days ago",
    },
  ],
  development: [
    {
      id: 201,
      title: "Getting Started with React Server Components",
      content:
        "React Server Components represent a paradigm shift in how we build React applications. This guide covers the basics and best practices...",
      author: "Alex Turner",
      comments: 32,
      likes: 104,
      date: "2 days ago",
    },
    {
      id: 202,
      title: "Building Accessible Web Applications: A Complete Guide",
      content:
        "Accessibility is not just a nice-to-have feature. Learn how to make your web applications accessible to all users with these practical tips...",
      author: "Sophia Martinez",
      comments: 27,
      likes: 93,
      date: "4 days ago",
    },
  ],
};

// Sample data for top contributors
const topContributors = [
  { username: "dev_master", contributions: 47 },
  { username: "design_guru", contributions: 38 },
  { username: "code_ninja", contributions: 35 },
  { username: "ux_explorer", contributions: 29 },
  { username: "tech_savvy", contributions: 26 },
];

// Sample data for helpful pages
const helpfulPages = [
  { title: "Community Guidelines", url: "/guidelines" },
  { title: "How to Format Your Posts", url: "/formatting" },
  { title: "Frequently Asked Questions", url: "/faq" },
  { title: "Contact Support", url: "/support" },
  { title: "About Our Community", url: "/about" },
];

function CategorySection({
  title,
  posts,
  category,
}: {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: any[];
  category: string;
}) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
          {title}
          <div className="mt-1 h-1 w-16 bg-[#5B9AFF]"></div>
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/90 hover:bg-primary/5"
          asChild
        >
          <Link href={`/community/${category}`}>See More</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="overflow-hidden transition-all hover:shadow-soft bg-white"
          >
            <CardContent className="p-5">
              <Link
                href={`/community/${category}/${post.id}`}
                className="group"
              >
                <h3 className="mb-2 text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
              </Link>
              <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                {post.content}
              </p>
              <div className="text-xs text-gray-500">
                By{" "}
                <span className="font-medium text-gray-700">{post.author}</span>{" "}
                • {post.date}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-gray-100 bg-blue-50/30 p-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5 text-gray-600" />
                  <span className="text-xs">{post.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3.5 w-3.5 text-gray-600" />
                  <span className="text-xs">{post.likes}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-soft">
      <h3 className="mb-4 text-lg font-bold text-primary">
        {title}
        <div className="mt-1 h-1 w-full bg-[#5B9AFF]"></div>
      </h3>
      {children}
    </div>
  );
}

export default function Categories() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <CategorySection
          title="Trending in Design"
          posts={categoryPosts.design}
          category="design"
        />
        <CategorySection
          title="Trending in Development"
          posts={categoryPosts.development}
          category="development"
        />
      </div>
      <div className="space-y-8">
        <SidebarSection title="Top Contributors This Week">
          <ul className="space-y-3">
            {topContributors.map((contributor, index) => (
              <li
                key={contributor.username}
                className="flex items-center justify-between rounded-md p-2 hover:bg-blue-50/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-800">
                    @{contributor.username}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {contributor.contributions} contributions
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
                  className="block rounded-md p-2 text-gray-600 transition-colors hover:bg-blue-50/50 hover:text-primary"
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

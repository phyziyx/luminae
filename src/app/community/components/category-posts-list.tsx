"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data generator for category posts
const generateCategoryPosts = (category: string) => {
  const posts = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories: Record<string, any> = {
    design: {
      titles: [
        "Color Theory Fundamentals for Digital Design",
        "Typography Trends That Will Dominate This Year",
        "UI Animation Principles: Creating Delightful Experiences",
        "Designing for Accessibility: Best Practices",
        "The Psychology of Color in UX Design",
        "Minimalism vs. Maximalism in Modern Web Design",
        "Creating Effective Design Systems for Scale",
        "Visual Hierarchy: Guiding Users Through Your Design",
        "The Art of Whitespace in UI Design",
        "Responsive Design Patterns for Complex Interfaces",
      ],
      authors: [
        "Jessica Lee",
        "Mark Wilson",
        "Sophia Chen",
        "David Park",
        "Emma Rodriguez",
      ],
    },
    development: {
      titles: [
        "Getting Started with React Server Components",
        "Building Accessible Web Applications: A Complete Guide",
        "Optimizing Next.js Applications for Performance",
        "TypeScript Best Practices for Large Codebases",
        "Implementing Authentication with NextAuth.js",
        "State Management Patterns in Modern React",
        "Building a Headless CMS with Next.js and Sanity",
        "Serverless Functions: When and How to Use Them",
        "Testing Strategies for React Applications",
        "Micro-Frontends: Architecture and Implementation",
      ],
      authors: [
        "Alex Turner",
        "Sophia Martinez",
        "James Wilson",
        "Olivia Kim",
        "Ethan Chen",
      ],
    },
    marketing: {
      titles: [
        "How We Increased Conversion Rates by 300% Using This Simple Strategy",
        "Content Marketing Strategies That Drive Engagement",
        "SEO Techniques for 2025: What's Changed?",
        "Building a Social Media Strategy That Converts",
        "Email Marketing Automation: Beyond the Basics",
        "Data-Driven Marketing: Measuring What Matters",
        "Influencer Marketing: Finding the Right Partners",
        "A/B Testing Methodologies for Marketing Campaigns",
        "Customer Journey Mapping for Better Marketing Results",
        "Video Marketing Trends and Best Practices",
      ],
      authors: [
        "Emily Rodriguez",
        "Michael Johnson",
        "Sarah Thompson",
        "Daniel Lee",
        "Rachel Kim",
      ],
    },
  };

  // Default to development if category doesn't exist
  const categoryData = categories[category] || categories.development;

  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i + 1,
      title: categoryData.titles[i] || `Post ${i + 1} about ${category}`,
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      author: categoryData.authors[i % categoryData.authors.length],
      comments: Math.floor(Math.random() * 100),
      likes: Math.floor(Math.random() * 500),
      date: `${Math.floor(Math.random() * 7) + 1} days ago`,
    });
  }

  return posts;
};

export default function CategoryPostsList({ category }: { category: string }) {
  const [sortOption, setSortOption] = useState("latest");
  const posts = generateCategoryPosts(category);

  // Sort posts based on selected option
  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortOption) {
      case "most-commented":
        return b.comments - a.comments;
      case "most-liked":
        return b.likes - a.likes;
      case "latest":
      default:
        // For demo purposes, we'll sort by ID (assuming higher ID = newer)
        return b.id - a.id;
    }
  });

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="text-gray-600">Showing {posts.length} posts</div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px] border-gray-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="most-commented">Most Commented</SelectItem>
              <SelectItem value="most-liked">Most Liked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {sortedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
          Load More
        </Button>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PostCard({ post }: { post: any }) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-soft bg-white">
      <CardContent className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {post.author.charAt(0)}
            </div>
            <span className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">{post.author}</span> •{" "}
              {post.date}
            </span>
          </div>
        </div>
        <Link href={`/post/${post.id}`} className="group">
          <h3 className="mb-2 text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="mb-4 text-sm text-gray-600 line-clamp-3">
          {post.content}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-gray-100 bg-blue-50/30 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-gray-600" />
            <span className="text-sm">{post.comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4 text-gray-600" />
            <span className="text-sm">{post.likes}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 hover:text-primary hover:bg-primary/5"
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 hover:text-primary hover:bg-primary/5"
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

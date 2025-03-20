"use client";

import Link from "next/link";
import { MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Sample data for trending posts
const trendingPosts = [
  {
    id: 1,
    title: "10 Essential UI Design Principles Every Designer Should Know",
    content:
      "User interface design is crucial for creating engaging digital experiences. Here are the top 10 principles that every designer should follow to create intuitive and user-friendly interfaces...",
    author: "Sarah Johnson",
    category: "Design",
    comments: 42,
    likes: 156,
    date: "2 days ago",
  },
  {
    id: 2,
    title: "The Future of Web Development: What to Expect in 2025",
    content:
      "The web development landscape is constantly evolving. From WebAssembly to AI-driven development tools, here's what you can expect to see in the coming years...",
    author: "Michael Chen",
    category: "Development",
    comments: 38,
    likes: 124,
    date: "3 days ago",
  },
  {
    id: 3,
    title:
      "How We Increased Conversion Rates by 300% Using This Simple Strategy",
    content:
      "Our marketing team implemented a data-driven approach that led to a significant increase in conversion rates. Learn about our methodology and how you can apply it to your business...",
    author: "Emily Rodriguez",
    category: "Marketing",
    comments: 27,
    likes: 98,
    date: "4 days ago",
  },
  {
    id: 4,
    title: "Building Scalable Microservices with Node.js and Docker",
    content:
      "Microservices architecture offers numerous benefits for large-scale applications. This guide walks through creating a scalable system using Node.js and containerization with Docker...",
    author: "David Kim",
    category: "Development",
    comments: 31,
    likes: 112,
    date: "1 day ago",
  },
];

export default function TrendingPosts() {
  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Trending <span className="text-[#5B9AFF]">Posts</span>
          <div className="mt-1 h-1 w-24 bg-[#5B9AFF]"></div>
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {trendingPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
        >
          See More Posts
        </Button>
      </div>
    </section>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PostCard({ post }: { post: any }) {
  return (
    <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-soft bg-white">
      <CardContent className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {post.category}
          </span>
          <span className="text-xs text-gray-500">{post.date}</span>
        </div>
        <Link href={`/post/${post.id}`} className="group">
          <h3 className="mb-2 text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="mb-4 text-sm text-gray-600 line-clamp-3">
          {post.content}
        </p>
        <div className="text-sm text-gray-500">
          By <span className="font-medium text-gray-700">{post.author}</span>
        </div>
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

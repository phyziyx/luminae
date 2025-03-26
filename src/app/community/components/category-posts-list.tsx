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

export default function CategoryPostsList({ category }: { category: string }) {
  const [sortOption, setSortOption] = useState("latest");

  const posts = [];
  const sortedPosts = [...posts];

  // // Sort posts based on selected option
  // const sortedPosts = [...posts].sort((a, b) => {
  //   switch (sortOption) {
  //     case "most-commented":
  //       return b.comments - a.comments;
  //     case "most-liked":
  //       return b.likes - a.likes;
  //     case "latest":
  //     default:
  //       // For demo purposes, we'll sort by ID (assuming higher ID = newer)
  //       return b.id - a.id;
  //   }
  // });

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
        <Link href={`/community/${post.category}/${post.id}`} className="group">
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

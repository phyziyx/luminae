import { NextResponse, type NextRequest } from "next/server";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  comments: number;
  likes: number;
  relativeDate: string;
}

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

// export async function GET(request: NextRequest) {
//   const cursorParam = request.nextUrl.searchParams.get("cursor");
//   const cursor = cursorParam ? parseInt(cursorParam) : undefined;

//   const pageSize = 3;

//   const delay = 500;
//   await new Promise((resolve) => setTimeout(resolve, delay));

//   const startIndex = cursor
//     ? trendingPosts.findIndex((post) => post.id === cursor)
//     : 0;

//   const endIndex = startIndex + pageSize;

//   const trendingPostsPaginated = trendingPosts.slice(startIndex, endIndex);

//   return NextResponse.json({
//     posts: trendingPostsPaginated,
//     nextCursor:
//       trendingPosts.length > endIndex ? trendingPosts[endIndex]?.id : undefined,
//   });
// }

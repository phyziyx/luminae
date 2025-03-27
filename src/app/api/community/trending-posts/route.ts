import { NextResponse, type NextRequest } from "next/server";

interface TrendingPosts {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  comments: number;
  likes: number;
  relativeDate: string;
}

const trendingPosts: TrendingPosts[] = [
  {
    id: 1,
    title: "10 Essential UI Design Principles Every Designer Should Know",
    content:
      "User interface design is crucial for creating engaging digital experiences. Here are the top 10 principles that every designer should follow to create intuitive and user-friendly interfaces...",
    author: "Sarah Johnson",
    category: "Design",
    comments: 42,
    likes: 156,
    relativeDate: "2 days ago",
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
    relativeDate: "3 days ago",
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
    relativeDate: "4 days ago",
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
    relativeDate: "1 day ago",
  },
  {
    id: 5,
    title: "The Psychology of Color in Marketing: A Comprehensive Guide",
    content:
      "Color plays a crucial role in marketing and branding. This guide explores the psychology behind color choices and how they influence consumer behavior...",
    author: "Jessica Wong",
    category: "Marketing",
    comments: 35,
    likes: 132,
    relativeDate: "5 days ago",
  },
];

export async function GET(request: NextRequest) {
  const cursorParam = request.nextUrl.searchParams.get("cursor");
  const cursor = cursorParam ? parseInt(cursorParam) : undefined;

  const pageSize = 2;

  const delay = 500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const startIndex = cursor
    ? trendingPosts.findIndex((post) => post.id === cursor)
    : 0;

  const endIndex = startIndex + pageSize;

  const trendingPostsPaginated = trendingPosts.slice(startIndex, endIndex);

  return NextResponse.json({
    posts: trendingPostsPaginated,
    nextCursor:
      trendingPosts.length > endIndex ? trendingPosts[endIndex]?.id : undefined,
  });
}

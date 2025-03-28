import prisma from "@/lib/db";
import { CategoryPost, CategoryPostsResponse } from "@/lib/types";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const cursorParam = request.nextUrl.searchParams.get("cursor");
  const cursor = cursorParam ? cursorParam : undefined;
  const takeLimit = 10;

  const posts: CategoryPost[] = await prisma.post.findMany({
    take: takeLimit,
    skip: cursor ? 1 : undefined,
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    select: {
      id: true,
      title: true,
      content: true,
      authorId: true,
      createdAt: true,
      _count: {
        select: {
          comments: {
            where: {
              deletedAt: null,
            },
          },
          Likes: true,
        },
      },
      Category: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          name: true,
        },
      },
    },
    where: {
      deletedAt: null,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        Likes: {
          _count: "desc",
        },
      },
    ],
  });

  const totalPosts = await prisma.post.count({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const delay = 50;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return NextResponse.json({
    items: posts,
    nextCursor:
      totalPosts > takeLimit ? posts[posts.length - 1]?.id : undefined,
  } satisfies CategoryPostsResponse);
}

import prisma from "@/lib/db";
import { CategoryPost, CategoryPostsResponse } from "@/lib/types";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const sortType = request.nextUrl.searchParams.get("sortType");

  if (!id) {
    return NextResponse.json(
      {
        error: "Category id is required",
      },
      {
        status: 400,
      }
    );
  }

  const foundCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!foundCategory) {
    return NextResponse.json(
      {
        error: "Category not found",
      },
      {
        status: 404,
      }
    );
  }

  const cursorParam = request.nextUrl.searchParams.get("cursor");
  const cursor = cursorParam ? cursorParam : undefined;
  const takeLimit = 10;

  /*
    SELECT Post.id, Post.title, Post.content, Post.authorId, Post.createdAt,
    User.`name`, COUNT(Comment.postId) commentsCount, COUNT(Likes.postId)
    FROM Post
    INNER JOIN User ON User.id = Post.authorId
    LEFT JOIN Comment ON Comment.postId = Post.id AND Comment.deletedAt IS NULL
    LEFT JOIN Likes ON Likes.postId = Post.id
    WHERE categoryId = '0195d962-411b-7417-9af1-acee0335c886' AND Post.deletedAt IS NULL
    ORDER BY Post.id DESC
    LIMIT 10 OFFSET 0;
  */

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
      createdAt: true,
      updatedAt: true,
      image: true,
      tags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
      likes: {
        select: {
          postId: true,
          type: true,
          userId: true,
        },
      },
      _count: {
        select: {
          comments: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      agencyPosts: {
        select: {
          agency: {
            select: {
              id: true,
              name: true,
              agencyLogo: true,
            },
          },
        },
      },
      userPosts: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
    where: {
      categoryId: id,
      deletedAt: null,
    },
    orderBy: {
      ...(sortType === "latest"
        ? { createdAt: "desc" }
        : {
            comments: {
              _count: "desc",
            },
          }),
    },
  });

  const totalPosts = await prisma.post.count({
    where: {
      categoryId: id,
      deletedAt: null,
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

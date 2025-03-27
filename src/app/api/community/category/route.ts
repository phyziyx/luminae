import prisma from "@/lib/db";
import { CategoryPost } from "@/lib/types";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

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
      categoryId: id,
      deletedAt: null,
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
    posts,
    nextCursor:
      totalPosts > takeLimit ? posts[posts.length - 1]?.id : undefined,
  });
}

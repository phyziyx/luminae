import { Comment, Post } from "@prisma/client";
import prisma from "../db";
import { v7 } from "uuid";
import {
  CategoryPost,
  CategoryPostsResponse,
  PostCommentResponse,
} from "../types";

class PostManager {
  public static async findTrending() {
    const posts: CategoryPost[] = await prisma.post.findMany({
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
      orderBy: {
        Likes: {
          _count: "desc",
        },
      },
      take: 10,
    });

    return posts;
  }

  public static async create(data: Exclude<Post, "id">) {
    const post = await prisma.post.create({
      data: {
        ...data,
        id: v7(),
      },
    });

    return post;
  }

  public static async createComment(comment: Comment) {
    const createdComment = await prisma.comment.create({
      data: {
        ...comment,
        id: v7(),
      },
    });

    return createdComment;
  }

  public static async getPostById(id: string) {
    const post: CategoryPost | null = await prisma.post.findUnique({
      where: {
        id,
      },
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
    });

    return post;
  }
}

export default PostManager;

export async function fetchComments({
  postId,
  pageParam,
}: {
  postId: string;
  pageParam?: string | undefined;
}) {
  const response = await fetch(
    `/api/community/comments?postId=${postId}` +
      (pageParam ? `&cursor=${pageParam}` : "")
  );

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  const data: PostCommentResponse = await response.json();
  return data;
}

export async function fetchCategoryPosts({
  category,
  pageParam,
}: {
  category: string;
  pageParam?: string | undefined;
}) {
  const response = await fetch(
    `/api/community/category?id=${category}` +
      (pageParam ? `&cursor=${pageParam}` : "")
  );

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data: CategoryPostsResponse = await response.json();
  return data;
}

export async function fetchTrendingPosts({
  pageParam,
}: {
  pageParam?: string | undefined;
}) {
  const response = await fetch(
    `/api/community/trending` + (pageParam ? `?cursor=${pageParam}` : "")
  );

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data: CategoryPostsResponse = await response.json();
  return data;
}

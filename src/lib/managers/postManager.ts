import { Comment, Post } from "@prisma/client";
import prisma from "../db";
import { v7 } from "uuid";

/*
class PostManager {
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
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          include: {
            replies: true,
          },
        },
      },
    });

    return post;
  }
}

export default PostManager;
*/

export const fetchTrendingPosts = async ({
  pageParam = 0,
}: {
  pageParam?: number;
}) => {
  const response = await fetch(
    `/api/community/trending-posts?cursor=${pageParam}`
  );
  const data: {
    posts: Post[];
    nextCursor: number | undefined;
  } = await response.json();
  return data;
};

export async function fetchCategoryPosts({
  category,
  pageParam = 0,
}: {
  category: string;
  pageParam?: number;
}) {
  const response = await fetch(
    `/api/community/category?name=${category}&page=${pageParam}`
  );
  const data: {
    posts: Post[];
    nextCursor: number | undefined;
  } = await response.json();
  return data;
}

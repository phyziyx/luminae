import { Comment, Post } from "@prisma/client";
import prisma from "../db";
import { v7 } from "uuid";
import {
  CategoryPost,
  CategoryPostsResponse,
  CommentOwner,
  PostCommentResponse,
} from "../types";

class PostManager {
  private static selectAuthor = {
    select: {
      id: true,
      name: true,
      image: true,
    },
  };

  private static selectCategory = {
    select: {
      name: true,
    },
  };

  public static async findTrending() {
    const posts: CategoryPost[] = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        _count: {
          select: {
            comments: {
              where: {
                deletedAt: null,
              },
            },
            likes: true,
          },
        },
        category: { ...PostManager.selectCategory },
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
      },
      orderBy: {
        likes: {
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

  public static async createComment(
    comment: Pick<Comment, "content" | "postId" | "parentId">,
    ownerDetails: CommentOwner
  ) {
    const createdComment = await prisma.comment.create({
      data: {
        ...comment,
        id: v7(),
        agencyComments:
          "agencyId" in ownerDetails
            ? {
                connectOrCreate: {
                  create: {
                    agencyId: ownerDetails.agencyId,
                  },
                  where: {
                    agencyId_commentId: {
                      agencyId: ownerDetails.agencyId,
                      commentId: comment.postId,
                    },
                  },
                },
              }
            : undefined,
        userComments:
          "userId" in ownerDetails
            ? {
                connectOrCreate: {
                  create: {
                    userId: ownerDetails.userId,
                  },
                  where: {
                    userId_commentId: {
                      userId: ownerDetails.userId,
                      commentId: comment.postId,
                    },
                  },
                },
              }
            : undefined,
      },
    });

    return createdComment;
  }

  public static async doesCommentExist(id: string) {
    return await prisma.comment.findUnique({
      select: {
        id: true,
      },
      where: {
        id,
      },
    });
  }

  public static async doesPostExist(id: string) {
    return await prisma.post.findUnique({
      select: {
        id: true,
      },
      where: {
        id,
      },
    });
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
        createdAt: true,
        _count: {
          select: {
            comments: {
              where: {
                deletedAt: null,
              },
            },
            likes: true,
          },
        },
        category: { ...PostManager.selectCategory },
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

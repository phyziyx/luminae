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
    const postIds = await prisma.$queryRaw<
      Array<{
        id: string;
        likeCount: number;
        dislikeCount: number;
        score: number;
      }>
    >`SELECT
      id,
      COUNT(CASE WHEN l.type = 'LIKE' THEN 1 END) AS "likeCount",
      COUNT(CASE WHEN l.type = 'DISLIKE' THEN 1 END) AS "dislikeCount",
      (COUNT(CASE WHEN l.type = 'LIKE' THEN 1 END) - COUNT(CASE WHEN l.type = 'DISLIKE' THEN 1 END)) AS score
      FROM Post p
      LEFT JOIN Likes l ON l.postId = p.id
      WHERE p.deletedAt IS NULL
      GROUP BY p.id
      ORDER BY score DESC
      LIMIT 10
      `;

    const posts: CategoryPost[] = await prisma.post.findMany({
      where: {
        id: {
          in: postIds.map((post) => post.id),
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
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

  public static async toggleBookmark(userId: string, postId: string) {
    // Optional: verify that the Post with postId exists
    const postExists = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!postExists) {
      throw new Error(`Post with ID ${postId} does not exist.`);
    }

    // Check if the user already bookmarked the post
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        bookmarkedPosts: { select: { id: true } },
      },
    });
    if (!user) {
      throw new Error("User not found or not authenticated.");
    }

    const alreadyBookmarked = user.bookmarkedPosts.some((p) => p.id === postId);

    if (alreadyBookmarked) {
      // If bookmarked, disconnect
      return prisma.user.update({
        where: { id: userId },
        data: {
          bookmarkedPosts: {
            disconnect: { id: postId },
          },
        },
      });
    } else {
      // If not bookmarked, connect
      return prisma.user.update({
        where: { id: userId },
        data: {
          bookmarkedPosts: {
            connect: { id: postId },
          },
        },
      });
    }
  }

  public static async getBookmarkedPosts(userId: string) {
    // This finds all posts that have a relation
    // to the user in the `bookmarkedBy` many-to-many field
    return prisma.post.findMany({
      where: {
        bookmarkedBy: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        // Optional: content, or a snippet if you want to show partial text
        content: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
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
  sortType = "latest",
}: {
  category: string;
  pageParam?: string | undefined;
  sortType?: "latest" | "comments";
}) {
  const response = await fetch(
    `/api/community/category?id=${category}` +
      (pageParam ? `&cursor=${pageParam}` : "") +
      (sortType ? `&sortType=${sortType}` : "")
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

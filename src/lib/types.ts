import { Post, Feature, Package, Prisma, Category, User } from "@prisma/client";

export type CategoryPost = Omit<
  Post,
  "updatedAt" | "deletedAt" | "categoryId"
> & {
  category: Pick<Category, "name">;
  _count: {
    comments: number;
    likes: number;
  };
  author: Pick<User, "name">;
};

export type InfiniteQueryResponse<T> = {
  items: T[];
  nextCursor?: string | null;
};

export type PostCommentResponse = InfiniteQueryResponse<PostComment>;
export type CategoryPostsResponse = InfiniteQueryResponse<CategoryPost>;

export type PostComment = {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    name: string;
    id: string;
  };
};

export type PostWithComments = CategoryPost & {
  comments: Prisma.CommentGetPayload<{
    include: {
      author: {
        select: {
          name: true;
          avatar: true;
        };
      };
    };
  }>[];
};

export type NotificationType = "workspace" | "ticket";

export type PricingPackage = Omit<Package, "monthlyPrice"> & {
  monthlyPrice: number;
  features: Feature[];
};

export type LaneTicket = Prisma.TicketGetPayload<{
  include: {
    client: true;
    assigneeUser: true;
  };
}>;

export type KanbanLane = Prisma.LaneGetPayload<{
  include: {
    tickets: {
      include: {
        client: true;
        assigneeUser: true;
      };
    };
  };
}>;

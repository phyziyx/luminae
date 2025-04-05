import {
  Post,
  Feature,
  Package,
  Prisma,
  Category,
  User,
  $Enums,
  Agency,
} from "@prisma/client";

export type CommentOwner =
  | {
      agencyId: string;
    }
  | {
      userId: string;
    };

export type CategoryPost = Omit<
  Post,
  "updatedAt" | "deletedAt" | "categoryId"
> & {
  category: Pick<Category, "name">;
  _count: {
    comments: number;
    likes: number;
  };
  userPosts: {
    user: Pick<User, "id" | "name" | "image">;
  }[];
  agencyPosts: {
    agency: Pick<Agency, "id" | "name" | "agencyLogo">;
  }[];
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
  content: string;
  createdAt: Date;
  updatedAt: Date;
  parentId: string | null;
  agencyComments: {
    agencyId: string;
    agency: Pick<Agency, "id" | "name" | "agencyLogo">;
  }[];
  userComments: {
    userId: string;
    user: Pick<User, "id" | "name" | "image">;
  }[];
  likes: {
    userId: string;
    type: $Enums.LikeType;
    commentId: string;
  }[];
  // children?: Exclude<PostComment, "children">[];
};

export type PostWithComments = CategoryPost & {
  comments: Prisma.CommentGetPayload<{
    include: {
      agencyComments: {
        select: {
          agencyId: true;
          agency: {
            select: {
              id: true;
              name: true;
              agencyLogo: true;
            };
          };
        };
      };
      userComments: {
        select: {
          userId: true;
          user: {
            select: {
              id: true;
              name: true;
              image: true;
            };
          };
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

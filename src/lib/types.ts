import {
  Post,
  Feature,
  Package,
  Prisma,
  Category,
  User,
  $Enums,
  Agency,
  Tag,
  AgencyFile,
  AgencyVerification,
} from "@prisma/client";

export type TopRankedAgency = {
  id: number;
  name: string;
  agencyLogo: string;
  postCount: number;
  commentCount: number;
  score: number;
  rank?: number;
};

export type CommunityProfile = {
  id: string;
  name: string;
  profileImage: string | null;
  bannerImage: string | null;
  isAgency: boolean;
  tagline: string | null;
  content: string | null;
  title: string | null;
};

export type CommunityProfileWithStats = CommunityProfile & {
  stats: {
    posts: number;
    comments: number;
    likes: number;
  };
  badges: SimpleBadge[];
  verified: boolean;
};

export type CommentOwner =
  | {
      agencyId: string;
    }
  | {
      userId: string;
    };

export type CategoryPost = Omit<Post, "deletedAt" | "categoryId"> & {
  category: Pick<Category, "name">;
  _count: {
    comments: number;
  };
  tags: {
    tag: Pick<Tag, "name">;
  }[];
  likes: {
    userId: string;
    type: $Enums.LikeType;
    postId: string;
  }[];
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

export type CategoryPostWithBookmark = CategoryPost & {
  bookmarkedBy?: {
    id: string;
  }[];
};

export type AgencyFilesResponse = InfiniteQueryResponse<AgencyFile>;

export type BadgeKey = "1_post" | "5_post" | "50_posts";

export type SimpleBadge = {
  icon: string;
  key: BadgeKey;
  createdAt: number;
};

export type PaginationMeta = {
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type PaginatedQueryResponse<T> = {
  items: T[];
  meta: PaginationMeta;
};

export type AgencyVerificationRequest = {
  id: string;
  message: string;
  status: $Enums.VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
  attachment?: {
    name: string;
    url: string;
    size: number;
  };
  agency: Pick<Agency, "id" | "name" | "agencyLogo" | "companyEmail">;
};

export type AgencyVerificationResponse =
  PaginatedQueryResponse<AgencyVerificationRequest>;

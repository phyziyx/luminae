import { Post, Feature, Package, Prisma, Category, User } from "@prisma/client";

export type CategoryPost = Omit<
  Post,
  "updatedAt" | "deletedAt" | "categoryId"
> & {
  Category: Pick<Category, "name">;
  _count: {
    comments: number;
    Likes: number;
  };
  author: Pick<User, "name">;
};

export type CategoryPostsResponse = {
  posts: CategoryPost[];
  nextCursor?: string | undefined;
};

export type NotificationType = "workspace" | "ticket";

export type PricingPackage = Omit<Package, "monthlyPrice"> & {
  monthlyPrice: number;
  features: Feature[];
};

export type LaneTicket = Prisma.TicketGetPayload<{
  include: {
    Client: true;
    assigneeUser: true;
  };
}>;

export type KanbanLane = Prisma.LaneGetPayload<{
  include: {
    Tickets: {
      include: {
        Client: true;
        assigneeUser: true;
      };
    };
  };
}>;

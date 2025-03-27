import { Post, Feature, Package, Prisma } from "@prisma/client";

export type CategoryPost = Omit<
  Post,
  "updatedAt" | "deletedAt" | "categoryId"
> & {
  _count: {
    comments: number;
    Likes: number;
  };
  author: {
    name: string;
  };
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

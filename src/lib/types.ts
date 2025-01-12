import { Feature, Package, Prisma } from "@prisma/client";

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

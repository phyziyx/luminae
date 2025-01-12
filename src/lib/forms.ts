import { z } from "zod";

// Kanban Board: Lane Name Edit

export const laneNameEditSchema = z.object({
  name: z.string(),
});

export type LaneNameEditSchema = z.infer<typeof laneNameEditSchema>;

// Kanban Board: Create Lane

export const createLaneSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Agency name must be atleast 2 chars." }),
  colour: z.string().min(6, { message: "Colour must be a valid hex code." }),
});

export type CreateLaneSchema = z.infer<typeof createLaneSchema>;

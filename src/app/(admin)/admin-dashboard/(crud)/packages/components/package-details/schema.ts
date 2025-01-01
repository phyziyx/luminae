import { z } from "zod";

const packageFormSchema = z.object({
  id: z.string().min(1).optional(), // Optional since it may already exist
  name: z
    .string()
    .min(2, { message: "Package name must be at least 2 characters." }),
  features: z.array(
    z.object({
      code: z.enum(["TEAM_MEMBERS", "WORKSPACE", "FILE_STORAGE", "CUSTOM_URL"]), // Limits to specific feature types
      maxLimit: z.preprocess(
        (input) => {
          const processed = z.string().regex(/^\d+$/).transform(Number).safeParse(input);
          return processed.success ? processed.data : input;
        },
        z.number().min(0, { message: "Max limit must be a positive value." }),
      ),
      hasAccess: z.boolean().optional(), // Represents if the feature is available
    })
  ),
});

export default packageFormSchema;
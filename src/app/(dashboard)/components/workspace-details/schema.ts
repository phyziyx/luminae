import { z } from "zod";

const formSchema = z.object({
  id: z.string().min(1).optional().or(z.literal("")),
  name: z
    .string()
    .min(2, { message: "Workspace name must be atleast 2 chars." }),
  description: z.string().min(1),
});

export default formSchema;

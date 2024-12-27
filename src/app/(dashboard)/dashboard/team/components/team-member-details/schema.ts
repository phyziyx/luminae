import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["AGENCY_ADMIN", "AGENCY_USER", "AGENCY_OWNER"], {
    invalid_type_error: "Select a role",
    required_error: "Please select a role",
  }),
  workspaces: z.array(
    z.object({
      id: z.string(),
      access: z.boolean(),
      manager: z.boolean(),
    })
  ),
});

export default formSchema;

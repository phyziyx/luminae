import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["AGENCY_ADMIN", "AGENCY_USER"], {
    invalid_type_error: "Select a role",
    required_error: "Please select a role",
  }),
});

export default formSchema;

import { z } from "zod";

const formSchema = z.object({
  id: z.string().min(1).optional(),
  agencyLogo: z.string().optional(),
  name: z.string().min(2, { message: "Agency name must be atleast 2 chars." }),
  companyEmail: z.string().min(1),
  companyPhone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
});

export default formSchema;

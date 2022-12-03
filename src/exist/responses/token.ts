import { z } from "zod";

export const ExistTokenResponseSchema = z.object({
  token: z.string(),
});

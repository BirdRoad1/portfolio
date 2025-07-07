import z from "zod";

export const envSchema = z.object({
  JWT_SECRET: z.string().length(32),
});

import { z } from "zod";

export const createQuestionValidator = z.object({
  question: z.string().min(5).max(500),
  options: z
    .array(z.object({ text: z.string().min(2).max(300) }))
    .min(2)
    .max(20),
});

export type CreateQuestionInputType = z.infer<typeof createQuestionValidator>;

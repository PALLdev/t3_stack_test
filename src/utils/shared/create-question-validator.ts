import { z } from "zod";

export const createQuestionValidator = z.object({
  question: z.string().min(5).max(500),
});

export type CreateQuestionInputType = z.infer<typeof createQuestionValidator>;
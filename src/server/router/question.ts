import { z } from "zod";
import { createRouter } from "./context";

export const questionRouter = createRouter()
  .query("get-all", {
    async resolve({ ctx }) {
      return await ctx.prisma.pollQuestion.findMany();
    },
  })
  .query("get-by-id", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const question = await ctx.prisma.pollQuestion.findFirst({
        where: {
          id: input.id,
        },
      });
      if (!question) return;

      return { question, isOwner: question.ownerToken === ctx.token };
    },
  })
  .mutation("create", {
    input: z.object({
      question: z.string().min(5).max(500),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.token) return;
      return await ctx.prisma.pollQuestion.create({
        data: {
          question: input.question,
          options: [],
          ownerToken: ctx.token,
        },
      });
    },
  });

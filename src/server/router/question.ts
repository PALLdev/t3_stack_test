import { z } from "zod";
import { createQuestionValidator } from "../../utils/shared/create-question-validator";
import { createRouter } from "./context";

export const questionRouter = createRouter()
  .query("get-all-mine", {
    async resolve({ ctx }) {
      if (!ctx.token) return [];

      return await ctx.prisma.pollQuestion.findMany({
        where: {
          ownerToken: {
            equals: ctx.token,
          },
        },
      });
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

      const myVote = await ctx.prisma.vote.findFirst({
        where: {
          questionId: input.id,
          voterToken: ctx.token,
        },
      });

      return {
        question,
        isOwner: question.ownerToken === ctx.token,
        vote: myVote,
      };
    },
  })
  .mutation("create", {
    input: createQuestionValidator,
    async resolve({ ctx, input }) {
      if (!ctx.token) throw new Error("NO AUTORIZADO");

      return await ctx.prisma.pollQuestion.create({
        data: {
          question: input.question,
          options: input.options,
          ownerToken: ctx.token,
        },
      });
    },
  })
  .mutation("vote-on-question", {
    input: z.object({
      questionId: z.string(),
      option: z.number(),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.token) throw new Error("NO AUTORIZADO");

      return await ctx.prisma.vote.create({
        data: {
          questionId: input.questionId,
          voterToken: ctx.token,
          choice: input.option,
        },
      });
    },
  });

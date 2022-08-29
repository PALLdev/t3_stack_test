import { createRouter } from "./context";

export const questionRouter = createRouter().query("get-all", {
  async resolve({ ctx }) {
    return await ctx.prisma.pollQuestion.findMany();
  },
});

import { createRouter } from "./context";
import { z } from "zod";

export const blogRouter = createRouter()
  .mutation("create", {
    input: z.object({
      title: z.string(),
      content: z.string(),
    }),
    resolve({ input, ctx }) {
      return ctx.prisma.blog.create({
        data: {
          title: input.title,
          content: input.content,
        },
      });
    },
  })
  .mutation("updateById", {
    input: z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
    }),
    resolve({ input, ctx }) {
      return ctx.prisma.blog.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          content: input.content,
        },
      });
    },
  })
  .mutation("deleteById", {
    input: z.object({
      id: z.string(),
    }),
    resolve({ ctx, input }) {
      return ctx.prisma.blog.delete({
        where: {
          id: input.id,
        },
      });
    },
  })
  .query("all", {
    resolve({ ctx }) {
      return ctx.prisma.blog.findMany();
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    resolve({ ctx, input }) {
      return ctx.prisma.blog.findUnique({
        where: {
          id: input.id,
        },
      });
    },
  });

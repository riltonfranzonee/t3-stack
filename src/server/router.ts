import * as trpc from "@trpc/server";
import { z } from "zod";
import { Context } from "./context";

export const serverRouter = trpc
  .router<Context>()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      return ctx.prisma.groceryList.findMany();
    },
  })
  .mutation("insertOne", {
    input: z.object({
      title: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      return ctx.prisma.groceryList.create({
        data: { title: input.title },
      });
    },
  })
  .mutation("updateOne", {
    input: z.object({
      id: z.number(),
      title: z.string(),
      checked: z.boolean(),
    }),
    resolve: async ({ input, ctx }) => {
      const { id, ...updatedData } = input;

      return ctx.prisma.groceryList.update({
        where: { id },
        data: updatedData,
      });
    },
  })
  .mutation("deleteAll", {
    input: z.object({
      ids: z.number().array(),
    }),
    resolve: ({ input, ctx }) => {
      const { ids } = input;

      return ctx.prisma.groceryList.deleteMany({
        where: { id: { in: ids } },
      });
    },
  })
  .mutation("deleteOne", {
    input: z.object({
      id: z.number(),
    }),
    resolve: async ({ input, ctx }) => {
      const { id } = input;

      return ctx.prisma.groceryList.delete({
        where: {
          id,
        },
      });
    },
  });

export type ServerRouter = typeof serverRouter;

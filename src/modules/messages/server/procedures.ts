import { MessageRole, MessageType } from "@/generated/prisma";
import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(z.object({
      projectId: z.string().min(1, "Project ID cannot be empty"),
    }))
    .query(async ({ input }) => {

      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          fragment: true,
        }
      });
      return messages;
    }),
  create: baseProcedure
    .input(z.object({
      value: z.string().min(1, "Prompt cannot be empty").max(1000, "Prompt is too long"),
      projectId: z.string().min(1, "Project ID cannot be empty"),
    }))
    .mutation(async ({ input }) => {
      const createMessage = await prisma.message.create({
        data: {
          projectId: input.projectId,
          content: input.value,
          role: MessageRole.USER,
          type: MessageType.RESULT,

        },
      });
      await inngest.send({
        name: 'code-agent/run',
        data: {
          value: input.value,
          projectId: input.projectId,
        }
      });

      return createMessage;
    }),
});

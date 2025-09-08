import { MessageRole, MessageType } from "@/generated/prisma";
import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      take: 100,
    });
    return messages;
  }),
  create: baseProcedure
    .input(z.object({
      value: z.string().min(1, "Message cannot be empty"),
    }))
    .mutation(async ({ input }) => {
      const createMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: MessageRole.USER,
          type: MessageType.RESULT,
        },
      });
      await inngest.send({
        name: 'code-agent/run',
        data: {
          value: input.value,
        }
      });

      return createMessage;
    }),
});

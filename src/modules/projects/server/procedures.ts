import { MessageRole, MessageType } from "@/generated/prisma";
import { generateSlug } from "random-word-slugs";
import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({
      id: z.string().min(1, "Id Required"),
    }))
    .query(async ({ input, ctx }) => {


      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        }
      });

      if (!existingProject) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Project with ID ${input.id} not found`,
        });
      }

      return existingProject;
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
    return projects;
  }),
  create: protectedProcedure
    .input(z.object({
      value: z.string().min(1, "Prompt cannot be empty").max(1000, "Prompt is too long"),
    }))
    .mutation(async ({ input, ctx }) => {

      try {
        await consumeCredits();
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Something went wrong" + error.message,
          });
        } else {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: "You have run out of credits. Please upgrade your plan.",
          });
        }
      }

      const createProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId,
          name: generateSlug(2, {
            format: "kebab"
          }),
          messages: {
            create: {
              content: input.value,
              role: MessageRole.USER,
              type: MessageType.RESULT,
            }
          }
        },
      });


      await inngest.send({
        name: 'code-agent/run',
        data: {
          value: input.value,
          projectId: createProject.id,
        }
      });

      return createProject;
    }),
});

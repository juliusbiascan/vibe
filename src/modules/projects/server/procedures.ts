import { MessageRole, MessageType } from "@/generated/prisma";
import { generateSlug } from "random-word-slugs";
import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const projectsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      take: 100,
    });
    return projects;
  }),
  create: baseProcedure
    .input(z.object({
      value: z.string().min(1, "Prompt cannot be empty").max(1000, "Prompt is too long"),
    }))
    .mutation(async ({ input }) => {
      const createProject = await prisma.project.create({
        data: {
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

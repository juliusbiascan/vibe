"use client"

// import { useTRPC } from "@/trpc/client";
// import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { MessagesContainer } from "../components/messages-container";
import { Suspense } from "react";
import { Fragment } from "@/generated/prisma";
import React from "react";
import ProjectHeader from "../components/project-header";
import { FragmentWeb } from "../components/fragment-web";

interface ProjectViewProps {
  projectId: string;
}
export const ProjectView = ({ projectId }: ProjectViewProps) => {

  const [activeFragment, setActiveFragment] = React.useState<Fragment | null>(null);


  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0">
          <Suspense fallback={<div>Loading Project...</div>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<div>Loading Messages...</div>}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel >
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={65}
          minSize={50}>

          {!!activeFragment && <FragmentWeb data={activeFragment} />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
import { CodeIcon, CrownIcon, EyeIcon, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileExplorer } from "@/components/file-explorer";
import { ErrorBoundary } from "react-error-boundary";
import { UserControl } from "@/components/user-control";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectViewProps {
  projectId: string;
}
export const ProjectView = ({ projectId }: ProjectViewProps) => {
  const [activeFragment, setActiveFragment] = React.useState<Fragment | null>(null);
  const [tabState, setTabState] = React.useState("preview");
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (isMobile) {
      setTabState((prev) => (prev === "chat" ? prev : "chat"));
    } else {
      setTabState((prev) => (prev === "preview" || prev === "code" ? prev : "preview"));
    }
  }, [isMobile]);

  return (
    <div className="h-[100dvh] sm:h-screen">
      <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"}>
        {!isMobile && (
          <ResizablePanel
            defaultSize={isMobile ? 45 : 35}
            minSize={isMobile ? 30 : 20}
            className="flex flex-col min-h-0">
            <ErrorBoundary
              fallback={
                <div>Something went wrong loading this project header.</div>
              }
            >
              <Suspense fallback={<div>Loading Project...</div>}>
                <ProjectHeader projectId={projectId} />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary
              fallback={
                <div>Something went wrong loading this message.</div>
              }
            >
              <Suspense fallback={<div>Loading Messages...</div>}>
                <MessagesContainer
                  projectId={projectId}
                  activeFragment={activeFragment}
                  setActiveFragment={setActiveFragment}
                />
              </Suspense>
            </ErrorBoundary>


          </ResizablePanel >
        )}
        {!isMobile && (
          <ResizableHandle className="hover:bg-primary transition-colors" />
        )}
        <ResizablePanel
          defaultSize={isMobile ? 55 : 65}
          minSize={isMobile ? 40 : 50}>

          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}>

            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-9 sm:h-8 p-0 border rounded-md flex gap-1 sm:gap-0 overflow-x-auto whitespace-nowrap scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
                {isMobile && (
                  <TabsTrigger value="chat" className="rounded-md text-xs sm:text-sm px-2 sm:px-3 gap-1">
                    <MessageSquare />
                    Chat
                  </TabsTrigger>
                )}
                <TabsTrigger value="preview" className="rounded-md text-xs sm:text-sm px-2 sm:px-3 gap-1">
                  <EyeIcon />
                  Demo
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md text-xs sm:text-sm px-2 sm:px-3 gap-1">
                  <CodeIcon />
                  Code
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2 ">
                <Button
                  asChild
                  className="h-8 px-2 rounded-md border"
                  onClick={() => { }}
                  variant={'tertiary'}
                >
                  <Link href={"/pricing"}>
                    <CrownIcon /> Upgrade
                  </Link>
                </Button>

                <UserControl showName={false} />
              </div>
            </div>
            {isMobile && (
              <TabsContent value={"chat"} className="flex flex-col min-h-0">
                <ErrorBoundary
                  fallback={
                    <div>Something went wrong loading this message.</div>
                  }
                >
                  <Suspense fallback={<div>Loading Messages...</div>}>
                    <MessagesContainer
                      projectId={projectId}
                      activeFragment={activeFragment}
                      setActiveFragment={setActiveFragment}
                    />
                  </Suspense>
                </ErrorBoundary>
              </TabsContent>
            )}
            <TabsContent value={"preview"}>
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>

            <TabsContent value={"code"} className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer files={activeFragment.files as { [path: string]: string }} />
              )}
            </TabsContent>
          </Tabs>

        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
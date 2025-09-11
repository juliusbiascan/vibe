import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState, useCallback, Fragment, useMemo } from "react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { CodeView } from "@/components/code-view";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";

import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "@/components/tree-view";
import { Button as UIButton } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type FileCollection = { [path: string]: string };

function getLanguageFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension || "text";
}

interface FilebreadcrumbProps {
  filePath: string;
}

const FileBreadcrumb = ({ filePath }: FilebreadcrumbProps) => {
  const pathSegments = filePath.split("/");
  const maxSegments = 3; // Maximum segments to show before collapsing

  const renderBreadcrumbItems = () => {
    if (pathSegments.length <= maxSegments) {

      // Show all segments
      return pathSegments.map((segment, index) => {

        const isLast = index === pathSegments.length - 1;

        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage
                  className="font-medium">
                  {segment}
                </BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground">
                  {segment}
                </span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        )
      });
    } else {
      const firstSegment = pathSegments[0];
      const lastSegments = pathSegments[pathSegments.length - 1];
      return (
        <>
          <BreadcrumbItem>
            <span
              className="text-muted-foreground">
              {firstSegment}
            </span>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">
                {lastSegments}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbItem>
        </>
      )
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {renderBreadcrumbItems()}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

interface FileExplorerProps {
  files: FileCollection
}

export const FileExplorer = ({ files }: FileExplorerProps) => {

  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();
  const [showFiles, setShowFiles] = useState(false);

  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback((filePath: string) => {
    if (files[filePath]) {
      setSelectedFile(filePath);
      if (isMobile) {
        setShowFiles(false);
      }
    }
  }, [files, isMobile]);


  const handleCopy = useCallback(() => {
    if (selectedFile) {
      navigator.clipboard.writeText(files[selectedFile]);
      setCopied(true);
      setTimeout(() => {
        setCopied(false)
      }, 2000);
    }
  }, [selectedFile, files]);

  if (isMobile) {
    return (
      <div className="h-full w-full flex flex-col">
        <div className="border-b bg-sidebar px-2 py-2 flex items-center gap-x-2">
          {showFiles ? (
            <span className="text-sm font-medium">Files</span>
          ) : (
            selectedFile ? <FileBreadcrumb filePath={selectedFile} /> : <span className="text-muted-foreground text-sm">No file selected</span>
          )}
          <div className="ml-auto flex items-center gap-x-2">
            {!showFiles && (
              <Hint text="Copy to clipboard" side="bottom">
                <Button
                  variant={'outline'}
                  size={'icon'}
                  onClick={handleCopy}
                  disabled={copied}>
                  {copied ? <CopyCheckIcon /> : <CopyIcon />}
                </Button>
              </Hint>
            )}
            <UIButton
              variant={'outline'}
              className="h-8 px-3"
              onClick={() => setShowFiles((v) => !v)}>
              {showFiles ? 'Close' : 'Files'}
            </UIButton>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          {showFiles ? (
            <div className="h-full overflow-auto p-2">
              <TreeView
                data={treeData}
                value={selectedFile}
                onSelect={handleFileSelect}
              />
            </div>
          ) : selectedFile && files[selectedFile] ? (
            <div className="h-full w-full flex flex-col">
              <div className="flex-1 overflow-auto">
                <CodeView
                  lang={getLanguageFromExtension(selectedFile)}
                  code={files[selectedFile]}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No file selected
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        defaultSize={30}
        minSize={30}>
        <TreeView
          data={treeData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel
        defaultSize={70}
        minSize={50}>
        {selectedFile && files[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
              <FileBreadcrumb filePath={selectedFile} />
              <Hint text="Copy to clipboard" side="bottom">
                <Button
                  variant={'outline'}
                  size={'icon'}
                  className="ml-auto"
                  onClick={handleCopy}
                  disabled={copied}>
                  {copied ? <CopyCheckIcon /> : <CopyIcon />}
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-auto">
              <CodeView
                lang={getLanguageFromExtension(selectedFile)}
                code={files[selectedFile]}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No file selected
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
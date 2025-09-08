import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma";
import { ExternalLink, RefreshCcwIcon } from "lucide-react";
import React from "react";

interface Props {
  data: Fragment;
}

export function FragmentWeb({ data }: Props) {
  const [copied, setCopied] = React.useState(false);
  const [fragmentKey, setFragmentKey] = React.useState(0);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl || "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col w-full h-full ">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text={"Refresh"} side="bottom">
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}>
            <RefreshCcwIcon />

          </Button>
        </Hint>
        <Hint text={copied ? "Copied!" : "Copy to clipboard"} side="bottom">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            disabled={!data.sandboxUrl || copied}
            className="flex-1 justify-start text-start font-normal">
            <span className="truncate">
              {data.sandboxUrl}
            </span>
          </Button>
        </Hint>
        <Hint text={data.sandboxUrl ? "Open in new tab" : "No preview available"} side="bottom" align="start">
          <Button
            size={"sm"}
            disabled={!data.sandboxUrl}
            variant="outline"
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}>
            <ExternalLink className="size-4" />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        className="h-full w-full border-0"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxUrl}
      />
    </div>
  )
}
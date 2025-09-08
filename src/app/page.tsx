"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const Page = () => {
  const [value, setValue] = React.useState("");
  const trpc = useTRPC();
  const { data: messages } = useQuery(
    trpc.messages.getMany.queryOptions()
  );

  const invoke = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        toast.success("Message created");
      }
    })
  )
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        disabled={invoke.isPending}
        onClick={() => {
          invoke.mutate(
            {
              value: value,
            }
          );
        }}>
        Invoke Background Jobs
      </Button>

      {messages?.map((message) => (
        <div key={message.id} className="p-2 border-b">
          <p><strong>{message.role}:</strong> {message.content}</p>
        </div>
      ))}
    </div>
  )
}

export default Page;
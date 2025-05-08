"use client";

import { useChat} from "ai/react";
import React from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Loader, Send } from "lucide-react";
import { Separator } from "../../../components/ui/separator";
import Messages from "./messages";
import { Navbar } from "../_components/navbar";

export default function ChatWrapper() {
  const { isLoading, messages, handleInputChange, input, handleSubmit } =
    useChat({
      api: "/api/chat-stream",
   
    });

  return (
    <div className="flex h-screen">

      <div className="flex-1 max-w-3xl mx-auto w-full p-4 flex flex-col">
      
        <Messages messages={messages} />

        <Separator className="my-2 bg-border/50" />

        <div className="p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              className="flex-grow"
              placeholder="Ask me related to health"
              value={input}
              onChange={handleInputChange}
            />
            <Button disabled={isLoading} size="icon" type="submit">
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Copy, 
  Send, 
  User, 
  Bot, 
  MessageCircle, 
  Loader2,
  Check,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
};

const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to the bottom of the chat when a new message is added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Function to handle sending a message
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: ChatMessage = { 
      role: "user", 
      content: inputValue,
      timestamp: new Date()
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch AI response");
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const formatTime = (timestamp?: Date) => {
    if (!timestamp) return "";
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Card className="rounded-none border-b shadow-sm bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600" />
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                  Online
                </Badge>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Onco Sight AI Assistant
                </h1>
                <p className="text-sm text-gray-600">
                  Specialized in cancer related healthcare queries.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-6">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <Card className="max-w-md">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <MessageCircle className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700">
                        Welcome to Onco Sight AI
                      </h3>
                      <p className="text-gray-500">
                      I'm here to help with any questions related to cancer detection. Feel free to ask about symptoms, treatments, or general information.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3",
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <Avatar className="flex-shrink-0">
                      <AvatarFallback className={cn(
                        message.role === "user" 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-200 text-gray-600"
                      )}>
                        {message.role === "user" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div className={cn(
                      "max-w-[75%]",
                      message.role === "user" ? "text-right" : "text-left"
                    )}>
                      <Card className={cn(
                        "relative group shadow-sm",
                        message.role === "user"
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-800"
                      )}>
                        <CardContent className="p-4">
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                          
                          {message.role === "assistant" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(message.content, index)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                            >
                              {copiedIndex === index ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                      
                      <div className={cn(
                        "text-xs text-gray-500 mt-1",
                        message.role === "user" ? "text-right" : "text-left"
                      )}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>

          <Card className="rounded-none border-t bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about cancer related queries..."
                    disabled={isLoading}
                    className="pr-12 h-12 resize-none"
                  />
                  <Send className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="lg"
                  className="h-12 px-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
              <Separator className="my-2" />
              <div className="text-xs text-gray-500 text-center">
                Press Enter to send • This AI provides educational information only, not medical advice
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
import { cn } from "@/lib/utils";
import type { TranscriptMessage } from "@/hooks/useOscar";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ui/conversation";
import { MessageCircle, User, Bot } from "lucide-react";

interface TranscriptViewProps {
  messages: TranscriptMessage[];
  className?: string;
}

export function TranscriptView({ messages, className }: TranscriptViewProps) {
  return (
    <Conversation className={cn("flex-1", className)}>
      <ConversationContent className="space-y-3">
        {messages.length === 0 ? (
          <ConversationEmptyState
            title="No conversation yet"
            description="Start a meeting to begin the conversation"
            icon={<MessageCircle className="h-8 w-8" />}
          />
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 rounded-lg p-3",
                message.role === "user"
                  ? "bg-primary/5 ml-4"
                  : "bg-muted/50 mr-4"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {message.role === "user" ? "You" : "Oscar"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-foreground/90">{message.content}</p>
              </div>
            </div>
          ))
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}

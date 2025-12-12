import { cn } from "@/lib/utils";
import type { TranscriptMessage } from "@/hooks/useOscar";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ui/conversation";

interface TranscriptViewProps {
  messages: TranscriptMessage[];
  className?: string;
}

export function TranscriptView({ messages, className }: TranscriptViewProps) {
  return (
    <Conversation className={cn("flex-1", className)}>
      <ConversationContent className="space-y-2 p-3">
        {messages.length === 0 ? (
          <ConversationEmptyState
            title="No messages"
            description="Start a meeting to chat"
          />
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "text-sm py-2 px-3 rounded",
                message.role === "user" ? "bg-neutral-800" : "bg-transparent"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {message.role === "user" ? "You" : "Oscar"}
                </span>
                <span className="text-[10px] text-muted-foreground/60">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-foreground/90 leading-relaxed">
                {message.content}
              </p>
            </div>
          ))
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}

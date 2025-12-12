import { cn } from "@/lib/utils";
import type { ToolCall } from "@/hooks/useOscar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface ToolsHistoryProps {
  toolCalls: ToolCall[];
  className?: string;
}

export function ToolsHistory({ toolCalls, className }: ToolsHistoryProps) {
  if (toolCalls.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center py-8 text-muted-foreground text-sm",
          className
        )}
      >
        No tool calls
      </div>
    );
  }

  return (
    <ScrollArea className={cn("flex-1", className)}>
      <div className="space-y-1 p-3">
        {toolCalls.map((tool) => (
          <div
            key={tool.id}
            className="flex items-start gap-2 py-2 px-2 rounded hover:bg-neutral-800/50 transition-colors"
          >
            <div className="mt-0.5">
              {tool.status === "pending" && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              )}
              {tool.status === "success" && (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              )}
              {tool.status === "error" && (
                <XCircle className="h-3.5 w-3.5 text-red-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-foreground">
                  {tool.name}
                </span>
                <span className="text-[10px] text-muted-foreground/60">
                  {tool.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
              {tool.result && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {tool.result}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

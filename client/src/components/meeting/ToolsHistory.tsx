import { cn } from "@/lib/utils";
import type { ToolCall } from "@/hooks/useOscar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wrench, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface ToolsHistoryProps {
  toolCalls: ToolCall[];
  className?: string;
}

export function ToolsHistory({ toolCalls, className }: ToolsHistoryProps) {
  if (toolCalls.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-8 text-center text-muted-foreground",
          className
        )}
      >
        <Wrench className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">No tool calls yet</p>
        <p className="text-xs">Oscar will use tools to generate mockups</p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn("flex-1", className)}>
      <div className="space-y-2 p-2">
        {toolCalls.map((tool) => (
          <div
            key={tool.id}
            className="rounded-lg border bg-card p-3 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    tool.status === "success"
                      ? "default"
                      : tool.status === "error"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {tool.name.replace("_", " ")}
                </Badge>
                {tool.status === "pending" && (
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                )}
                {tool.status === "success" && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
                {tool.status === "error" && (
                  <XCircle className="h-3 w-3 text-destructive" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {tool.timestamp.toLocaleTimeString()}
              </span>
            </div>

            <div className="text-xs text-muted-foreground">
              <pre className="whitespace-pre-wrap font-mono bg-muted/50 rounded p-2 overflow-x-auto">
                {JSON.stringify(tool.params, null, 2)}
              </pre>
            </div>

            {tool.result && (
              <p
                className={cn(
                  "text-xs",
                  tool.status === "error"
                    ? "text-destructive"
                    : "text-muted-foreground"
                )}
              >
                {tool.result}
              </p>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

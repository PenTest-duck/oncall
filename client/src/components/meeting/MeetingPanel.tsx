import { cn } from "@/lib/utils";
import type { TranscriptMessage, ToolCall } from "@/hooks/useOscar";
import { TranscriptView } from "./TranscriptView";
import { ToolsHistory } from "./ToolsHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, PhoneOff } from "lucide-react";

interface MeetingPanelProps {
  status: "disconnected" | "connecting" | "connected";
  isSpeaking: boolean;
  transcript: TranscriptMessage[];
  toolCalls: ToolCall[];
  onStartMeeting: () => void;
  onEndMeeting: () => void;
  className?: string;
}

export function MeetingPanel({
  status,
  isSpeaking,
  transcript,
  toolCalls,
  onStartMeeting,
  onEndMeeting,
  className,
}: MeetingPanelProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Controls */}
      <div className="p-3 border-b border-border">
        {status === "disconnected" && (
          <button
            onClick={onStartMeeting}
            className="w-full h-9 bg-foreground text-background text-sm font-medium rounded flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            Start
          </button>
        )}
        {status === "connecting" && (
          <button
            disabled
            className="w-full h-9 bg-neutral-800 text-muted-foreground text-sm rounded flex items-center justify-center"
          >
            Connecting...
          </button>
        )}
        {status === "connected" && (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 text-sm">
              {isSpeaking && (
                <span className="text-xs text-muted-foreground">
                  Listening...
                </span>
              )}
            </div>
            <button
              onClick={onEndMeeting}
              className="h-9 px-3 bg-red-600 text-white text-sm font-medium rounded flex items-center gap-2 hover:bg-red-700 transition-colors"
            >
              <PhoneOff className="h-3.5 w-3.5" />
              End
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transcript" className="flex-1 flex flex-col min-h-0">
        <TabsList className="h-9 w-full justify-start rounded-none border-b border-border bg-transparent px-3 gap-4">
          <TabsTrigger
            value="transcript"
            className="h-9 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent text-xs data-[state=active]:text-foreground text-muted-foreground"
          >
            Transcript
            {transcript.length > 0 && (
              <span className="ml-1.5 text-muted-foreground">
                {transcript.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="tools"
            className="h-9 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent text-xs data-[state=active]:text-foreground text-muted-foreground"
          >
            Tools
            {toolCalls.length > 0 && (
              <span className="ml-1.5 text-muted-foreground">
                {toolCalls.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transcript" className="flex-1 m-0 overflow-hidden">
          <TranscriptView messages={transcript} />
        </TabsContent>

        <TabsContent value="tools" className="flex-1 m-0 overflow-hidden">
          <ToolsHistory toolCalls={toolCalls} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

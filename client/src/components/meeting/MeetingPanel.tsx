import { cn } from "@/lib/utils";
import type { TranscriptMessage, ToolCall } from "@/hooks/useOscar";
import { TranscriptView } from "./TranscriptView";
import { ToolsHistory } from "./ToolsHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  PhoneOff,
  MessageSquare,
  Wrench,
  Mic,
  MicOff,
} from "lucide-react";

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
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">Meeting</CardTitle>
            <Badge
              variant={
                status === "connected"
                  ? "default"
                  : status === "connecting"
                  ? "secondary"
                  : "outline"
              }
            >
              {status === "connected" && (
                <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              )}
              {status}
            </Badge>
          </div>

          {status === "connected" && (
            <div className="flex items-center gap-2">
              {isSpeaking ? (
                <Mic className="h-4 w-4 text-green-500 animate-pulse" />
              ) : (
                <MicOff className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {status === "disconnected" && (
            <Button onClick={onStartMeeting} className="flex-1" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Start Meeting
            </Button>
          )}
          {status === "connecting" && (
            <Button disabled className="flex-1" size="sm">
              Connecting...
            </Button>
          )}
          {status === "connected" && (
            <Button
              onClick={onEndMeeting}
              variant="destructive"
              className="flex-1"
              size="sm"
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              End Meeting
            </Button>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 p-0 overflow-hidden">
        <Tabs defaultValue="transcript" className="flex flex-col h-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="transcript"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Transcript
              {transcript.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {transcript.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="tools"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Wrench className="h-4 w-4 mr-2" />
              Tools
              {toolCalls.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {toolCalls.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="transcript"
            className="flex-1 m-0 overflow-hidden"
          >
            <TranscriptView messages={transcript} />
          </TabsContent>

          <TabsContent value="tools" className="flex-1 m-0 overflow-hidden">
            <ToolsHistory toolCalls={toolCalls} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

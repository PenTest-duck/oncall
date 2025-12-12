import { useConversation } from "@elevenlabs/react";
import { useCallback, useEffect, useState } from "react";
import { client } from "@/lib/api";

export interface TranscriptMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
}

export interface ToolCall {
  id: string;
  name: string;
  params: Record<string, unknown>;
  result?: string;
  timestamp: Date;
  status: "pending" | "success" | "error";
}

export interface UseOscarReturn {
  // Connection state
  status: "disconnected" | "connecting" | "connected";
  isSpeaking: boolean;

  // Conversation controls
  startMeeting: () => Promise<void>;
  endMeeting: () => Promise<void>;

  // Data
  transcript: TranscriptMessage[];
  toolCalls: ToolCall[];
  currentHtml: string[];
  viewMode: "single" | "quadrant";

  // Actions
  setViewMode: (mode: "single" | "quadrant") => void;
  clearTranscript: () => void;
}

export function useOscar(agentId: string): UseOscarReturn {
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [currentHtml, setCurrentHtml] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"single" | "quadrant">("single");

  // Load base.html on mount
  useEffect(() => {
    fetch("/base.html")
      .then((res) => res.text())
      .then((html) => {
        setCurrentHtml([html]);
      })
      .catch((err) => {
        console.error("Failed to load base.html:", err);
      });
  }, []);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to Oscar");
    },
    onDisconnect: () => {
      console.log("Disconnected from Oscar");
    },
    onMessage: (message) => {
      const newMessage: TranscriptMessage = {
        id: crypto.randomUUID(),
        role: message.source === "user" ? "user" : "agent",
        content: message.message,
        timestamp: new Date(),
      };
      setTranscript((prev) => [...prev, newMessage]);
    },
    onError: (error) => {
      console.error("Oscar error:", error);
    },
    clientTools: {
      // Tool for generating new HTML mockups
      generate_mockup: async ({
        prompt,
        variants,
      }: {
        prompt: string;
        variants?: number;
      }) => {
        const toolId = crypto.randomUUID();
        const variantCount = variants === 4 ? 4 : 1;

        // Add pending tool call
        setToolCalls((prev) => [
          ...prev,
          {
            id: toolId,
            name: "generate_mockup",
            params: { prompt, variants: variantCount },
            timestamp: new Date(),
            status: "pending",
          },
        ]);

        try {
          const res = await client.generate.$post({
            json: {
              prompt,
              variants: variantCount as 1 | 4,
              baseHtml: currentHtml[0],
            },
          });

          const data = await res.json();

          if ("error" in data) {
            throw new Error(data.message);
          }

          setCurrentHtml(data.html);
          setViewMode(variantCount === 4 ? "quadrant" : "single");

          // Update tool call status
          setToolCalls((prev) =>
            prev.map((tc) =>
              tc.id === toolId
                ? {
                    ...tc,
                    status: "success" as const,
                    result: `Generated ${data.html.length} mockup(s)`,
                  }
                : tc
            )
          );

          return `Successfully generated ${data.html.length} HTML mockup(s)`;
        } catch (error) {
          // Update tool call status
          setToolCalls((prev) =>
            prev.map((tc) =>
              tc.id === toolId
                ? {
                    ...tc,
                    status: "error" as const,
                    result:
                      error instanceof Error ? error.message : "Unknown error",
                  }
                : tc
            )
          );

          return `Error generating mockup: ${
            error instanceof Error ? error.message : "Unknown error"
          }`;
        }
      },

      // Tool for editing existing HTML
      edit_mockup: async ({ instruction }: { instruction: string }) => {
        const toolId = crypto.randomUUID();

        if (currentHtml.length === 0) {
          return "No existing mockup to edit. Please generate one first.";
        }

        // Add pending tool call
        setToolCalls((prev) => [
          ...prev,
          {
            id: toolId,
            name: "edit_mockup",
            params: { instruction },
            timestamp: new Date(),
            status: "pending",
          },
        ]);

        try {
          const res = await client.edit.$post({
            json: {
              currentHtml: currentHtml[0],
              instruction,
            },
          });

          const data = await res.json();

          if ("error" in data) {
            throw new Error(data.message);
          }

          setCurrentHtml([data.html]);
          setViewMode("single");

          // Update tool call status
          setToolCalls((prev) =>
            prev.map((tc) =>
              tc.id === toolId
                ? {
                    ...tc,
                    status: "success" as const,
                    result: "Mockup updated successfully",
                  }
                : tc
            )
          );

          return "Successfully updated the HTML mockup";
        } catch (error) {
          // Update tool call status
          setToolCalls((prev) =>
            prev.map((tc) =>
              tc.id === toolId
                ? {
                    ...tc,
                    status: "error" as const,
                    result:
                      error instanceof Error ? error.message : "Unknown error",
                  }
                : tc
            )
          );

          return `Error editing mockup: ${
            error instanceof Error ? error.message : "Unknown error"
          }`;
        }
      },
    },
  });

  const startMeeting = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId,
        connectionType: "webrtc",
        clientTools: {
          vibe_code: async ({ prompt }: { prompt: string }) => {
            const toolId = crypto.randomUUID();

            // Add pending tool call
            setToolCalls((prev) => [
              ...prev,
              {
                id: toolId,
                name: "vibe_code",
                params: { prompt },
                timestamp: new Date(),
                status: "pending",
              },
            ]);

            try {
              const res = await client["vibe-code"].$post({
                json: { prompt },
              });

              const data = await res.json();

              if ("error" in data) {
                throw new Error(data.message);
              }

              // Update canvas with the generated HTML
              setCurrentHtml([data.html]);
              setViewMode("single");

              // Update tool call status
              setToolCalls((prev) =>
                prev.map((tc) =>
                  tc.id === toolId
                    ? {
                        ...tc,
                        status: "success" as const,
                        result: "Generated vibe code successfully",
                      }
                    : tc
                )
              );

              return "Successfully generated the HTML and displayed it in the canvas";
            } catch (error) {
              // Update tool call status
              setToolCalls((prev) =>
                prev.map((tc) =>
                  tc.id === toolId
                    ? {
                        ...tc,
                        status: "error" as const,
                        result:
                          error instanceof Error
                            ? error.message
                            : "Unknown error",
                      }
                    : tc
                )
              );

              return `Error generating vibe code: ${
                error instanceof Error ? error.message : "Unknown error"
              }`;
            }
          },
        },
      });
    } catch (error) {
      console.error("Failed to start meeting:", error);
      throw error;
    }
  }, [agentId, conversation]);

  const endMeeting = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
    setToolCalls([]);
  }, []);

  return {
    status: conversation.status as "disconnected" | "connecting" | "connected",
    isSpeaking: conversation.isSpeaking,
    startMeeting,
    endMeeting,
    transcript,
    toolCalls,
    currentHtml,
    viewMode,
    setViewMode,
    clearTranscript,
  };
}

import { useConversation } from "@elevenlabs/react";
import { useCallback, useEffect, useRef, useState } from "react";
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

  // Ref to access current HTML in callbacks without recreating them
  const currentHtmlRef = useRef<string[]>([]);
  useEffect(() => {
    currentHtmlRef.current = currentHtml;
  }, [currentHtml]);

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
          vibe_code: async ({
            prompt,
            variants_count,
          }: {
            prompt: string;
            variants_count?: number;
          }) => {
            const toolId = crypto.randomUUID();
            // Normalize variants_count to 1 or 4
            const variantCount = variants_count === 4 ? 4 : 1;

            // Add pending tool call
            setToolCalls((prev) => [
              ...prev,
              {
                id: toolId,
                name: "vibe_code",
                params: { prompt, variants_count: variantCount },
                timestamp: new Date(),
                status: "pending",
              },
            ]);

            try {
              const res = await client["vibe-code"].$post({
                json: {
                  prompt,
                  baseHtml: currentHtmlRef.current[0],
                  variants_count: variantCount as 1 | 4,
                },
              });

              const data = await res.json();

              if ("error" in data) {
                throw new Error(data.message);
              }

              // Update canvas with the generated HTML(s)
              setCurrentHtml(data.html);
              // Switch to quadrant view if 4 variants, single view if 1
              setViewMode(variantCount === 4 ? "quadrant" : "single");

              // Update tool call status
              setToolCalls((prev) =>
                prev.map((tc) =>
                  tc.id === toolId
                    ? {
                        ...tc,
                        status: "success" as const,
                        result: `Generated ${data.html.length} variant(s) successfully`,
                      }
                    : tc
                )
              );

              return `Successfully generated ${data.html.length} HTML variant(s) and displayed them in the canvas`;
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

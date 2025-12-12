import { useOscar } from "./hooks/useOscar";
import { MeetingPanel } from "./components/meeting/MeetingPanel";
import { CanvasPanel } from "./components/canvas/CanvasPanel";
import "./App.css";

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID || "";

function App() {
  const {
    status,
    isSpeaking,
    startMeeting,
    endMeeting,
    transcript,
    toolCalls,
    currentHtml,
    viewMode,
    setViewMode,
  } = useOscar(AGENT_ID);

  const handleSelectVariant = (index: number) => {
    // When a variant is selected in quadrant view, switch to single view showing that variant
    if (currentHtml[index]) {
      // Reorder so selected variant is first
      const newHtml = [
        currentHtml[index],
        ...currentHtml.filter((_, i) => i !== index),
      ];
      // Note: In a real app, you'd want to update the state here
      // For now, we just switch to single view
      setViewMode("single");
    }
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                O
              </span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">Oscar</h1>
              <p className="text-xs text-muted-foreground">
                AI Forward-Deployed Engineer
              </p>
            </div>
          </div>

          {!AGENT_ID && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-1.5 rounded-md">
              Missing VITE_ELEVENLABS_AGENT_ID environment variable
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Panel - Meeting (1/3 width) */}
        <div className="w-1/3 min-w-[320px] max-w-[480px]">
          <MeetingPanel
            status={status}
            isSpeaking={isSpeaking}
            transcript={transcript}
            toolCalls={toolCalls}
            onStartMeeting={startMeeting}
            onEndMeeting={endMeeting}
            className="h-full"
          />
        </div>

        {/* Right Panel - Canvas (2/3 width) */}
        <div className="flex-1">
          <CanvasPanel
            htmlArray={currentHtml}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onSelectVariant={handleSelectVariant}
            className="h-full"
          />
        </div>
      </main>
    </div>
  );
}

export default App;

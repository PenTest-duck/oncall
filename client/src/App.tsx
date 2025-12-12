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
    if (currentHtml[index]) {
      setViewMode("single");
    }
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-border h-14 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded bg-foreground flex items-center justify-center">
            <span className="text-background font-semibold text-sm">O</span>
          </div>
          <span className="font-medium">Oscar</span>
          {status === "connected" && (
            <span className="text-xs text-emerald-500">● Connected</span>
          )}
        </div>

        {!AGENT_ID && (
          <span className="text-xs text-red-500">
            Missing VITE_ELEVENLABS_AGENT_ID
          </span>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar - Meeting */}
        <aside className="w-72 border-r border-border shrink-0 flex flex-col">
          <MeetingPanel
            status={status}
            isSpeaking={isSpeaking}
            transcript={transcript}
            toolCalls={toolCalls}
            onStartMeeting={startMeeting}
            onEndMeeting={endMeeting}
            className="flex-1"
          />
        </aside>

        {/* Canvas - Main area */}
        <div className="flex-1 min-w-0 bg-neutral-950">
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

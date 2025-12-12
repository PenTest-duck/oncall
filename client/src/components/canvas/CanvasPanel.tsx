import { cn } from "@/lib/utils";
import { SingleView } from "./SingleView";
import { QuadrantView } from "./QuadrantView";
import { LayoutGrid, Square } from "lucide-react";

interface CanvasPanelProps {
  htmlArray: string[];
  viewMode: "single" | "quadrant";
  onViewModeChange: (mode: "single" | "quadrant") => void;
  onSelectVariant?: (index: number) => void;
  className?: string;
}

export function CanvasPanel({
  htmlArray,
  viewMode,
  onViewModeChange,
  onSelectVariant,
  className,
}: CanvasPanelProps) {
  const hasContent = htmlArray.length > 0 && htmlArray.some((html) => html);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Toolbar */}
      <div className="h-10 px-3 flex items-center justify-between border-b border-border/50 bg-neutral-900/50">
        <span className="text-xs text-muted-foreground">
          {hasContent
            ? `${htmlArray.filter((h) => h).length} variant${
                htmlArray.filter((h) => h).length !== 1 ? "s" : ""
              }`
            : "No preview"}
        </span>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onViewModeChange("single")}
            className={cn(
              "p-1.5 rounded transition-colors",
              viewMode === "single"
                ? "bg-neutral-800 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Square className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange("quadrant")}
            className={cn(
              "p-1.5 rounded transition-colors",
              viewMode === "quadrant"
                ? "bg-neutral-800 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-3 overflow-hidden">
        {!hasContent ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Start a conversation to generate UI
            </p>
          </div>
        ) : viewMode === "single" ? (
          <div className="w-full h-full rounded overflow-hidden bg-white">
            <SingleView html={htmlArray[0] || ""} className="w-full h-full" />
          </div>
        ) : (
          <QuadrantView
            htmlArray={htmlArray}
            onSelect={onSelectVariant}
            className="h-full"
          />
        )}
      </div>
    </div>
  );
}

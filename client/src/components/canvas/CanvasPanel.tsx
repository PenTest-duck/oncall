import { cn } from "@/lib/utils";
import { SingleView } from "./SingleView";
import { QuadrantView } from "./QuadrantView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LayoutGrid, Square, Maximize2 } from "lucide-react";

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
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">Canvas</CardTitle>
            {hasContent && (
              <Badge variant="outline">
                {htmlArray.length} variant{htmlArray.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === "single" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("single")}
              title="Single view"
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "quadrant" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("quadrant")}
              title="Quadrant view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 p-4 overflow-hidden">
        {!hasContent ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Maximize2 className="h-12 w-12 mb-4 opacity-30" />
            <h3 className="text-lg font-medium mb-1">No mockups yet</h3>
            <p className="text-sm max-w-md">
              Start a meeting with Oscar and describe the UI you'd like to see.
              Oscar will generate HTML mockups that appear here.
            </p>
          </div>
        ) : viewMode === "single" ? (
          <SingleView
            html={htmlArray[0] || ""}
            className="w-full h-full rounded-lg border shadow-sm"
          />
        ) : (
          <QuadrantView
            htmlArray={htmlArray}
            onSelect={onSelectVariant}
            className="h-full"
          />
        )}
      </CardContent>
    </Card>
  );
}

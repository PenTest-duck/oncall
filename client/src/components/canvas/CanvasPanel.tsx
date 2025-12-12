import { cn } from "@/lib/utils";
import { SingleView } from "./SingleView";
import { QuadrantView } from "./QuadrantView";
import { ImageView } from "./ImageView";
import { LayoutGrid, Square, Image, Code } from "lucide-react";
import { useState } from "react";

interface CanvasPanelProps {
  htmlArray: string[];
  images: string[];
  viewMode: "single" | "quadrant";
  onViewModeChange: (mode: "single" | "quadrant") => void;
  onSelectVariant?: (index: number) => void;
  className?: string;
}

export function CanvasPanel({
  htmlArray,
  images,
  viewMode,
  onViewModeChange,
  onSelectVariant,
  className,
}: CanvasPanelProps) {
  const [activeTab, setActiveTab] = useState<"html" | "images">("html");
  const hasHtmlContent = htmlArray.length > 0 && htmlArray.some((html) => html);
  const hasImages = images.length > 0;
  const hasContent = hasHtmlContent || hasImages;

  // Auto-switch to images tab when new images arrive
  const [prevImagesLength, setPrevImagesLength] = useState(0);
  if (images.length > prevImagesLength) {
    setPrevImagesLength(images.length);
    if (activeTab !== "images") {
      setActiveTab("images");
    }
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Toolbar */}
      <div className="h-10 px-3 flex items-center justify-between border-b border-border/50 bg-neutral-900/50">
        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          <div className="flex items-center gap-0.5 bg-neutral-800/50 rounded p-0.5">
            <button
              onClick={() => setActiveTab("html")}
              className={cn(
                "px-2 py-1 rounded text-xs flex items-center gap-1.5 transition-colors",
                activeTab === "html"
                  ? "bg-neutral-700 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Code className="h-3 w-3" />
              UI
            </button>
            <button
              onClick={() => setActiveTab("images")}
              className={cn(
                "px-2 py-1 rounded text-xs flex items-center gap-1.5 transition-colors",
                activeTab === "images"
                  ? "bg-neutral-700 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Image className="h-3 w-3" />
              Images
              {hasImages && (
                <span className="bg-neutral-600 text-[10px] px-1 rounded">
                  {images.length}
                </span>
              )}
            </button>
          </div>
          <span className="text-xs text-muted-foreground">
            {activeTab === "html"
              ? hasHtmlContent
                ? `${htmlArray.filter((h) => h).length} variant${
                    htmlArray.filter((h) => h).length !== 1 ? "s" : ""
                  }`
                : "No preview"
              : hasImages
              ? `${images.length} image${images.length !== 1 ? "s" : ""}`
              : "No images"}
          </span>
        </div>

        {activeTab === "html" && (
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
        )}
      </div>

      {/* Canvas */}
      <div className="flex-1 p-3 overflow-hidden">
        {activeTab === "html" ? (
          !hasHtmlContent ? (
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
          )
        ) : !hasImages ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Ask Oscar to generate images
            </p>
          </div>
        ) : images.length === 1 ? (
          <div className="w-full h-full rounded overflow-hidden">
            <ImageView src={images[0]} className="w-full h-full" />
          </div>
        ) : (
          <div className="h-full grid grid-cols-2 gap-3 overflow-auto">
            {images.map((src, index) => (
              <div
                key={index}
                className="relative rounded overflow-hidden bg-neutral-900 aspect-square"
              >
                <span className="absolute top-2 left-2 z-10 text-[10px] font-medium bg-black/70 text-white px-1.5 py-0.5 rounded">
                  {index + 1}
                </span>
                <ImageView src={src} className="w-full h-full" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

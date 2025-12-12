import { cn } from "@/lib/utils";
import { SingleView } from "./SingleView";
import { Badge } from "@/components/ui/badge";

interface QuadrantViewProps {
  htmlArray: string[];
  onSelect?: (index: number) => void;
  className?: string;
}

export function QuadrantView({
  htmlArray,
  onSelect,
  className,
}: QuadrantViewProps) {
  // Ensure we have exactly 4 items, padding with empty if needed
  const items = [...htmlArray];
  while (items.length < 4) {
    items.push("");
  }

  return (
    <div className={cn("grid grid-cols-2 grid-rows-2 gap-3 h-full", className)}>
      {items.slice(0, 4).map((html, index) => (
        <div
          key={index}
          className={cn(
            "relative rounded-lg border bg-card overflow-hidden transition-all",
            html &&
              onSelect &&
              "cursor-pointer hover:ring-2 hover:ring-primary",
            !html && "bg-muted/20"
          )}
          onClick={() => html && onSelect?.(index)}
        >
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 z-10 text-xs"
          >
            Variant {index + 1}
          </Badge>

          {html ? (
            <SingleView html={html} className="w-full h-full" />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No content
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

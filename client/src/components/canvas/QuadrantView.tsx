import { cn } from "@/lib/utils";
import { SingleView } from "./SingleView";

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
            "relative rounded overflow-hidden",
            html && onSelect && "cursor-pointer",
            html
              ? "bg-white hover:ring-2 hover:ring-neutral-400 transition-shadow"
              : "bg-neutral-900 border border-dashed border-neutral-800"
          )}
          onClick={() => html && onSelect?.(index)}
        >
          {/* Label */}
          <span className="absolute top-2 left-2 z-10 text-[10px] font-medium bg-black/70 text-white px-1.5 py-0.5 rounded">
            {index + 1}
          </span>

          {html ? (
            <SingleView html={html} className="w-full h-full" />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
              Empty
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

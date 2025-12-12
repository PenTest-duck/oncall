import { cn } from "@/lib/utils";

interface ImageViewProps {
  src: string;
  className?: string;
}

export function ImageView({ src, className }: ImageViewProps) {
  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center bg-neutral-900 overflow-hidden",
        className
      )}
    >
      <img
        src={src}
        alt="Generated image"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface SingleViewProps {
  html: string;
  className?: string;
}

export function SingleView({ html, className }: SingleViewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      title="Preview"
      className={cn("w-full h-full border-0 bg-white", className)}
      sandbox="allow-scripts allow-same-origin"
    />
  );
}

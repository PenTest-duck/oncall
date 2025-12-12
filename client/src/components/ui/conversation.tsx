import type { ComponentProps } from "react";
import { useCallback } from "react";
import { ArrowDownIcon } from "lucide-react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";

import { cn } from "@/lib/utils";

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn("relative flex-1 overflow-y-auto", className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
);

export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
>;

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => (
  <StickToBottom.Content className={cn("p-4", className)} {...props} />
);

export type ConversationEmptyStateProps = Omit<
  ComponentProps<"div">,
  "title"
> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
};

export const ConversationEmptyState = ({
  className,
  title = "No messages yet",
  description,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center py-8 text-center",
      className
    )}
    {...props}
  >
    <p className="text-sm text-muted-foreground">{title}</p>
    {description && (
      <p className="text-xs text-muted-foreground/60 mt-1">{description}</p>
    )}
  </div>
);

export type ConversationScrollButtonProps = ComponentProps<"button">;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    !isAtBottom && (
      <button
        className={cn(
          "absolute bottom-3 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center hover:bg-neutral-700 transition-colors",
          className
        )}
        onClick={handleScrollToBottom}
        type="button"
        {...props}
      >
        <ArrowDownIcon className="h-3.5 w-3.5" />
      </button>
    )
  );
};

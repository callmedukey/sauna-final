import { cn } from "@/lib/utils";

interface TextHighlightProps {
  children: React.ReactNode;
  className?: string;
}

export const TextHighlight = ({ children, className }: TextHighlightProps) => {
  return (
    <span
      className={cn(
        "relative inline",
        "before:absolute before:inset-0 before:top-[0.4em] before:bottom-[0.1em] before:-z-10",
        "before:block before:bg-[#E8DD7E]",
        className
      )}
    >
      {children}
    </span>
  );
};

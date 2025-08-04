import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function FloatingActionButton({ 
  onClick, 
  className,
  children = <Plus className="h-6 w-6" />
}: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "h-14 w-14 rounded-full",
        "bg-gradient-primary text-primary-foreground",
        "shadow-floating hover:shadow-soft",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:scale-110 active:scale-95",
        "focus:outline-none focus:ring-4 focus:ring-primary/30",
        className
      )}
    >
      {children}
    </button>
  );
}
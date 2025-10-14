import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ className = "", size = "md", showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "bg-gradient-to-br from-sky-300 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold shadow-lg",
        sizeClasses[size]
      )}>
        <span 
          className="text-white font-bold" 
          style={{ 
            textShadow: "0 0 8px rgba(255, 165, 0, 0.6), 0 0 12px rgba(255, 165, 0, 0.4)",
            filter: "drop-shadow(0 0 3px rgba(255, 165, 0, 0.7))"
          }}
        >
          Y
        </span>
      </div>
      {showText && (
        <span 
          className={cn(
            "font-bold text-foreground",
            textSizeClasses[size]
          )}
          style={{
            textShadow: "0 0 4px rgba(255, 165, 0, 0.3)",
            filter: "drop-shadow(0 0 2px rgba(255, 165, 0, 0.5))"
          }}
        >
          YULII
        </span>
      )}
    </div>
  );
};

export default Logo;

import React from 'react';
import { cn } from "@/lib/utils";

interface SVGLogoProps {
  src: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  text?: string;
  alt?: string;
}

const SVGLogo = ({ 
  src, 
  className = "", 
  size = "md", 
  showText = true, 
  text = "YULII",
  alt = "Logo"
}: SVGLogoProps) => {
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

  // Check if the src is an SVG file
  const isSVG = src.toLowerCase().includes('.svg') || src.startsWith('data:image/svg+xml');

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "rounded-lg flex items-center justify-center overflow-hidden bg-muted",
        sizeClasses[size]
      )}>
        {isSVG ? (
          // For SVG files, we can use an img tag or embed directly
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : (
          // For other image formats
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        )}
        <div className="hidden w-full h-full flex items-center justify-center text-muted-foreground">
          <svg className="h-1/2 w-1/2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
      </div>
      {showText && (
        <span className={cn(
          "font-bold text-foreground",
          textSizeClasses[size]
        )}>
          {text}
        </span>
      )}
    </div>
  );
};

export default SVGLogo;



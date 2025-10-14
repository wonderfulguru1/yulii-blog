import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStorage } from '@/hooks/useStorage';
import { useToast } from '@/hooks/use-toast';
import { useLogo } from '@/contexts/LogoContext';

interface ImageLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  text?: string;
  onLogoChange?: (logoUrl: string) => void;
  editable?: boolean;
}

const ImageLogo = ({ 
  className = "", 
  size = "md", 
  showText = true, 
  text,
  onLogoChange,
  editable = false 
}: ImageLogoProps) => {
  const { logoUrl, setLogoUrl, text: contextText } = useLogo();
  const [urlInput, setUrlInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { uploadFile, loading, progress, error } = useStorage();
  const { toast } = useToast();
  
  const displayText = text || contextText;

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-20 w-20", 
    lg: "h-32 w-32"
  };

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl"
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB for logos)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const path = `logos/${Date.now()}_${file.name}`;
      const result = await uploadFile(file, path);
      
      if (result && typeof result === 'object' && 'success' in result && result.success) {
        setLogoUrl((result as any).url);
        onLogoChange?.((result as any).url);
        setIsEditing(false);
        toast({
          title: "Logo uploaded",
          description: "Logo uploaded successfully",
        });
      } else {
        toast({
          title: "Upload failed",
          description: (result as any)?.error || "Failed to upload logo",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the logo",
        variant: "destructive",
      });
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setLogoUrl(urlInput.trim());
      onLogoChange?.(urlInput.trim());
      setUrlInput('');
      setIsEditing(false);
      toast({
        title: "Logo URL set",
        description: "Logo URL has been set successfully",
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const clearLogo = () => {
    setLogoUrl('');
    onLogoChange?.('');
  };

  // Check if the logo is an SVG
  const isSVG = logoUrl && (logoUrl.toLowerCase().includes('.svg') || logoUrl.startsWith('data:image/svg+xml'));

  // If not editing, show the logo display
  if (!isEditing || !editable) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {logoUrl ? (
          isSVG ? (
            // Render SVG directly without container
            <img
              src={logoUrl}
              alt={`${displayText} Logo`}
              className={cn("object-contain", sizeClasses[size])}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            // For non-SVG images, use container
            <div className={cn(
              "rounded-lg flex items-center justify-center overflow-hidden bg-muted",
              sizeClasses[size]
            )}>
              <img
                src={logoUrl}
                alt={`${displayText} Logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-full h-full flex items-center justify-center text-muted-foreground">
                <ImageIcon className="h-1/2 w-1/2" />
              </div>
            </div>
          )
        ) : (
          // Fallback when no logo
          <div className={cn(
            "rounded-lg flex items-center justify-center overflow-hidden bg-muted",
            sizeClasses[size]
          )}>
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ImageIcon className="h-1/2 w-1/2" />
            </div>
          </div>
        )}
        
        {/* Error fallback for SVG */}
        {logoUrl && isSVG && (
          <div className="hidden w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageIcon className="h-1/2 w-1/2" />
          </div>
        )}
        
        {showText && (
          <span className={cn(
            "font-bold text-foreground",
            textSizeClasses[size]
          )}>
            {displayText}
          </span>
        )}
        {editable && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="ml-2"
          >
            Edit Logo
          </Button>
        )}
      </div>
    );
  }

  // Editing mode
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Logo Image</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </div>
        
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Image URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-2">
                <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="text-sm">
                  <span className="font-medium text-primary">Click to upload</span> or drag and drop
                </div>
                <div className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 5MB
                </div>
              </div>

              {loading && (
                <div className="mt-4 space-y-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Uploading... {Math.round(progress)}%
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 text-sm text-destructive">
                  {error}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
              >
                Set URL
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Current Logo Preview */}
        {logoUrl && (
          <div className="space-y-2">
            <Label>Current Logo</Label>
            <div className="flex items-center gap-4">
              {isSVG ? (
                // Render SVG directly without container
                <img
                  src={logoUrl}
                  alt="Current Logo"
                  className={cn("object-contain", sizeClasses[size])}
                />
              ) : (
                // For non-SVG images, use container
                <div className={cn(
                  "rounded-lg flex items-center justify-center overflow-hidden bg-muted border",
                  sizeClasses[size]
                )}>
                  <img
                    src={logoUrl}
                    alt="Current Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearLogo}
              >
                Remove Logo
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImageLogo;

import { useState, useRef } from 'react';
import { Upload, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStorage } from '@/hooks/useStorage';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

const ImageUpload = ({ value, onChange, className = '' }: ImageUploadProps) => {
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, loading, progress, error } = useStorage();
  const { toast } = useToast();

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

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const path = `blog-images/${Date.now()}_${file.name}`;
      const result = await uploadFile(file, path);
      
      if (result.success) {
        onChange(result.url);
        toast({
          title: "Image uploaded",
          description: "Image uploaded successfully",
        });
      } else {
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload image",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the image",
        variant: "destructive",
      });
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      toast({
        title: "Image URL set",
        description: "Image URL has been set successfully",
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

  const clearImage = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>Featured Image</Label>
      
      <Tabs value={uploadMode} onValueChange={(value) => setUploadMode(value as 'upload' | 'url')}>
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
                PNG, JPG, GIF up to 10MB
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
              placeholder="https://example.com/image.jpg"
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

      {/* Image Preview */}
      {value && (
        <Card className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium mb-2">Current Image</div>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-sm">Failed to load image</div>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground break-all">
                {value}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearImage}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;

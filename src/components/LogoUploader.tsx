import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogo } from '@/contexts/LogoContext';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, Check } from 'lucide-react';

const LogoUploader = () => {
  const { logoUrl, setLogoUrl, text, setText } = useLogo();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const isValidImage = selectedFile.type.startsWith('image/') || 
                          selectedFile.name.toLowerCase().endsWith('.svg') ||
                          selectedFile.type === 'image/svg+xml';
      
      if (!isValidImage) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (PNG, JPG, GIF, SVG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      
      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('logo', file);

      // For now, we'll use a simple approach - create a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setLogoUrl(dataUrl);
        setPreviewUrl('');
        setFile(null);
        setIsUploading(false);
        
        toast({
          title: "Logo updated",
          description: "Your logo has been successfully updated!",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    setFile(null);
    setPreviewUrl('');
    toast({
      title: "Logo removed",
      description: "Logo has been removed successfully.",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Upload Your Logo
        </CardTitle>
        <CardDescription>
          Select an image file from your computer to use as your logo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Input */}
        <div className="space-y-2">
          <Label htmlFor="logo-file">Choose Logo Image</Label>
          <Input
            id="logo-file"
            type="file"
            accept="image/*,.svg"
            onChange={handleFileSelect}
            className="cursor-pointer"
          />
          <p className="text-sm text-muted-foreground">
            Supported formats: PNG, JPG, GIF, SVG. Maximum size: 5MB
          </p>
        </div>

        {/* Preview */}
        {(previewUrl || logoUrl) && (
          <div className="space-y-4">
            <Label>Preview</Label>
            <div className="flex items-center justify-center p-8 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25">
              <div className="text-center">
                <img
                  src={previewUrl || logoUrl}
                  alt="Logo preview"
                  className="max-h-64 max-w-64 object-contain mx-auto mb-4"
                />
                <p className="text-sm text-muted-foreground">
                  {previewUrl ? 'New logo preview' : 'Current logo'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {file && (
            <Button onClick={handleUpload} disabled={isUploading} className="flex-1">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </>
              )}
            </Button>
          )}
          
          {logoUrl && (
            <Button 
              variant="outline" 
              onClick={handleRemoveLogo}
              disabled={isUploading}
            >
              Remove Logo
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Quick Setup Instructions:
          </h4>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>1. Click "Choose Logo Image" and select your logo file</li>
            <li>2. Preview your logo in the preview area</li>
            <li>3. Click "Upload Logo" to set it as your brand logo</li>
            <li>4. Your logo will appear throughout the entire app</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoUploader;

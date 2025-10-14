import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Link as LinkIcon } from 'lucide-react';
import ImageUpload from './ImageUpload';

const ImageUploadDemo = () => {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Image Upload Demo
          </CardTitle>
          <CardDescription>
            Try uploading an image file or providing an image URL. This demonstrates the same functionality available in the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
          />
          
          {imageUrl && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Current Image URL:</h4>
              <code className="text-sm break-all text-muted-foreground">
                {imageUrl}
              </code>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          This component is now integrated into the admin panel for creating and editing blog posts.
        </p>
        <Button asChild>
          <a href="/admin">
            Go to Admin Panel
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ImageUploadDemo;

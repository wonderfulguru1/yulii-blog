import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useLogo } from '../contexts/LogoContext';
import ImageLogo from '../components/ImageLogo';
import { ArrowLeft, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const LogoManager = () => {
  const { logoUrl, setLogoUrl, text, setText } = useLogo();
  const [tempText, setTempText] = useState(text);

  const handleTextChange = () => {
    if (tempText.trim()) {
      setText(tempText.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Logo Management</h1>
            <p className="text-muted-foreground">Customize your brand logo and text</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Current Logo Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Current Logo
              </CardTitle>
              <CardDescription>
                This is how your logo appears throughout the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
                <ImageLogo size="lg" />
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload New Logo</CardTitle>
              <CardDescription>
                Upload an image file or provide a URL for your logo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageLogo 
                editable={true}
                onLogoChange={setLogoUrl}
              />
            </CardContent>
          </Card>

          {/* Text Customization */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Text</CardTitle>
              <CardDescription>
                Customize the text that appears next to your logo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand-text">Brand Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="brand-text"
                    value={tempText}
                    onChange={(e) => setTempText(e.target.value)}
                    placeholder="Enter your brand name"
                    className="flex-1"
                  />
                  <Button onClick={handleTextChange}>
                    Update
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <ImageLogo size="md" text={tempText} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Logo Guidelines</CardTitle>
              <CardDescription>
                Best practices for your logo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Recommended Specifications:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Square aspect ratio (1:1)</li>
                    <li>• Minimum 200x200 pixels</li>
                    <li>• PNG format with transparent background</li>
                    <li>• File size under 5MB</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Design Tips:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Use high contrast colors</li>
                    <li>• Ensure readability at small sizes</li>
                    <li>• Keep design simple and clean</li>
                    <li>• Test on different backgrounds</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LogoManager;

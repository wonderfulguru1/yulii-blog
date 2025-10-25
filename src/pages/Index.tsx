import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Edit3, LogIn, Tag } from "lucide-react";
import { useAuthContext } from "../contexts/AuthContext";
import { useLogo } from "../contexts/LogoContext";
import { useCollection } from "../hooks/useFirestore";
import ImageUploadDemo from "../components/ImageUploadDemo";
import ImageLogo from "../components/ImageLogo";
import LogoUploader from "../components/LogoUploader";

const Index = () => {
  const { user } = useAuthContext();
  const { logoUrl, text } = useLogo();
  
  // Fetch categories from database
  const { data: categories, loading: categoriesLoading } = useCollection('categories', []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="mb-8">
            <ImageLogo 
              size="lg" 
              text={text}
              editable={true}
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            {text} Blog
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl">
            Stories, insights, and updates from the world of fintech innovation
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link to="/blog">
              <Button size="lg" className="gap-2 text-lg px-8 py-6">
                <BookOpen className="h-5 w-5" />
                Read Blog
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            
            {user ? (
              <Link to="/admin">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6">
                  <Edit3 className="h-5 w-5" />
                  Admin Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6">
                  <LogIn className="h-5 w-5" />
                  Login to Admin
                </Button>
              </Link>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Rich Content</h3>
              <p className="text-muted-foreground">
                Engaging articles with beautiful layouts and imagery
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <Edit3 className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Management</h3>
              <p className="text-muted-foreground">
                Simple admin interface to create and edit posts
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Tag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Categories</h3>
              <p className="text-muted-foreground mb-4">
                Organized content across multiple topics
              </p>
              {categoriesLoading ? (
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 bg-muted animate-pulse rounded w-16"></div>
                  <div className="h-6 bg-muted animate-pulse rounded w-20"></div>
                  <div className="h-6 bg-muted animate-pulse rounded w-14"></div>
                </div>
              ) : categories && categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 3).map((category: any) => (
                    <span
                      key={category.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {category.name}
                    </span>
                  ))}
                  {categories.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      +{categories.length - 3} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No categories available yet</p>
              )}
            </div>
          </div>

          {/* Logo Upload Section */}
          <div className="mt-20 max-w-4xl w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Upload Your Logo</h2>
              <p className="text-lg text-muted-foreground">
                Use your own image as the logo for your blog
              </p>
            </div>
            <LogoUploader />
          </div>

          {/* Image Upload Demo Section */}
          <div className="mt-20 max-w-4xl w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Image Upload Feature</h2>
              <p className="text-lg text-muted-foreground">
                Upload images directly or use URLs - try it out below!
              </p>
            </div>
            <ImageUploadDemo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

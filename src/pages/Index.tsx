import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Edit3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="mb-8 w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground">
            <span className="text-4xl font-bold">M</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Moniepoint Blog
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
            
            <Link to="/admin">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6">
                <Edit3 className="h-5 w-5" />
                Admin Dashboard
              </Button>
            </Link>
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
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Categories</h3>
              <p className="text-muted-foreground">
                Organized content across multiple topics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCollection } from "../hooks/useFirestore";
import { orderBy, where, query } from "firebase/firestore";
import { useLogo } from "../contexts/LogoContext";
import ImageLogo from "../components/ImageLogo";

// Interface for blog post
interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  image: string;
  status: string;
  createdAt: any;
  updatedAt: any;
}

const categories = ["All", "Business Tips", "News", "Product Updates", "Business Life", "Tech & Processes", "Impact Stories"];

const Blog = () => {
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { text } = useLogo();

  // Get all published blog posts from Firestore
  const { data: allPosts, loading, error } = useCollection('posts', [
    where('status', '==', 'Published'),
    orderBy('createdAt', 'desc')
  ]);

  // Filter posts for featured (first 2 published posts)
  const featuredPosts = allPosts?.slice(0, 2) || [];
  
  // All blog posts (published only)
  const blogPosts = allPosts || [];

  const nextFeatured = () => {
    setCurrentFeatured((prev) => (prev + 1) % featuredPosts.length);
  };

  const prevFeatured = () => {
    setCurrentFeatured((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  };

  const filteredPosts = blogPosts.filter((post: BlogPost) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Format date for display
  const formatDate = (date: any) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading blog posts: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ImageLogo size="sm" showText={false} />
            <span className="font-bold text-xl">{text} <span className="text-primary">BLOG</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
          
            <Button variant="default" size="sm" className="rounded-full">
              Subscribe
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">
            {text} Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Get behind the scenes on our process, exciting news, and the people making dreams come true for millions of businesses.
          </p>
        </div>
      </section>

      {/* Featured Story */}
      {featuredPosts.length > 0 && (
        <section className="px-4 pb-16">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-6 bg-primary rounded-3xl overflow-hidden shadow-lg">
              <div className="p-8 md:p-12 flex flex-col justify-center text-primary-foreground">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium">{featuredPosts[currentFeatured]?.category}</span>
                  <Badge variant="secondary" className="bg-primary-foreground text-primary">
                    Top Stories
                  </Badge>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {featuredPosts[currentFeatured]?.title}
                </h2>
                <div className="text-sm mb-6 opacity-90">
                  {formatDate(featuredPosts[currentFeatured]?.createdAt)} • by {featuredPosts[currentFeatured]?.author}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {featuredPosts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentFeatured(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentFeatured ? "bg-primary-foreground w-6" : "bg-primary-foreground/40"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-primary-foreground hover:bg-primary-foreground/90 text-primary"
                      onClick={prevFeatured}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-primary-foreground hover:bg-primary-foreground/90 text-primary"
                      onClick={nextFeatured}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] md:h-auto bg-accent">
                <img
                  src={featuredPosts[currentFeatured]?.image}
                  alt={featuredPosts[currentFeatured]?.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Stories */}
      <section className="px-4 pb-16">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">All Stories</h2>
              <p className="text-muted-foreground">Everything you need to know, about absolutely everything</p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full md:w-64"
                />
              </div>
              <Button>Search</Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Blog Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post: BlogPost) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image || 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {post.category}
                    </Badge>
                    <p className="text-xs text-muted-foreground mb-2">{formatDate(post.createdAt)}</p>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                    <p className="text-xs text-muted-foreground">by {post.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">No blog posts found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || selectedCategory !== "All" 
                  ? "Try adjusting your search or filter criteria" 
                  : "Check back later for new content"
                }
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;

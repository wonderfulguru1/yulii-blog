import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCollection } from "../hooks/useFirestore";
import { orderBy, where } from "firebase/firestore";
import { useLogo } from "../contexts/LogoContext";
import ImageLogo from "../components/ImageLogo";
import BlogContentShimmer from "../components/BlogContentShimmer";

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
  scheduledAt?: any;
}

const Blog = () => {
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { text } = useLogo();

  // Get all published and scheduled blog posts from Firestore
  const { data: allPosts, loading, error } = useCollection('posts', [
    where('status', 'in', ['Published', 'Scheduled']),
    orderBy('createdAt', 'desc')
  ]);

  // Get categories from database
  const { data: categories, loading: categoriesLoading } = useCollection('categories', []);
  
  // Create categories array with "All" at the beginning
  const allCategories = ["All", ...(categories?.map((cat: any) => cat.name) || [])];

  // Function to check if a scheduled post should be published
  const isScheduledPostReady = (post: BlogPost) => {
    if (post.status !== 'Scheduled' || !post.scheduledAt) return false;
    const now = new Date();
    const scheduledTime = post.scheduledAt.toDate ? post.scheduledAt.toDate() : new Date(post.scheduledAt);
    return scheduledTime <= now;
  };

  // Filter posts to only show published posts and scheduled posts that are ready
  const visiblePosts = allPosts?.filter((post: BlogPost) => 
    post.status === 'Published' || isScheduledPostReady(post)
  ) || [];

  // Filter posts for featured (first 2 visible posts)
  const featuredPosts = visiblePosts.slice(0, 2);
  
  // All blog posts (published and ready scheduled posts)
  const blogPosts = visiblePosts;

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
      {/* Navigation - Always visible */}
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

      {/* Hero Section - Always visible */}
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

      {/* Dynamic Content - Show shimmer while loading */}
      {loading ? (
        <BlogContentShimmer />
      ) : (
        <>
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
                    <p className="text-lg mb-8 opacity-90 leading-relaxed">
                      {featuredPosts[currentFeatured]?.excerpt}
                    </p>
                    <Link to={`/blog/${featuredPosts[currentFeatured]?.id}`}>
                      <Button variant="secondary" size="lg" className="w-fit">
                        Read More
                      </Button>
                    </Link>
                  </div>
                  <div className="relative">
                    <img
                      src={featuredPosts[currentFeatured]?.image}
                      alt={featuredPosts[currentFeatured]?.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                    {featuredPosts.length > 1 && (
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={prevFeatured}
                          className="bg-black/20 hover:bg-black/40 text-white border-white/20"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={nextFeatured}
                          className="bg-black/20 hover:bg-black/40 text-white border-white/20"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Search and Filter */}
          <section className="px-4 pb-8">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {categoriesLoading ? (
                    // Loading skeleton for categories
                    Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-8 bg-muted animate-pulse rounded w-20"
                      />
                    ))
                  ) : (
                    allCategories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="whitespace-nowrap"
                      >
                        {category}
                      </Button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Blog Posts */}
          <section className="px-4 pb-16">
            <div className="container mx-auto max-w-6xl">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post: BlogPost) => (
                  <Link key={post.id} to={`/blog/${post.id}`} className="group">
                    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow duration-300">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-muted-foreground">{post.category}</span>
                          <Badge variant="secondary" className="text-xs">
                            {post.status}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{formatDate(post.createdAt)}</span>
                          <span>by {post.author}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Blog;
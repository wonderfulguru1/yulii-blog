import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const featuredPosts = [
  {
    id: 1,
    title: "How to Spot Bank Fraud and Protect Your Money",
    category: "Product Updates",
    date: "September 17, 2025",
    author: "John Doe",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Needs vs Wants: The Smart Way to Manage Money",
    category: "Business Life",
    date: "September 26, 2025",
    author: "Jane Smith",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop",
  },
];

const blogPosts = [
  {
    id: 1,
    title: "Needs vs Wants: The Smart Way to Manage Money and Save",
    category: "Business Life",
    date: "September 26, 2025",
    author: "Jane Smith",
    excerpt: "Learn the difference between needs and wants to make smarter financial decisions.",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Top Fintech Companies Leading Innovation",
    category: "News",
    date: "September 24, 2025",
    author: "Mike Johnson",
    excerpt: "Discover the companies revolutionizing financial technology this year.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "How to Save Smarter and Earn Up to 18% Interest",
    category: "Business Tips",
    date: "September 22, 2025",
    author: "Sarah Williams",
    excerpt: "Maximize your savings with these proven strategies and high-yield accounts.",
    image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Digital Payment Trends Reshaping Commerce",
    category: "Tech & Processes",
    date: "September 20, 2025",
    author: "David Brown",
    excerpt: "Explore how digital payments are transforming the way we do business.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Essential Tips for Small Business Financial Success",
    category: "Business Tips",
    date: "September 18, 2025",
    author: "Emily Davis",
    excerpt: "Build a solid financial foundation for your small business with expert advice.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    title: "The Future of Banking: What to Expect",
    category: "Impact Stories",
    date: "September 15, 2025",
    author: "Chris Wilson",
    excerpt: "A look at emerging technologies shaping the future of financial services.",
    image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400&h=300&fit=crop",
  },
];

const categories = ["All", "Business Tips", "News", "Product Updates", "Business Life", "Tech & Processes", "Impact Stories"];

const Blog = () => {
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const nextFeatured = () => {
    setCurrentFeatured((prev) => (prev + 1) % featuredPosts.length);
  };

  const prevFeatured = () => {
    setCurrentFeatured((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              M
            </div>
            <span className="font-bold text-xl">Moniepoint <span className="text-primary">BLOG</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
            <Link to="/blog" className="text-sm font-medium text-primary">Business Tips</Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">Education Series</Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">Impact Stories</Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">News</Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">People</Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">Product Updates</Link>
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
            Moniepoint Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Get behind the scenes on our process, exciting news, and the people making dreams come true for millions of businesses.
          </p>
        </div>
      </section>

      {/* Featured Story */}
      <section className="px-4 pb-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6 bg-primary rounded-3xl overflow-hidden shadow-lg">
            <div className="p-8 md:p-12 flex flex-col justify-center text-primary-foreground">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium">Product Updates</span>
                <Badge variant="secondary" className="bg-primary-foreground text-primary">
                  Top Stories
                </Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {featuredPosts[currentFeatured].title}
              </h2>
              <div className="text-sm mb-6 opacity-90">
                {featuredPosts[currentFeatured].date} • by {featuredPosts[currentFeatured].author}
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
                src={featuredPosts[currentFeatured].image}
                alt={featuredPosts[currentFeatured].title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <Badge variant="secondary" className="mb-3">
                    {post.category}
                  </Badge>
                  <p className="text-xs text-muted-foreground mb-2">{post.date}</p>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                  <p className="text-xs text-muted-foreground">by {post.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;

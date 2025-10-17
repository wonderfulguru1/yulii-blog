import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLogo } from "../contexts/LogoContext";
import ImageLogo from "../components/ImageLogo";
import { useFirestore } from "../hooks/useFirestore";

const BlogPost = () => {
  const { id } = useParams();
  const { text } = useLogo();
  const { getDocument, loading, error } = useFirestore();
  const [post, setPost] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPost = async () => {
      if (!id) return;
      const result = await getDocument('posts', id);
      if (!isMounted) return;
      if (result.success) {
        setPost(result.data);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    };
    fetchPost();
    return () => { isMounted = false; };
  }, [id]);

  const formatDate = (date: any) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ImageLogo size="sm" showText={false} />
            <span className="font-bold text-xl">{text} <span className="text-primary">BLOG</span></span>
          </Link>
          <Link to="/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </nav>

      {/* Loading state */}
      {loading && (
        <div className="py-24 text-center text-muted-foreground">Loading post...</div>
      )}

      {/* Not found */}
      {!loading && notFound && (
        <div className="py-24 text-center">
          <div className="text-2xl font-bold mb-2">Post not found</div>
          <p className="text-muted-foreground mb-6">The article you are looking for may have been moved or deleted.</p>
          <Link to="/blog">
            <Button>Go back to blog</Button>
          </Link>
        </div>
      )}

      {/* Article Header */}
      {!loading && post && (
      <article className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all stories
          </Link>

          {post.category && (<Badge className="mb-4">{post.category}</Badge>)}
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate((post as any).createdAt) || (post as any).date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>by {(post as any).author}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-video rounded-2xl overflow-hidden mb-12 shadow-lg">
            <img
              src={(post as any).image}
              alt={(post as any).title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:mb-6 prose-ul:mb-6 prose-li:mb-2"
            dangerouslySetInnerHTML={{ __html: (post as any).content || '' }}
          />

          {/* Share Section */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Share this article</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Twitter</Button>
                  <Button variant="outline" size="sm">Facebook</Button>
                  <Button variant="outline" size="sm">LinkedIn</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
      )}
    </div>
  );
};

export default BlogPost;

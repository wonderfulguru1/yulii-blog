import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BlogPost = () => {
  const { id } = useParams();

  // Mock data - in real app, fetch based on ID
  const post = {
    id: 1,
    title: "Needs vs Wants: The Smart Way to Manage Money and Save",
    category: "Business Life",
    date: "September 26, 2025",
    author: "Jane Smith",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=600&fit=crop",
    content: `
      <h2>Understanding the Difference Between Needs and Wants</h2>
      <p>One of the fundamental principles of financial management is understanding the distinction between needs and wants. This simple concept can transform your spending habits and help you build substantial savings over time.</p>
      
      <h3>What Are Needs?</h3>
      <p>Needs are the essentials - things you absolutely must have to survive and maintain a basic standard of living. These include:</p>
      <ul>
        <li>Housing and utilities</li>
        <li>Food and water</li>
        <li>Healthcare</li>
        <li>Basic clothing</li>
        <li>Transportation to work</li>
      </ul>
      
      <h3>What Are Wants?</h3>
      <p>Wants are desires that enhance your lifestyle but aren't essential for survival. These might include:</p>
      <ul>
        <li>Dining out at restaurants</li>
        <li>Entertainment subscriptions</li>
        <li>Latest gadgets</li>
        <li>Designer clothing</li>
        <li>Vacation trips</li>
      </ul>
      
      <h2>The 50/30/20 Budget Rule</h2>
      <p>A popular framework for managing needs versus wants is the 50/30/20 budget rule:</p>
      <ul>
        <li><strong>50% for Needs:</strong> Allocate half your income to essential expenses</li>
        <li><strong>30% for Wants:</strong> Use this portion for lifestyle choices and entertainment</li>
        <li><strong>20% for Savings:</strong> Put this aside for emergency funds and long-term goals</li>
      </ul>
      
      <h2>Practical Tips for Smart Money Management</h2>
      <p>Here are actionable steps to help you distinguish needs from wants and make better financial decisions:</p>
      
      <h3>1. Track Your Spending</h3>
      <p>Keep a detailed record of all your expenses for at least a month. This will reveal patterns and help you identify areas where wants are disguised as needs.</p>
      
      <h3>2. Wait Before Buying</h3>
      <p>Implement a 24-hour rule for non-essential purchases. If you still want the item after a day, it might be worth considering.</p>
      
      <h3>3. Set Clear Financial Goals</h3>
      <p>Having specific savings targets makes it easier to say no to unnecessary purchases. Whether it's building an emergency fund or saving for a down payment, clear goals provide motivation.</p>
      
      <h3>4. Automate Your Savings</h3>
      <p>Set up automatic transfers to your savings account right after payday. This ensures you save before you have a chance to spend.</p>
      
      <h2>The Power of Small Changes</h2>
      <p>Remember, you don't need to eliminate all wants from your budget. The key is finding a balance that allows you to enjoy life while building financial security. Small adjustments can lead to significant savings over time.</p>
      
      <p>For example, brewing coffee at home instead of buying it daily could save you hundreds of dollars per month. Cooking at home more often, canceling unused subscriptions, and shopping with a list can all add up to substantial savings.</p>
      
      <h2>Conclusion</h2>
      <p>Mastering the distinction between needs and wants is a crucial skill for financial success. By being mindful of your spending, setting clear priorities, and making small but consistent changes, you can build a secure financial future while still enjoying the things that matter most to you.</p>
    `,
  };

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
          <Link to="/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </nav>

      {/* Article Header */}
      <article className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all stories
          </Link>

          <Badge className="mb-4">{post.category}</Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>by {post.author}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-video rounded-2xl overflow-hidden mb-12 shadow-lg">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:mb-6 prose-ul:mb-6 prose-li:mb-2"
            dangerouslySetInnerHTML={{ __html: post.content }}
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
    </div>
  );
};

export default BlogPost;

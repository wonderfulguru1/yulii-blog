import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const categories = ["Business Tips", "News", "Product Updates", "Business Life", "Tech & Processes", "Impact Stories"];

const mockPosts = [
  {
    id: 1,
    title: "Needs vs Wants: The Smart Way to Manage Money",
    category: "Business Life",
    status: "Published",
    date: "2025-09-26",
    author: "Jane Smith",
  },
  {
    id: 2,
    title: "Top Fintech Companies Leading Innovation",
    category: "News",
    status: "Published",
    date: "2025-09-24",
    author: "Mike Johnson",
  },
  {
    id: 3,
    title: "How to Save Smarter and Earn Interest",
    category: "Business Tips",
    status: "Draft",
    date: "2025-09-22",
    author: "Sarah Williams",
  },
];

const Admin = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    excerpt: "",
    image: "",
    status: "Draft",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? { ...p, ...formData } : p));
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    } else {
      const newPost = {
        id: posts.length + 1,
        ...formData,
        date: new Date().toISOString().split('T')[0],
        author: "Admin",
      };
      setPosts([...posts, newPost]);
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    }
    
    setIsDialogOpen(false);
    setEditingPost(null);
    setFormData({
      title: "",
      category: "",
      content: "",
      excerpt: "",
      image: "",
      status: "Draft",
    });
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      category: post.category,
      content: "",
      excerpt: "",
      image: "",
      status: post.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setPosts(posts.filter(p => p.id !== id));
    toast({
      title: "Deleted",
      description: "Blog post deleted successfully",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              M
            </div>
            <span className="font-bold text-xl">Moniepoint <span className="text-primary">Admin</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/blog">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Blog
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Blog Management</h1>
            <p className="text-muted-foreground">Create and manage your blog posts</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter post title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief description of the post"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Featured Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your blog post content here..."
                    rows={10}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    {editingPost ? "Update Post" : "Create Post"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingPost(null);
                      setFormData({
                        title: "",
                        category: "",
                        content: "",
                        excerpt: "",
                        image: "",
                        status: "Draft",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Posts</div>
            <div className="text-3xl font-bold">{posts.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Published</div>
            <div className="text-3xl font-bold text-primary">
              {posts.filter(p => p.status === "Published").length}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Drafts</div>
            <div className="text-3xl font-bold text-accent">
              {posts.filter(p => p.status === "Draft").length}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Categories</div>
            <div className="text-3xl font-bold">{categories.length}</div>
          </Card>
        </div>

        {/* Posts Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-md truncate">
                    {post.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{post.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.status === "Published" ? "default" : "outline"}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.date}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(post)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Admin;

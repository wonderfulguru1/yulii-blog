import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, LogOut, User, Settings, Tags } from "lucide-react";
import { useAuthContext } from "../contexts/AuthContext";
import { useFirestore } from "../hooks/useFirestore";
import { useCollection } from "../hooks/useFirestore";
import { orderBy, where } from "firebase/firestore";
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
import RichTextEditor from "../components/RichTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import SeedDatabase from "../components/SeedDatabase";
import ImageUpload from "../components/ImageUpload";
import ImageLogo from "../components/ImageLogo";
import { useLogo } from "../contexts/LogoContext";

// Categories are now loaded from Firestore `categories` collection

// Interface for blog post
interface BlogPost {
  id: string;
  title: string;
  category: string;
  status: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  image: string;
  createdAt: any;
  updatedAt: any;
  scheduledAt?: any;
}

const Admin = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const { addDocument, updateDocument, deleteDocument } = useFirestore();
  const { data: posts, loading, error } = useCollection('posts', [orderBy('createdAt', 'desc')]);
  const { data: categoryDocs } = useCollection('categories', [orderBy('name', 'asc')]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const { toast } = useToast();
  const { text } = useLogo();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    excerpt: "",
    image: "",
    status: "Draft",
    scheduledAt: "" as string | Date,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare post data
    const postData = {
      ...formData,
      author: user?.email || 'Admin',
      updatedAt: new Date()
    };

    // Handle scheduled posts
    if (formData.status === "Scheduled" && selectedDate && selectedTime) {
      const scheduledDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      postData.scheduledAt = scheduledDateTime;
    } else if (formData.status === "Scheduled") {
      toast({
        title: "Error",
        description: "Please select both date and time for scheduled posts",
        variant: "destructive",
      });
      return;
    }
    
    if (editingPost) {
      // Update existing post
      const result = await updateDocument('posts', editingPost.id, postData);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update post",
          variant: "destructive",
        });
        return;
      }
    } else {
      // Create new post
      const result = await addDocument('posts', {
        ...postData,
        createdAt: new Date(),
      });
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create post",
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsDialogOpen(false);
    setEditingPost(null);
    setSelectedDate(undefined);
    setSelectedTime("");
    setFormData({
      title: "",
      category: "",
      content: "",
      excerpt: "",
      image: "",
      status: "Draft",
      scheduledAt: "",
    });
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      category: post.category,
      content: post.content || "",
      excerpt: post.excerpt || "",
      image: post.image || "",
      status: post.status,
      scheduledAt: post.scheduledAt ? post.scheduledAt.toDate().toISOString().slice(0, 16) : "",
    });
    
    // Set date and time for scheduled posts
    if (post.scheduledAt) {
      const scheduledDate = post.scheduledAt.toDate();
      setSelectedDate(scheduledDate);
      setSelectedTime(scheduledDate.toTimeString().slice(0, 5));
    } else {
      setSelectedDate(undefined);
      setSelectedTime("");
    }
    
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteDocument('posts', id);
    
    if (result.success) {
      toast({
        title: "Deleted",
        description: "Blog post deleted successfully",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  // Format date for display
  const formatDate = (date: any) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageLogo size="sm" showText={false} />
            <span className="font-bold text-xl">{text} <span className="text-primary">Admin</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <Link to="/blog">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Blog
              </Button>
            </Link>
            <Link to="/admin/categories">
              <Button variant="outline" size="sm">
                <Tags className="h-4 w-4 mr-2" />
                Categories
              </Button>
            </Link>
            <Link to="/logo-manager">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Logo Manager
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
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
            <h1 className="text-4xl font-bold mb-2">{text} Blog Management</h1>
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
                      {(categoryDocs || []).map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
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

                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />

                <div className="space-y-2">
                  <Label htmlFor="content">Content (Rich Text)</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(html) => setFormData({ ...formData, content: html })}
                    placeholder="Write your blog post content here..."
                    minHeight={360}
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
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Schedule Date and Time - Only show when Scheduled is selected */}
                {formData.status === "Scheduled" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Schedule Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Schedule Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="time"
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

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
                      setSelectedDate(undefined);
                      setSelectedTime("");
                      setFormData({
                        title: "",
                        category: "",
                        content: "",
                        excerpt: "",
                        image: "",
                        status: "Draft",
                        scheduledAt: "",
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

        {/* Database Setup */}
        {(!posts || posts.length === 0) && (
          <div className="mb-8">
            <SeedDatabase />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Posts</div>
            <div className="text-3xl font-bold">{posts?.length || 0}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Published</div>
            <div className="text-3xl font-bold text-primary">
              {posts?.filter(p => p.status === "Published").length || 0}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Drafts</div>
            <div className="text-3xl font-bold text-accent">
              {posts?.filter(p => p.status === "Draft").length || 0}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Scheduled</div>
            <div className="text-3xl font-bold text-orange-500">
              {posts?.filter(p => p.status === "Scheduled").length || 0}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Categories</div>
            <div className="text-3xl font-bold">{categoryDocs?.length || 0}</div>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      Loading posts...
                    </div>
                  </TableCell>
                </TableRow>
              ) : posts && posts.length > 0 ? (
                posts.map((post: BlogPost) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-md truncate">
                      {post.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          post.status === "Published" ? "default" : 
                          post.status === "Scheduled" ? "secondary" : 
                          "outline"
                        }
                        className={
                          post.status === "Scheduled" ? "bg-orange-100 text-orange-800 border-orange-200" : ""
                        }
                      >
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.status === "Scheduled" && post.scheduledAt ? 
                        `Scheduled: ${formatDate(post.scheduledAt)}` : 
                        formatDate(post.createdAt)
                      }
                    </TableCell>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No blog posts found. Create your first post!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Admin;

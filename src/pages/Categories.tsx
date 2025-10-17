import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "../hooks/useFirestore";

const Categories = () => {
  const { addDocument, deleteDocument } = useFirestore();
  const { data: categories } = useCollection('categories', []);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    const res = await addDocument('categories', { name: name.trim() });
    setCreating(false);
    if (res.success) {
      setName("");
      toast({ title: "Category created" });
    } else {
      toast({ title: "Failed to create category", description: res.error, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteDocument('categories', id);
    if (res.success) {
      toast({ title: "Category deleted", variant: "destructive" });
    } else {
      toast({ title: "Failed to delete category", description: res.error, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            <span className="font-bold text-xl">Categories</span>
          </div>
          <Link to="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        <Card className="p-6">
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">New Category</Label>
              <div className="flex gap-2">
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Product Updates" />
                <Button type="submit" disabled={!name.trim() || creating}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Existing Categories</h2>
            <span className="text-sm text-muted-foreground">{categories?.length || 0} total</span>
          </div>
          <div className="space-y-2">
            {(categories || []).map((cat: any) => (
              <div key={cat.id} className="flex items-center justify-between border rounded-lg px-4 py-2">
                <span className="font-medium">{cat.name}</span>
                <Button variant="outline" size="sm" onClick={() => handleDelete(cat.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {(!categories || categories.length === 0) && (
              <div className="text-sm text-muted-foreground">No categories yet. Create your first category above.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Categories;




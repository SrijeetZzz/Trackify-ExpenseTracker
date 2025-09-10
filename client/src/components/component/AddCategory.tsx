import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { api } from "@/utils/axiosInstance";
import { Spinner } from "../ui/shadcn-io/spinner";
import { useToast } from "@/hooks/use-toast";

interface AddCategoryDialogProps {
  onCategoryAdded: () => void;
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  onCategoryAdded,
}) => {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  // ✅ validation
  if (!categoryName.trim()) {
    toast({
      variant: "destructive",
      title: "Missing category name ❌",
      description: "Please enter a category name before saving.",
    });
    setLoading(false);
    return;
  }

  try {
    await api.post("/category/create-category", {
      name: categoryName,
      userId,
    });

    toast({
      title: "Category created 🎉",
      description: `"${categoryName}" has been added successfully.`,
    });

    setCategoryName("");
    setOpen(false);
    onCategoryAdded();
  } catch (err: any) {
    console.error("Failed to add category:", err);
    toast({
      variant: "destructive",
      title: "Error adding category ❌",
      description: err?.response?.data?.message || "Something went wrong.",
    });
  } finally {
    setLoading(false);
  }
};
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : "Save Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;

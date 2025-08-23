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

interface AddCategoryDialogProps {
  onCategoryAdded: () => void;
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({ onCategoryAdded }) => {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      await api.post(
        "/category/create-category",
        { name: categoryName, userId },
      );
      setCategoryName("");
      setOpen(false);
      onCategoryAdded(); 
    } catch (err) {
      console.error("Failed to add category:", err);
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
          <Button type="submit">Save Category</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;

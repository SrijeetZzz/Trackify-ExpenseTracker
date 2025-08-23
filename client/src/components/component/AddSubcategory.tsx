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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { api } from "@/utils/axiosInstance";

interface AddSubCategoryDialogProps {
  categories: any[];
}

const AddSubCategoryDialog: React.FC<AddSubCategoryDialogProps> = ({ categories }) => {
  const [open, setOpen] = useState(false);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const userId = localStorage.getItem("userId");
  // const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCategoryName.trim() || !selectedCategory) return;

    try {
      await api.post(
        "/subcategory/create-subcategory",
        { userId, categoryId: selectedCategory, name: subCategoryName }
      );

      setSubCategoryName("");
      setSelectedCategory("");
      setOpen(false);
    } catch (err) {
      console.error("Failed to create subcategory:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Subcategory</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Subcategory</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="subCategoryName">Subcategory Name</Label>
            <Input
              id="subCategoryName"
              placeholder="Enter subcategory name"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={!selectedCategory}>
            Save Subcategory
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubCategoryDialog;

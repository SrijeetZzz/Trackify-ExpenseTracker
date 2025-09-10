import Category from "../models/categories.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name,userId } = req.body;
    const existingCategory = await Category.findOne({ name , userId});
    if (existingCategory) return res.status(400).json({ message: "Category already exists" });

    const category = new Category({ name ,userId});
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const userId = req.user.userId;
    const categories = await Category.find({userId});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update category by id
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Delete category by id
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

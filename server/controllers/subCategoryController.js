import Subcategory from "../models/subcategories.js";

// Create a new subcategory
export const createSubcategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    const existingSubcategory = await Subcategory.findOne({ name });
    if (existingSubcategory) return res.status(400).json({ message: "Subcategory already exists" });

    const subcategory = new Subcategory({ name, categoryId });
    await subcategory.save();

    res.status(201).json(subcategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get all subcategories (optionally populate category)
// export const getSubcategories = async (req, res) => {
//   try {
//     const subcategories = await Subcategory.find().populate("categoryId");
//     res.json(subcategories);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// Update subcategory by id
export const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId } = req.body;

    const subcategory = await Subcategory.findByIdAndUpdate(id, { name, categoryId }, { new: true });
    if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });

    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Delete subcategory by id
export const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.findByIdAndDelete(id);
    if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });

    res.json({ message: "Subcategory deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

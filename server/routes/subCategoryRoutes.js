import express from "express";
import { createSubcategory, deleteSubcategory, getSubcategories, updateSubcategory } from "../controllers/subCategoryController.js"
import { verifyAccessToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-subcategory", verifyAccessToken, createSubcategory);
router.get("/get-subcategories", verifyAccessToken, getSubcategories);
router.put("/update-subcategory/:id",verifyAccessToken,updateSubcategory);
router.delete("/delete-category/:id",verifyAccessToken,deleteSubcategory);

export default router;

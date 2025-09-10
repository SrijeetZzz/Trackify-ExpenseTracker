import express from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/categoryController.js";
import { verifyAccessToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-category", verifyAccessToken, createCategory);
router.get("/get-categories", verifyAccessToken, getCategories);
router.put("/update-category/:id",verifyAccessToken,updateCategory);
router.delete("/delete-category/:id",verifyAccessToken,deleteCategory);

export default router;

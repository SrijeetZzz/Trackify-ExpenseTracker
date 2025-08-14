import express from "express";
import { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense } from "../controllers/expenseController.js";
import { verifyAccessToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-expense", verifyAccessToken, createExpense);         // Create
router.get("/get-expenses", verifyAccessToken, getExpenses);            // Read all
router.get("/get-expense/:id", verifyAccessToken, getExpenseById);      // Read single
router.put("/update-expense/:id", verifyAccessToken, updateExpense);       // Update
router.delete("/delete-expense/:id", verifyAccessToken, deleteExpense);    // Delete

export default router;

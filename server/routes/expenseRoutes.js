import express from "express";
import { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense, createMultipleExpenses } from "../controllers/expenseController.js";
import { verifyAccessToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-expense", verifyAccessToken, createExpense);   
router.post("/create-multiple-expenses",verifyAccessToken,createMultipleExpenses)      
router.get("/get-expenses", verifyAccessToken, getExpenses);            
router.get("/get-expense/:id", verifyAccessToken, getExpenseById);    
router.put("/update-expense/:id", verifyAccessToken, updateExpense);       
router.delete("/delete-expense/:id", verifyAccessToken, deleteExpense);    

export default router;

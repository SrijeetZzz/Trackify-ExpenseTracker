import express from "express";
import { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense, createMultipleExpenses, getDailyExpenses, getExpensesByCategory, getSubcategoryExpenses, getExpensesForSettlement, getSplitExpenses, getUserCashFlow, getMonthlyExpenses } from "../controllers/expenseController.js";
import { verifyAccessToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-expense", verifyAccessToken, createExpense);   
router.post("/create-multiple-expenses",verifyAccessToken,createMultipleExpenses)      
router.get("/get-expenses", verifyAccessToken, getExpenses);  
router.get("/get-split-expenses",verifyAccessToken,getSplitExpenses);      
router.get("/get-expense/:id", verifyAccessToken, getExpenseById);    
router.put("/update-expense/:id", verifyAccessToken, updateExpense);       
router.delete("/delete-expense/:id", verifyAccessToken, deleteExpense);    

router.get("/daily-summary", verifyAccessToken, getDailyExpenses);
router.get("/by-category", verifyAccessToken, getExpensesByCategory);
router.get("/by-subcategory", verifyAccessToken, getSubcategoryExpenses);
router.get("/get-expense/:grpId/:participantId", verifyAccessToken, getExpensesForSettlement);
router.get("/get-expenses-monthwise",verifyAccessToken,getMonthlyExpenses);


export default router;

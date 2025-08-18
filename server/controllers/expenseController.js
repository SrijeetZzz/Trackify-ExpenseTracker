import Expense from "../models/expenses.js";
import mongoose from "mongoose";

// Create Expense
export const createExpense = async (req, res) => {
    try {
        const { amount, date, category, subcategory, desc, paid, paymentMode, reccurExpense, occuranceDuration, occuranceDate } = req.body;

        const expense = new Expense({
            amount,
            date,
            category,
            subcategory,
            desc,
            paid,
            paymentMode,
            reccurExpense,
            occuranceDuration,
            occuranceDate,
            userId: req.user.userId 
        });

        await expense.save();
        res.status(201).json(expense);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//add multiple expense

export const createMultipleExpenses = async (req, res) => {
    try {
        const { expenses, userId } = req.body; 

        if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
            return res.status(400).json({ message: "No expenses provided" });
        }

        // Add userId to each expense
        const expensesToSave = expenses.map(exp => ({
            ...exp,
            userId
        }));

        // Save all expenses at once using insertMany
        const savedExpenses = await Expense.insertMany(expensesToSave);

        res.status(201).json(savedExpenses);
    } catch (err) {
         console.error("Error saving expenses:", err);
        res.status(500).json({ message: err.message });
    }
};


export const getExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const expenses = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },

      {
        $lookup: {
          from: "categories", // MongoDB collection name for categories
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $lookup: {
          from: "subcategories", // MongoDB collection name for subcategories
          localField: "subcategory",
          foreignField: "_id",
          as: "subcategoryInfo",
        },
      },
      {
        $addFields: {
          category: { $arrayElemAt: ["$categoryInfo.name", 0] },
          subcategory: { $arrayElemAt: ["$subcategoryInfo.name", 0] },
          status: { $cond: ["$paid", "Paid", "Unpaid"] },
        },
      },
      { $project: { categoryInfo: 0, subcategoryInfo: 0, paid: 0, __v: 0 } },
      { $sort: { date: -1 } },
    ]);

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get Single Expense
export const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!expense) return res.status(404).json({ message: "Expense not found" });
        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Expense
export const updateExpense = async (req, res) => {
    try {
        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true }
        );
        if (!updatedExpense) return res.status(404).json({ message: "Expense not found" });
        res.json(updatedExpense);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete Expense
export const deleteExpense = async (req, res) => {
    try {
        const deleted = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!deleted) return res.status(404).json({ message: "Expense not found" });
        res.json({ message: "Expense deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

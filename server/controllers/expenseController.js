import Expense from "../models/expenses.js";
import mongoose from "mongoose";

// Create Expense
export const createExpense = async (req, res) => {
  try {
    const {
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
    } = req.body;

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
      userId: req.user.userId,
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
    const expensesToSave = expenses.map((exp) => ({
      ...exp,
      userId,
    }));

    // Save all expenses at once using insertMany
    const savedExpenses = await Expense.insertMany(expensesToSave);

    res.status(201).json(savedExpenses);
  } catch (err) {
    console.error("Error saving expenses:", err);
    res.status(500).json({ message: err.message });
  }
};

// get all expenses of a user with pagination, filtering, and sorting
export const getExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const { categoryId, subcategoryId, paymentMode, sortField, sortOrder } = req.query;

    // Build dynamic match object
    const match = { userId: new mongoose.Types.ObjectId(userId) };
    if (categoryId) match.category = new mongoose.Types.ObjectId(categoryId);
    if (subcategoryId) match.subcategory = new mongoose.Types.ObjectId(subcategoryId);
    if (paymentMode) match.paymentMode = paymentMode;

    // Count total docs for pagination
    const totalDocs = await Expense.countDocuments(match);

    // Determine sorting
    let sort = { date: -1 }; // default sort by date desc
    if (sortField && sortOrder) {
      const order = sortOrder === "asc" ? 1 : -1;
      sort = { [sortField]: order };
    }

    const expenses = await Expense.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "result1",
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategory",
          foreignField: "_id",
          as: "result2",
        },
      },
      { $unwind: "$result1" },
      { $unwind: "$result2" },
      {
        $project: {
          _id: 1,
          amount: 1,
          category: 1,
          subcategory: 1,
          date: 1,
          paid: 1,
          paymentMode: 1,
          categoryName: "$result1.name",
          subcategoryName: "$result2.name",
        },
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ]);

    res.json({
      expenses,
      currentPage: page,
      totalPages: Math.ceil(totalDocs / limit),
      totalExpenses: totalDocs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Expense
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
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
    if (!updatedExpense)
      return res.status(404).json({ message: "Expense not found" });
    res.json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Expense
export const deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!deleted) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get user expense for days

export const getDailyExpenses = async (req, res) => {
  const userId = req.user.userId;
  const days = parseInt(req.query.days) || 30;

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1); 

    const dailySummary = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(dailySummary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch daily expenses" });
  }
};

//get expense by category

export const getExpensesByCategory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const days = parseInt(req.query.days) || 30;

    // Calculate startDate based on days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);

    // Aggregate expenses by category
    const expensesByCategory = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate }, // filter by startDate
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },
      {
        $project: {
          _id: 0,
          categoryId: "$categoryDetails._id",
          categoryName: "$categoryDetails.name",
          total: 1,
        },
      },
    ]);

    return res.status(200).json(expensesByCategory);
  } catch (err) {
    console.error("Failed to fetch expenses by category:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// get expense by sub cat of a certain cat
export const getSubcategoryExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { categoryId, days } = req.query;

    if (!categoryId) {
      return res.status(400).json({ message: "categoryId is required" });
    }

    let startDate;
    if (days) {
      const daysNum = Number(days);
      startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);
    }

    const match = {
      userId: new mongoose.Types.ObjectId(userId),
      category: new mongoose.Types.ObjectId(categoryId),
    };

    if (startDate) {
      match.date = { $gte: startDate };
    }

    const subcategoryData = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$subcategory",
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "subcategories", 
          localField: "_id",
          foreignField: "_id",
          as: "subcategoryDetails",
        },
      },
      { $unwind: "$subcategoryDetails" },
      {
        $project: {
          _id: 0,
          subcategoryId: "$subcategoryDetails._id",
          subcategoryName: "$subcategoryDetails.name",
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json(subcategoryData);
  } catch (err) {
    console.error("Failed to fetch subcategory expenses:", err);
    res.status(500).json({ message: "Server error" });
  }
};

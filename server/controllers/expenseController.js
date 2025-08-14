import Expense from "../models/expenses.js";

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

// Get All Expenses for Logged-in User
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.userId });
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

const ExpenseSchema = require("../models/ExpenseModel");

// Add a new expense
exports.addExpense = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    // Validation checks
    if (!title || !category || !description || !date) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    if (amount <= 0 || typeof amount !== 'number') {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    try {
        const expense = new ExpenseSchema({
            title,
            amount,
            category,
            description,
            date,
            type: 'expense'
        });

        await expense.save();
        res.status(201).json({ message: 'Expense Added', data: expense });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all expenses
exports.getExpense = async (req, res) => {
    try {
        const expenses = await ExpenseSchema.find().sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a specific expense by ID
exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    ExpenseSchema.findByIdAndDelete(id)
        .then(() => {
            res.status(200).json({ message: 'Expense Deleted' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Server Error' });
        });
};

const ExpenseSchema = require("../models/ExpenseModel");

exports.addExpense = async (req, res) => {
    const { title, amount, category, description, date } = req.body;
    
    try {
        // Validation checks
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        
        if (!amount || amount <= 0 || typeof amount !== 'number') {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }

        // Create expense with user ID from auth middleware
        const expense = new ExpenseSchema({
            title,
            amount,
            category,
            description,
            date,
            user: req.user.id // Associate with authenticated user
        });

        await expense.save();
        res.status(201).json({ 
            message: 'Expense Added Successfully', 
            data: expense 
        });
        
    } catch (error) {
        console.error('Add Expense Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getExpense = async (req, res) => {
    try {
        // Only get expenses for the authenticated user
        const expenses = await ExpenseSchema.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
        
    } catch (error) {
        console.error('Get Expenses Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Check if expense exists and belongs to user
        const expense = await ExpenseSchema.findOne({ 
            _id: id, 
            user: req.user.id 
        });
        
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or unauthorized' });
        }
        
        await ExpenseSchema.findByIdAndDelete(id);
        res.status(200).json({ 
            message: 'Expense Deleted Successfully',
            deletedId: id
        });
        
    } catch (error) {
        console.error('Delete Expense Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

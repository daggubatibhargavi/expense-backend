const IncomeSchema = require("../models/IncomeModel");

exports.addIncome = async (req, res) => {
    const { title, amount, category, description, date } = req.body;
    
    try {
        // Validations
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        
        // Fixed validation logic - was using incorrect operator
        if (!amount || amount <= 0 || typeof amount !== 'number') {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }

        // Create income with user ID from auth middleware
        const income = new IncomeSchema({
            title,
            amount,
            category,
            description,
            date,
            user: req.user.id // Associate with authenticated user
        });

        await income.save();
        res.status(201).json({ 
            message: 'Income Added Successfully', 
            data: income 
        });
        
    } catch (error) {
        console.error('Add Income Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getIncomes = async (req, res) => {
    try {
        // Only get incomes for the authenticated user
        const incomes = await IncomeSchema.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: incomes.length,
            data: incomes
        });
        
    } catch (error) {
        console.error('Get Incomes Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Check if income exists and belongs to user
        const income = await IncomeSchema.findOne({ 
            _id: id, 
            user: req.user.id 
        });
        
        if (!income) {
            return res.status(404).json({ message: 'Income not found or unauthorized' });
        }
        
        await IncomeSchema.findByIdAndDelete(id);
        res.status(200).json({ 
            message: 'Income Deleted Successfully',
            deletedId: id
        });
        
    } catch (error) {
        console.error('Delete Income Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

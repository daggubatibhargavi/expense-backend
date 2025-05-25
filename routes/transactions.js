// Your existing routes with minimal additions
const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const { registerUser, loginUser, getUserProfile } = require('../controllers/auth'); // ADD THIS LINE
const authMiddleware = require('../middleware/authMiddleware');
const router = require('express').Router();

// ADD THIS: Root route to fix "Cannot GET /" error
router.get('/', (req, res) => {
  res.json({ 
    message: 'Expense Tracker API is running!',
    status: 'Active'
  });
});

// ADD THESE: Authentication routes (no middleware needed for register/login)
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile);

// Your existing routes (keep exactly as they are)
router.post('/add-income', authMiddleware, addIncome);
router.get('/get-incomes', authMiddleware, getIncomes);
router.delete('/delete-income/:id', authMiddleware, deleteIncome);

router.post('/add-expense', authMiddleware, addExpense);
router.get('/get-expenses', authMiddleware, getExpense);
router.delete('/delete-expense/:id', authMiddleware, deleteExpense);

module.exports = router;

const express = require('express');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { 
  addFuelLog, 
  getAllFuelLogs, 
  addExpense, 
  getAllExpenses 
} = require('../controllers/financeController');

const router = express.Router();

// GET    /api/finance/fuel
// Fetch all fuel logs
router.get(
  '/fuel',
//   verifyToken,
//   checkRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']),
  getAllFuelLogs
);

// POST   /api/finance/fuel/create
// Create a new fuel log
router.post(
  '/fuel/create',
//   verifyToken,
//   checkRole(['FLEET_MANAGER', 'DISPATCHER']),
  addFuelLog
);

// GET    /api/finance/expenses
// Fetch all expenses
router.get(
  '/expenses',
//   verifyToken,
//   checkRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']),
  getAllExpenses
);

// POST   /api/finance/expenses/create
// Create a new expense record
router.post(
  '/expenses/create',
//   verifyToken,
//   checkRole(['FLEET_MANAGER', 'DISPATCHER']),
  addExpense
);

module.exports = router;
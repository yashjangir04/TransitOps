const express = require('express');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { getDashboardSummary } = require('../controllers/analyticsController');

const router = express.Router();

//   GET /api/analytics/dashboard
router.get(
  '/dashboard', 
//   verifyToken, 
//   checkRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']), 
  getDashboardSummary
);

module.exports = router;
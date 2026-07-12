const express = require('express');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { 
  createDriver, 
  getAllDrivers, 
  updateDriverStatus,
  getAvailableDrivers 
} = require('../controllers/driverController');

const router = express.Router();

// Route-> GET /api/drivers (Accessible by most roles so they can view the list)
router.get(
  '/', 
//   verifyToken, 
//   checkRole(['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER']), 
  getAllDrivers
);

// Route-> GET /api/drivers/available (Accessible by most roles so they can view the list)
router.get(
  '/available', 
//   verifyToken, 
//   checkRole(['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER']), 
  getAvailableDrivers
);

// Route-> POST /api/drivers/create (Restricted to management/safety)
router.post(
  '/create', 
//   verifyToken, 
//   checkRole(['FLEET_MANAGER', 'SAFETY_OFFICER']), 
  createDriver
);

// Route-> PATCH /api/drivers/:driverId/status (Used to suspend drivers or mark them off duty)
router.patch(
  '/:driverId/status', 
//   verifyToken, 
//   checkRole(['FLEET_MANAGER', 'SAFETY_OFFICER']), 
  updateDriverStatus
);

module.exports = router;
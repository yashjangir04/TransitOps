const express = require('express');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { 
  getVehicles, 
  createVehicle 
} = require('../controllers/vehicleController');

const router = express.Router();

/**
 * GET /api/vehicles
 * Fetch a list of all vehicles (supports filtering and search)
 *  Private (Operations, Safety, and Finance teams)
 */
router.get(
  '/', 
//   verifyToken, 
//   checkRole(['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST']), 
  getVehicles
);

/**
 *  POST /api/vehicles
 *  Add a new vehicle to the registry
 *  Private (Strictly Fleet Managers)
 */
router.post(
  '/', 
//   verifyToken, 
//   checkRole(['FLEET_MANAGER']),  
  createVehicle
);

module.exports = router;
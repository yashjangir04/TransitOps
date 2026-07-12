const express = require('express');
const router = express.Router();
 
const { 
    getVehicles, 
    createVehicle 
} = require('../controllers/vehicleController');
const { verifyToken } = require('../middlewares/authMiddleware');
 
/**
 * @route   GET /api/vehicles
 * @desc    Fetch a list of all vehicles (supports filtering and search)
 * @access  Private (Requires valid JWT)
 */

router.route('/').get(verifyToken, getVehicles)

/**
* @route   POST /api/vehicles
* @desc    Add a new vehicle to the registry
* @access  Private (Requires valid JWT)
*/

router.route('/').post(verifyToken, createVehicle);

module.exports = router;
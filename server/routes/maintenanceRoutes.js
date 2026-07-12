const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const { 
    getMaintenanceLogs, 
    createMaintenanceLog, 
    updateMaintenanceLog 
} = require('../controllers/maintenanceController');

/**
 * @route   GET /api/maintenance
 * @desc    Fetch all maintenance logs (populates the Service Log table)
 * @access  Private (Requires valid JWT)
 * 
 * * @route   POST /api/maintenance
 * @desc    Log a new service record and automatically update vehicle status to IN_SHOP
 * @access  Private (Requires valid JWT)
 */
router.route('/')
    .get(verifyToken, getMaintenanceLogs)
    .post(verifyToken, createMaintenanceLog);

/**
 * @route   PUT /api/maintenance/:id
 * @desc    Update a log (specifically used to CLOSE a log and free up the vehicle)
 * @access  Private (Requires valid JWT)
 */
router.route('/:id')
    .put(verifyToken, updateMaintenanceLog);

module.exports = router;
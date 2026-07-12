const express = require('express');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { 
  createTrip,
  updateTrip,
  getAllTrips,
  dispatchTrip, 
  cancelTrip,
  completeTrip 
} = require('../controllers/tripController');

const router = express.Router();

// GET /api/trips
// Live Board: View all trips
router.get(
  '/',
  // verifyToken,
  // checkRole(['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST']),
  getAllTrips
);

// POST /api/trips/create
// Create a new DRAFT trip
router.post(
  '/create',
  // verifyToken,
  // checkRole(['FLEET_MANAGER', 'DISPATCHER']),
  createTrip
);

// PATCH /api/trips/:tripId
// Update a DRAFT trip (e.g., assign driver/vehicle)
router.patch(
  '/:tripId',
  // verifyToken,
  // checkRole(['FLEET_MANAGER', 'DISPATCHER']),
  updateTrip
);

// POST /api/trips/:tripId/dispatch
// Attempt to Dispatch (Runs all validations)
router.post(
  '/:tripId/dispatch',
  // verifyToken,
  // checkRole(['FLEET_MANAGER', 'DISPATCHER']),
  dispatchTrip
);

// POST /api/trips/:tripId/cancel
// Cancel Trip (Frees assets if dispatched)
router.post(
  '/:tripId/cancel',
  // verifyToken,
  // checkRole(['FLEET_MANAGER', 'DISPATCHER']),
  cancelTrip
);

// POST /api/trips/:tripId/complete
// Complete Trip (Logs fuel, updates odometer, frees assets)
router.post(
  '/:tripId/complete',
  // verifyToken,
  // checkRole(['FLEET_MANAGER', 'DISPATCHER']),
  completeTrip
);

module.exports = router;
const express = require('express');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { 
  getVehicles, 
  createVehicle,
  updateVehicleStatus,
  deleteVehicle
} = require('../controllers/vehicleController');

const router = express.Router();

router.get('/', getVehicles);
router.post('/', createVehicle);
router.patch('/:id/status', updateVehicleStatus);
router.delete('/:id', deleteVehicle);

module.exports = router;
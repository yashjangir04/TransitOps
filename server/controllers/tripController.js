const prismaClient = require('../config/db');

const createTrip = async (request, response) => {
  try {
    const { source, destination, cargoWeightKg, plannedDistance, vehicleId, driverId, revenue } = request.body;

    const generatedTripNumber = `TRIP-${Date.now().toString().slice(-6)}`;

    const newTripRecord = await prismaClient.trip.create({
      data: {
        source: source,
        tripNumber: generatedTripNumber,
        destination: destination,
        cargoWeightKg: cargoWeightKg,
        plannedDistance: plannedDistance,
        revenue: revenue || 0,
        status: 'DRAFT', 
        vehicleId: vehicleId || null,
        driverId: driverId || null
      }
    });

    response.status(201).json({ message: 'Draft trip created successfully', data: newTripRecord });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error while creating draft trip' });
  }
};

const updateTrip = async (request, response) => {
  const { tripId } = request.params;
  const updateData = request.body;

  try {
    const existingTrip = await prismaClient.trip.findUnique({ where: { id: parseInt(tripId) } });
    if (!existingTrip || existingTrip.status !== 'DRAFT') {
      return response.status(400).json({ error: 'Only Draft trips can be freely updated' });
    }

    const updatedTripRecord = await prismaClient.trip.update({
      where: { id: parseInt(tripId) },
      data: updateData
    });

    response.json({ message: 'Trip updated successfully', data: updatedTripRecord });
  } catch (error) {
    response.status(500).json({ error: 'Internal server error while updating trip' });
  }
};

const getAllTrips = async (request, response) => {
  try {
    const allTripRecords = await prismaClient.trip.findMany({
      include: {
        vehicle: { select: { registrationNumber: true, maxCapacityKg: true } },
        driver: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    response.json({ message: 'Live board retrieved successfully', data: allTripRecords });
  } catch (error) {
    response.status(500).json({ error: 'Internal server error while fetching trips' });
  }
};

const dispatchTrip = async (request, response) => {
  const { tripId } = request.params;
  
  try {
    const tripRecord = await prismaClient.trip.findUnique({
      where: { id: parseInt(tripId) },
      include: { vehicle: true, driver: true }
    });
    
    if (!tripRecord) return response.status(404).json({ error: 'Trip not found' });
    if (tripRecord.status !== 'DRAFT') return response.status(400).json({ error: 'Only Draft trips can be dispatched' });
    
    const assignedVehicle = tripRecord.vehicle;
    const assignedDriver = tripRecord.driver;

    if (!assignedVehicle || !assignedDriver) {
      return response.status(400).json({ error: 'Cannot dispatch: Vehicle and Driver must be assigned' });
    }
    if (assignedVehicle.status !== 'AVAILABLE') return response.status(400).json({ error: 'Vehicle is not currently available' });
    if (assignedDriver.status !== 'AVAILABLE') return response.status(400).json({ error: 'Driver is not currently available' });
    
    if (tripRecord.cargoWeightKg > assignedVehicle.maxCapacityKg) {
      return response.status(400).json({ 
        error: `Capacity exceeded by ${tripRecord.cargoWeightKg - assignedVehicle.maxCapacityKg} kg — dispatch blocked` 
      });
    }

    const transactionResult = await prismaClient.$transaction([
      prismaClient.trip.update({ where: { id: tripRecord.id }, data: { status: 'DISPATCHED' } }),
      prismaClient.vehicle.update({ where: { id: assignedVehicle.id }, data: { status: 'ON_TRIP' } }),
      prismaClient.driver.update({ where: { id: assignedDriver.id }, data: { status: 'ON_TRIP' } })
    ]);

    response.json({ message: 'Trip dispatched successfully', data: transactionResult[0] });
  } catch (error) {
    response.status(500).json({ error: 'Internal server error while dispatching' });
  }
};

const cancelTrip = async (request, response) => {
  const { tripId } = request.params;

  try {
    const tripRecord = await prismaClient.trip.findUnique({ where: { id: parseInt(tripId) } });
    if (!tripRecord || ['COMPLETED', 'CANCELLED'].includes(tripRecord.status)) {
      return response.status(400).json({ error: 'Cannot cancel a trip that is already completed or cancelled' });
    }

    const transactionOperations = [
      prismaClient.trip.update({ where: { id: tripRecord.id }, data: { status: 'CANCELLED' } })
    ];

    if (tripRecord.status === 'DISPATCHED') {
      transactionOperations.push(
        prismaClient.vehicle.update({ where: { id: tripRecord.vehicleId }, data: { status: 'AVAILABLE' } }),
        prismaClient.driver.update({ where: { id: tripRecord.driverId }, data: { status: 'AVAILABLE' } })
      );
    }

    const transactionResult = await prismaClient.$transaction(transactionOperations);
    response.json({ message: 'Trip cancelled successfully', data: transactionResult[0] });
  } catch (error) {
    response.status(500).json({ error: 'Internal server error while cancelling trip' });
  }
};

const completeTrip = async (request, response) => {
  const { tripId } = request.params;
  const { finalOdometer, fuelLiters, fuelCost, finalRevenue } = request.body || {};

  try {
    const tripRecord = await prismaClient.trip.findUnique({ where: { id: parseInt(tripId) }, include: { vehicle: true } });
    if (!tripRecord || tripRecord.status !== 'DISPATCHED') return response.status(400).json({ error: 'Only dispatched trips can be completed' });

    const newOdometer = finalOdometer !== undefined ? finalOdometer : (tripRecord.vehicle?.odometer || 0) + (tripRecord.plannedDistance || 0);

    const transactionOperations = [
      prismaClient.trip.update({ where: { id: tripRecord.id }, data: { status: 'COMPLETED', revenue: finalRevenue !== undefined ? finalRevenue : tripRecord.revenue } }),
      prismaClient.vehicle.update({ where: { id: tripRecord.vehicleId }, data: { status: 'AVAILABLE', odometer: newOdometer } }),
      prismaClient.driver.update({ where: { id: tripRecord.driverId }, data: { status: 'AVAILABLE' } })
    ];

    if (fuelLiters !== undefined && fuelCost !== undefined) {
      transactionOperations.push(
        prismaClient.fuelLog.create({
          data: { liters: fuelLiters, cost: fuelCost, vehicleId: tripRecord.vehicleId, tripId: tripRecord.id }
        })
      );
    }

    const transactionResult = await prismaClient.$transaction(transactionOperations);
    response.json({ message: 'Trip completed and assets released', data: transactionResult[0] });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error while completing trip' });
  }
};

module.exports = { createTrip, updateTrip, getAllTrips, dispatchTrip, cancelTrip, completeTrip };